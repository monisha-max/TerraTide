from flask import Flask, request, jsonify, render_template_string
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import io
import base64

# Use the Agg backend for Matplotlib
import matplotlib
matplotlib.use('Agg')

app = Flask(__name__)

# Specify the path to your CSV file
file_path = 'combined_data.csv'

# Read the CSV file into a DataFrame
df_combined = pd.read_csv(file_path)

# Data preprocessing
df_combined['Month'] = df_combined['Date & Time'].str.extract(r'^(\d{1,2})/')[0].astype(int)
df_combined.fillna(0, inplace=True)
df_combined = df_combined.loc[:, ~df_combined.columns.str.contains(r'\binside\b', case=False, regex=True)]

# Convert 'Heat Index - °C' to numeric, forcing errors to NaN
df_combined['Heat Index - °C'] = pd.to_numeric(df_combined['Heat Index - °C'], errors='coerce')

# Drop rows with NaN values in 'Heat Index - °C' if any
df_combined = df_combined.dropna(subset=['Heat Index - °C'])

# Convert 'Date & Time' column to datetime format
df_combined['Date & Time'] = pd.to_datetime(df_combined['Date & Time'], errors='coerce')

# Drop rows with NaN values in 'Date & Time' if any
df_combined = df_combined.dropna(subset=['Date & Time'])

# Extract date and time
df_combined['Date'] = df_combined['Date & Time'].dt.date
df_combined['Time'] = df_combined['Date & Time'].dt.time

# Function to perform additional analyses and plot heatmap
def plot_heatmap(start_date, end_date):
    # Convert input dates to datetime objects
    start_date = pd.to_datetime(start_date).date()
    end_date = pd.to_datetime(end_date).date()

    # Calculate number of days in the range
    num_days = (end_date - start_date).days + 1

    # Filter DataFrame based on date range
    filtered_df = df_combined[(df_combined['Date'] >= start_date) & (df_combined['Date'] <= end_date)]

    # Check if filtered_df is empty
    if filtered_df.empty:
        return None, None

    # Initialize a string to store analysis results
    analysis_results = ""

    # Find the maximum heat index and the corresponding date and time
    max_heat_index = filtered_df['Heat Index - °C'].max()
    max_heat_index_row = filtered_df[filtered_df['Heat Index - °C'] == max_heat_index]
    max_heat_index_date = max_heat_index_row['Date & Time'].iloc[0]
    analysis_results += f"<p>The highest Heat Index recorded was {max_heat_index:.2f}°C on {max_heat_index_date}.</p>"

    # Identify specific days with unusually high heat index values
    daily_max_heat_index = filtered_df.groupby('Date')['Heat Index - °C'].max()
    high_heat_days = daily_max_heat_index[daily_max_heat_index > max_heat_index * 0.9]
    if not high_heat_days.empty:
        analysis_results += "<p>Specific days with unusually high Heat Index values:</p><ul>"
        for date, value in high_heat_days.items():
            analysis_results += f"<li>{date}: {value:.2f}°C</li>"
        analysis_results += "</ul>"

    # Heatwave indicators: consecutive days with high heat index values
    heatwave_days = daily_max_heat_index.rolling(window=3).min() > max_heat_index * 0.85
    heatwave_periods = heatwave_days[heatwave_days].index
    if not heatwave_periods.empty:
        analysis_results += "<p>Heatwave periods identified (3 or more consecutive days):</p><ul>"
        for date in heatwave_periods:
            analysis_results += f"<li>{date}</li>"
        analysis_results += "</ul>"

    # Temporal patterns or trends
    avg_heat_index_by_time = filtered_df.groupby('Time')['Heat Index - °C'].mean()
    analysis_results += "<p>Average Heat Index by Time of Day (across selected dates):</p><ul>"
    for time, value in avg_heat_index_by_time.items():
        analysis_results += f"<li>{time}: {value:.2f}°C</li>"
    analysis_results += "</ul>"

    # Anomalous data points
    mean_heat_index = filtered_df['Heat Index - °C'].mean()
    std_dev_heat_index = filtered_df['Heat Index - °C'].std()
    anomalies = filtered_df[(filtered_df['Heat Index - °C'] > mean_heat_index + 2 * std_dev_heat_index) |
                            (filtered_df['Heat Index - °C'] < mean_heat_index - 2 * std_dev_heat_index)]
    if not anomalies.empty:
        analysis_results += "<p>Anomalous Heat Index values detected:</p><ul>"
        for _, row in anomalies.iterrows():
            analysis_results += f"<li>{row['Date & Time']}: {row['Heat Index - °C']:.2f}°C</li>"
        analysis_results += "</ul>"

    # Pivot table to create a matrix for the heatmap
    heatmap_data = filtered_df.pivot_table(index='Time', columns='Date', values='Heat Index - °C', aggfunc='mean')

    # Adjust figure size to decrease image size
    fig_width = max(10, num_days * 0.4)  # Reduced width
    fig_height = 6  # Reduced height

    # Plotting the heatmap
    plt.figure(figsize=(fig_width, fig_height), dpi=150)
    sns.heatmap(heatmap_data, cmap='coolwarm', annot=False, cbar_kws={'label': 'Heat Index (°C)'},
                linewidths=0.5, linecolor='grey')
    plt.title(f'Heat Index Heatmap from {start_date} to {end_date}')
    plt.xlabel('Date')
    plt.ylabel('Time')
    plt.xticks(rotation=45)
    plt.tight_layout()

    # Save the plot to a bytes buffer
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    plt.close()

    # Encode the image to base64
    img_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')

    return img_base64, analysis_results

@app.route('/generate-heatmap', methods=['GET'])
def generate_heatmap():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    if not start_date or not end_date:
        return jsonify({'error': 'Please provide both start_date and end_date parameters.'}), 400

    try:
        heatmap_image, analysis_results = plot_heatmap(start_date, end_date)
        if heatmap_image:
            # Generate HTML with heatmap image first and then analysis results
            html_content = f"""
            <html>
            <head>
                <style>
                    body {{
                        background: linear-gradient(135deg, #22c1c3, #6ebf8f, #fdbb2d);
                        color: white;
                        font-family: Arial, sans-serif;
                    }}
                    h2 {{
                        color: #ffffff;
                    }}
                    p, ul {{
                        color: #ffffff;
                    }}
                </style>
            </head>
            <body>
                <h2>Heatmap Image</h2>
                <img src="data:image/png;base64,{heatmap_image}" alt="Heatmap" style="max-width:100%;">
                <h2>Heatmap Analysis</h2>
                {analysis_results}
            </body>
            </html>
            """
            return render_template_string(html_content)
        else:
            return jsonify({'message': 'No data available for the selected date range.'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
