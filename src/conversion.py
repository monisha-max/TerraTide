import pandas as pd
import json

# Load the CSV file
file_path = 'Crop_recommendation.csv'
crop_data = pd.read_csv(file_path)

# Select only the relevant columns for your React application
crop_data = crop_data[['temperature', 'humidity', 'rainfall', 'label']]

# Convert the DataFrame to a list of dictionaries (JSON format)
crop_data_json = crop_data.to_dict(orient='records')

# Save the JSON data to a file
json_file_path = 'Crop_recommendation.json'
with open(json_file_path, 'w') as json_file:
    json.dump(crop_data_json, json_file, indent=4)

json_file_path
