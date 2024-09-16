import React, { useState, useEffect } from 'react';

const FarmingAdvice = ({ weather }) => {
    const [location, setLocation] = useState('');
    const [cropType, setCropType] = useState('');
    const [advice, setAdvice] = useState(null);

    useEffect(() => {
        console.log("Weather data received:", weather); 
    }, [weather]);

    const generateAdvice = () => {
        if (!weather || !weather.temperature || !weather.humidity || !weather.rainfall) {
            return 'Weather data is not available. Please check your input.';
        }

        const { temperature, humidity, rainfall } = weather;

        // Simple rule-based system
        if (cropType.toLowerCase() === 'wheat') {
            if (temperature >= 20 && temperature <= 30 && humidity >= 60 && humidity <= 80) {
                return `The conditions are ideal for planting ${cropType} in ${location}.`;
            } else {
                return `Conditions are not ideal for planting ${cropType} in ${location}. Consider alternative crops.`;
            }
        } else if (cropType.toLowerCase() === 'corn') {
            if (temperature >= 25 && rainfall >= 50) {
                return `The conditions are favorable for planting ${cropType} in ${location}.`;
            } else {
                return `Conditions are not optimal for planting ${cropType} in ${location}. Consider using irrigation or alternative crops.`;
            }
        } else if (cropType.toLowerCase() === 'rice') {
            if (temperature >= 20 && temperature <= 30 && humidity >= 70 && humidity <= 90 && rainfall > 150) {
                return `The conditions are ideal for planting ${cropType} in ${location}. Ensure proper water management.`;
            } else {
                return `Conditions are not ideal for planting ${cropType} in ${location}. Consider using irrigation and adjusting planting schedules.`;
            }
        }else if (cropType.toLowerCase() === 'maize' || cropType.toLowerCase() === 'corn') {
            if (temperature >= 18 && temperature <= 27 && humidity >= 50 && humidity <= 70 && rainfall >= 50 && rainfall <= 100) {
                return `The conditions are favorable for planting ${cropType} in ${location}. Ensure adequate soil drainage.`;
            } else {
                return `Consider delaying planting or using irrigation for ${cropType} in ${location}.`;
            }
        }else if (cropType.toLowerCase() === 'soybean') {
            if (temperature >= 20 && temperature <= 30 && humidity >= 60 && humidity <= 80 && rainfall >= 60 && rainfall <= 120) {
                return `Soybeans will thrive in these conditions in ${location}. Consider using organic fertilizers to boost growth.`;
            } else {
                return `Conditions might not be optimal for soybeans in ${location}. You may need to adjust planting practices.`;
            }
        }else if (cropType.toLowerCase() === 'potato') {
            if (temperature >= 15 && temperature <= 20 && humidity >= 80 && humidity <= 90 && rainfall >= 50 && rainfall <= 100) {
                return `Potatoes can be successfully grown in ${location} under these conditions. Ensure proper soil aeration.`;
            } else {
                return `Conditions are not ideal for growing potatoes in ${location}. Consider using mulch and proper watering techniques.`;
            }
        }else if (cropType.toLowerCase() === 'sugarcane') {
            if (temperature >= 21 && temperature <= 27 && humidity >= 60 && humidity <= 80 && rainfall >= 75 && rainfall <= 150) {
                return `Sugarcane will grow well in ${location} with these conditions. Focus on nutrient management and weed control.`;
            } else {
                return `Conditions are not perfect for sugarcane in ${location}. Adjust planting dates and consider additional fertilization.`;
            }
        }else if (cropType.toLowerCase() === 'tomato') {
            if (temperature >= 18 && temperature <= 25 && humidity >= 50 && humidity <= 70 && rainfall >= 40 && rainfall <= 100) {
                return `Tomatoes are likely to do well in ${location}. Ensure regular watering and support for vines.`;
            } else {
                return `The conditions might stress tomato plants in ${location}. Consider greenhouse cultivation or protective covers.`;
            }
        }else if (cropType.toLowerCase() === 'cotton') {
            if (temperature >= 25 && temperature <= 35 && humidity >= 40 && humidity <= 60 && rainfall >= 60 && rainfall <= 120) {
                return `Cotton will grow well under these conditions in ${location}. Focus on pest management and timely harvesting.`;
            } else {
                return `The conditions are challenging for cotton in ${location}. Consider pest control and irrigation adjustments.`;
            }
        }else if (cropType.toLowerCase() === 'peanut' || cropType.toLowerCase() === 'groundnut') {
            if (temperature >= 21 && temperature <= 30 && humidity >= 55 && humidity <= 70 && rainfall >= 50 && rainfall <= 100) {
                return `Peanuts will thrive in ${location} under these conditions. Ensure proper spacing and soil health management.`;
            } else {
                return `Conditions may not be optimal for peanuts in ${location}. Consider soil amendments and adjusted planting schedules.`;
            }
        }else if (cropType.toLowerCase() === 'barley') {
            if (temperature >= 15 && temperature <= 20 && humidity >= 65 && humidity <= 75 && rainfall >= 40 && rainfall <= 80) {
                return `Barley is well-suited to grow in ${location} under these conditions. Pay attention to soil pH and fertility.`;
            } else {
                return `Conditions might not be ideal for barley in ${location}. Adjust soil management practices accordingly.`;
            }
        }else if (cropType.toLowerCase() === 'lettuce') {
            if (temperature >= 15 && temperature <= 21 && humidity >= 60 && humidity <= 80 && rainfall >= 30 && rainfall <= 70) {
                return `Lettuce will grow well in ${location} under these conditions. Consider using shade nets to prevent bolting.`;
            } else {
                return `Conditions may not be perfect for lettuce in ${location}. Consider controlled environments or adjusted planting schedules.`;
            }
        }
        
        else {
            return `We currently don't have advice for planting ${cropType}. Please consult an agricultural expert.`;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const generatedAdvice = generateAdvice();
        setAdvice({ recommendation: generatedAdvice });
    };

    return (
        <div className="farming-advice">
            <h2>Get Personalized Farming Advice</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter your location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter crop type"
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                />
                <button type="submit">Get Advice</button>
            </form>
            {advice && <div>{advice.recommendation}</div>}
        </div>
    );
};

export default FarmingAdvice;
