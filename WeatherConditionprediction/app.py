from flask import Flask, render_template, request
import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder
import xgboost as xgb

app = Flask(__name__)

# Pre-trained XGBoost model
xgb_model = xgb.XGBClassifier(n_estimators=100, random_state=42)

# Load or define your dataset here for preprocessing
# Assuming df is your dataset and already defined
features = [
    'temperature_celsius', 'humidity', 'wind_mph', 'pressure_mb',
    'precip_mm', 'uv_index'
]

# Assuming df is your dataset
df = pd.read_csv('/Users/monishakollipara/Desktop/WeatherConditionprediction/GlobalWeatherRepository.csv')  # Uncomment this line if you are loading the dataset from a CSV file

X = df[features]
y = df['condition_text']

# Fill missing values with mean
X = X.fillna(X.mean())

# Standardize the features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

xgb_model.fit(X_scaled, y_encoded)

# Home route
@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        input_features = {
            'temperature_celsius': float(request.form['temperature_celsius']),
            'humidity': float(request.form['humidity']),
            'wind_mph': float(request.form['wind_mph']),
            'pressure_mb': float(request.form['pressure_mb']),
            'precip_mm': float(request.form['precip_mm']),
            'uv_index': float(request.form['uv_index']),
        }
        
        predicted_condition = predict_condition_index(input_features)
        return render_template('index.html', prediction=predicted_condition)
    
    return render_template('index.html')

def predict_condition_index(input_features):
    # Prepare the input features as a DataFrame
    input_df = pd.DataFrame([input_features], columns=features)
    
    # Fill missing values with mean (if any)
    input_df = input_df.fillna(X.mean())
    
    # Standardize the input features using the same scaler
    input_scaled = scaler.transform(input_df)
    
    prediction_encoded = xgb_model.predict(input_scaled)
    
    prediction_label = label_encoder.inverse_transform(prediction_encoded)
    
    return prediction_label[0]

if __name__ == '__main__':
    app.run(debug=True,port=4880)
