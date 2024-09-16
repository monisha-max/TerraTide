from flask import Flask, render_template, request, redirect, url_for
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64

app = Flask(__name__)

# Load your CSV data (you can also do this in a function for better management)
df_combined = pd.read_csv('combined_data.csv')

# Function to process data and generate plots
def process_data(start_date, end_date):
    df_combined['Date & Time'] = pd.to_datetime(df_combined['Date & Time'], errors='coerce')
    df_combined.dropna(subset=['Date & Time'], inplace=True)
    
    start_date = pd.to_datetime(start_date)
    end_date = pd.to_datetime(end_date)

    filtered_df = df_combined[(df_combined['Date & Time'] >= start_date) & (df_combined['Date & Time'] <= end_date)]

    if filtered_df.empty:
        return None, None

    # Replace non-numeric values (e.g., '--') with NaN
    filtered_df['Temp - °C'] = pd.to_numeric(filtered_df['Temp - °C'], errors='coerce')
    filtered_df['Hum - %'] = pd.to_numeric(filtered_df['Hum - %'], errors='coerce')
    filtered_df['Dew Point - °C'] = pd.to_numeric(filtered_df['Dew Point - °C'], errors='coerce')

    # Drop rows with NaN values after conversion
    filtered_df.dropna(subset=['Temp - °C', 'Hum - %', 'Dew Point - °C'], inplace=True)

    # Plot generation
    img = io.BytesIO()

    plt.figure(figsize=(14, 12))

    plt.subplot(3, 1, 1)
    plt.plot(filtered_df['Date & Time'], filtered_df['Temp - °C'], label='Temperature (°C)', color='r')
    plt.title('Temperature Trend')
    plt.ylabel('Temperature (°C)')
    plt.grid(True)

    plt.subplot(3, 1, 2)
    plt.plot(filtered_df['Date & Time'], filtered_df['Hum - %'], label='Humidity (%)', color='b')
    plt.title('Humidity Trend')
    plt.ylabel('Humidity (%)')
    plt.grid(True)

    plt.subplot(3, 1, 3)
    plt.plot(filtered_df['Date & Time'], filtered_df['Dew Point - °C'], label='Dew Point (°C)', color='g')
    plt.title('Dew Point Trend')
    plt.xlabel('Date & Time')
    plt.ylabel('Dew Point (°C)')
    plt.grid(True)

    plt.tight_layout()
    plt.savefig(img, format='png')
    plt.close()
    img.seek(0)
    plot_url = base64.b64encode(img.getvalue()).decode('utf8')

    # Correlation Analysis Heatmap
    correlation_matrix = filtered_df[['Temp - °C', 'Hum - %', 'Dew Point - °C']].corr()
    heatmap_img = io.BytesIO()

    plt.figure(figsize=(8, 6))
    sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', linewidths=0.5)
    plt.title('Correlation Analysis between Temperature, Humidity, and Dew Point')
    plt.savefig(heatmap_img, format='png')
    plt.close()
    heatmap_img.seek(0)
    heatmap_url = base64.b64encode(heatmap_img.getvalue()).decode('utf8')

    # Temperature Trend Analysis
    temp_max = filtered_df['Temp - °C'].max()
    temp_min = filtered_df['Temp - °C'].min()
    temp_peaks = filtered_df[filtered_df['Temp - °C'] == temp_max]['Date & Time'].values[0]
    temp_drops = filtered_df[filtered_df['Temp - °C'] == temp_min]['Date & Time'].values[0]

    # Humidity Trend Analysis
    correlation_temp_humidity = filtered_df['Temp - °C'].corr(filtered_df['Hum - %'])
    hum_max = filtered_df['Hum - %'].max()
    hum_min = filtered_df['Hum - %'].min()
    hum_peaks = filtered_df[filtered_df['Hum - %'] == hum_max]['Date & Time'].values[0]
    hum_drops = filtered_df[filtered_df['Hum - %'] == hum_min]['Date & Time'].values[0]

    # Dew Point Trend Analysis
    dew_max = filtered_df['Dew Point - °C'].max()
    dew_min = filtered_df['Dew Point - °C'].min()
    dew_peaks = filtered_df[filtered_df['Dew Point - °C'] == dew_max]['Date & Time'].values[0]
    dew_drops = filtered_df[filtered_df['Dew Point - °C'] == dew_min]['Date & Time'].values[0]

    analysis_results = {
        'temp_max': temp_max, 'temp_peaks': temp_peaks,
        'temp_min': temp_min, 'temp_drops': temp_drops,
        'hum_max': hum_max, 'hum_peaks': hum_peaks,
        'hum_min': hum_min, 'hum_drops': hum_drops,
        'correlation_temp_humidity': correlation_temp_humidity,
        'dew_max': dew_max, 'dew_peaks': dew_peaks,
        'dew_min': dew_min, 'dew_drops': dew_drops
    }

    return plot_url, heatmap_url, analysis_results


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        start_date = request.form.get('start_date')
        end_date = request.form.get('end_date')
        plot_url, heatmap_url, analysis_results = process_data(start_date, end_date)
        if plot_url:
            return render_template('analysis.html', plot_url=plot_url, heatmap_url=heatmap_url, analysis_results=analysis_results)
        else:
            return render_template('index.html', error="No data available for the specified date range.")
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True,port=5670)
