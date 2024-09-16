import React from 'react';

const CO2Heatmap = () => {
    return (
        <div className="co2-heatmap-page">
            <h2>CO2 Emission Heatmap</h2>
            <img 
                src="/Screenshot 2024-08-26 at 8.38.12 AM.png" 
                alt="CO2 Emission Heatmap" 
                className="co2-heatmap-image" 
                style={{ width: '100%', height: 'auto' }} // Adjust the width and height as needed
            />
        </div>
    );
};

export default CO2Heatmap;
