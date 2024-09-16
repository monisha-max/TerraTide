from flask import Flask, render_template, request
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import numpy as np

app = Flask(__name__)

# Preprocess the dataset
df_combined = pd.read_csv('/Users/monishakollipara/Desktop/heatindicesprediction/combined_data.csv')  # Replace with your dataset path
df_combined.replace('--', np.nan, inplace=True)
df_combined = df_combined.apply(pd.to_numeric, errors='coerce')
df_combined.fillna(0, inplace=True)

# Define features and target
features = ['Temp - °C', 'Hum - %', 'Avg Wind Speed - km/h', 'Solar Rad - W/m^2', 'Dew Point - °C']
target = 'Heat Index - °C'

X = df_combined[features]
y = df_combined[target]

# Standardize the features
preprocessor = StandardScaler()
X_transformed = preprocessor.fit_transform(X)

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X_transformed, y, test_size=0.2, random_state=42)

# Train the Random Forest Regressor model
rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# Function to predict heat index
def predict_heat_index(temp, hum, wind_speed, solar_rad, dew_point):
    # Prepare the input features as a DataFrame
    input_features = pd.DataFrame([[temp, hum, wind_speed, solar_rad, dew_point]], columns=features)
    
    # Standardize the input features using the same preprocessor
    input_features_transformed = preprocessor.transform(input_features)
    
    # Make a prediction
    prediction = rf_model.predict(input_features_transformed)
    
    return prediction[0]

# Define the main route to render the form
@app.route('/', methods=['GET', 'POST'])
def index():
    prediction = None
    if request.method == 'POST':
        # Get user input from the form
        temp = float(request.form['temp'])
        hum = float(request.form['hum'])
        wind_speed = float(request.form['wind_speed'])
        solar_rad = float(request.form['solar_rad'])
        dew_point = float(request.form['dew_point'])
        
        # Make a prediction using the input values
        prediction = predict_heat_index(temp, hum, wind_speed, solar_rad, dew_point)
    
    return render_template('index.html', prediction=prediction)

if __name__ == '__main__':
    app.run(debug=True,port=8081)
