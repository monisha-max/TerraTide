// import React, { useState, useEffect } from 'react';
// import FarmingAdvice from './components/FarmingAdvice';
// import EducationalContent from './components/EducationalContent';
// import Forum from './components/Forum';
// import './styles.css';

// const App = () => {
//     const [userType, setUserType] = useState('farmer'); // Default user type
//     const [city, setCity] = useState('');
//     const [temperature, setTemperature] = useState('');
//     const [humidity, setHumidity] = useState('');
//     const [rainfall, setRainfall] = useState('');
//     const [useLocation, setUseLocation] = useState(true);
//     const [weather, setWeather] = useState(null);
//     const [recommendation, setRecommendation] = useState('');
//     const [alert, setAlert] = useState('');
//     const [error, setError] = useState('');
//     const [cropData, setCropData] = useState([]);
//     const [dataLoaded, setDataLoaded] = useState(false);
//     const [recommendationFetched, setRecommendationFetched] = useState(false); // New state variable

//     useEffect(() => {
//         fetch('/Crop_recommendation.json')
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Failed to load crop data.');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 setCropData(data);
//                 setDataLoaded(true);
//             })
//             .catch(error => setError(error.message));
//     }, []);

//     const fetchWeatherData = async () => {
//         if (!dataLoaded) {
//             setError('Crop data is not loaded yet.');
//             return;
//         }

//         try {
//             let weatherData;
//             if (useLocation) {
//                 const API_KEY = 'bf1a8422d92b4eedb2d143836242408';
//                 const response = await fetch(
//                     `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`
//                 );
//                 if (!response.ok) {
//                     throw new Error('City not found');
//                 }
//                 const data = await response.json();
//                 weatherData = {
//                     temperature: data.current.temp_c,
//                     humidity: data.current.humidity,
//                     rainfall: data.current.precip_mm,
//                 };
//             } else {
//                 weatherData = {
//                     temperature: parseFloat(temperature),
//                     humidity: parseFloat(humidity),
//                     rainfall: parseFloat(rainfall),
//                 };
//             }

//             setWeather(weatherData);

//             const closestMatch = cropData.reduce((prev, curr) => {
//                 const prevDiff = Math.abs(prev.temperature - weatherData.temperature) +
//                                  Math.abs(prev.humidity - weatherData.humidity) +
//                                  Math.abs(prev.rainfall - weatherData.rainfall);
//                 const currDiff = Math.abs(curr.temperature - weatherData.temperature) +
//                                  Math.abs(curr.humidity - weatherData.humidity) +
//                                  Math.abs(curr.rainfall - weatherData.rainfall);
//                 return currDiff < prevDiff ? curr : prev;
//             }, cropData[0]);

//             setRecommendation(closestMatch ? closestMatch.label : 'No suitable crops found');

//             if (weatherData.temperature > 35) {
//                 setAlert('Heatwave alert! Take precautions.');
//             } else if (weatherData.rainfall > 10) {
//                 setAlert('Heavy rainfall expected. Protect your crops.');
//             } else {
//                 setAlert('No extreme weather conditions expected.');
//             }

//             setError('');
//             setRecommendationFetched(true); // Set the recommendation as fetched
//         } catch (error) {
//             setError(error.message);
//             setWeather(null);
//             setRecommendation('');
//             setAlert('');
//         }
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         fetchWeatherData();
//     };

//     const renderDashboardContent = () => {
//         switch (userType) {
//             case 'farmer':
//                 return (
//                     <div className="box crop-recommendations">
//                         <h2>Crop Recommendations</h2>
//                         <p>{recommendation}</p>
//                     </div>
//                 );
//             case 'city_planner':
//                 return (
//                     <div className="box">
//                         <h2>City Planning Insights</h2>
//                         <p>Use the data to optimize resource allocation and urban planning.</p>
//                     </div>
//                 );
//             case 'environmentalist':
//                 return (
//                     <div className="box">
//                         <h2>Environmental Impact</h2>
//                         <p>Analyze the impact of weather and climate conditions on local ecosystems.</p>
//                     </div>
//                 );
//             default:
//                 return null;
//         }
//     };

//     return (
//         <div className="App">
//             <h1>Smart Crop Advisor</h1>

//             {/* Chatbot Buttons */}
//             <div className="bot-buttons">
//                 <a href="http://127.0.0.1:7860/" target="_blank" rel="noopener noreferrer">
//                     <img src="/Screenshot 2024-08-24 at 11.36.52 PM.png" alt="Chatbot" className="bot-image" />
//                 </a>
//                 <a href="http://localhost:8501/" target="_blank" rel="noopener noreferrer">
//                     <img src="/Screenshot 2024-08-25 at 11.50.44 AM.png" alt="ResearchBot" className="bot-image" />
//                 </a>
//             </div>

//             <div className="user-type-selection">
//                 <label>
//                     <input
//                         type="radio"
//                         value="farmer"
//                         checked={userType === 'farmer'}
//                         onChange={() => setUserType('farmer')}
//                     />
//                     Farmer
//                 </label>
//                 <label>
//                     <input
//                         type="radio"
//                         value="city_planner"
//                         checked={userType === 'city_planner'}
//                         onChange={() => setUserType('city_planner')}
//                     />
//                     City Planner
//                 </label>
//                 <label>
//                     <input
//                         type="radio"
//                         value="environmentalist"
//                         checked={userType === 'environmentalist'}
//                         onChange={() => setUserType('environmentalist')}
//                     />
//                     Environmental Enthusiast
//                 </label>
//             </div>

//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label>
//                         <input
//                             type="radio"
//                             value="location"
//                             checked={useLocation}
//                             onChange={() => setUseLocation(true)}
//                         />
//                         Use Location-Based Data
//                     </label>
//                     <label>
//                         <input
//                             type="radio"
//                             value="manual"
//                             checked={!useLocation}
//                             onChange={() => setUseLocation(false)}
//                         />
//                         Enter Data Manually
//                     </label>
//                 </div>

//                 {useLocation ? (
//                     <div>
//                         <input
//                             type="text"
//                             placeholder="Enter city name"
//                             value={city}
//                             onChange={(e) => setCity(e.target.value)}
//                             disabled={!dataLoaded}
//                         />
//                     </div>
//                 ) : (
//                     <div>
//                         <input
//                             type="number"
//                             placeholder="Enter temperature (°C)"
//                             value={temperature}
//                             onChange={(e) => setTemperature(e.target.value)}
//                             disabled={!dataLoaded}
//                         />
//                         <input
//                             type="number"
//                             placeholder="Enter humidity (%)"
//                             value={humidity}
//                             onChange={(e) => setHumidity(e.target.value)}
//                             disabled={!dataLoaded}
//                         />
//                         <input
//                             type="number"
//                             placeholder="Enter rainfall (mm)"
//                             value={rainfall}
//                             onChange={(e) => setRainfall(e.target.value)}
//                             disabled={!dataLoaded}
//                         />
//                     </div>
//                 )}

//                 <button type="submit" disabled={!dataLoaded}>Get Recommendation</button>
//             </form>
            
//             {!recommendationFetched && (
//                 <>
//                     {/* Quotes Section */}
//                     <div className="quotes-container">
//                         <div className="quotes-wrapper">
//                             <div className="quote">"The farmer is the only man in our economy who buys everything at retail, sells everything at wholesale, and pays the freight both ways." — John F. Kennedy</div>
//                             <div className="quote">"To forget how to dig the earth and to tend the soil is to forget ourselves." — Mahatma Gandhi</div>
//                             <div className="quote">"Farming is a profession of hope." — Brian Brett</div>
//                             <div className="quote">"The land is the real teacher. All we need as students is mindfulness." — Robin Wall Kimmerer</div>
//                             <div className="quote">"The ultimate goal of farming is not the growing of crops, but the cultivation and perfection of human beings." — Masanobu Fukuoka</div>
//                             <div className="quote">"Farming is not just a job, it's a way of life." — Unknown</div>
//                             <div className="quote">"The farmer has to be an optimist or he wouldn't still be a farmer." — Will Rogers</div>
//                             <div className="quote">"Agriculture is the most healthful, most useful, and most noble employment of man." — George Washington</div>
//                             <div className="quote">"To forget how to dig the earth and to tend the soil is to forget ourselves." — Mahatma Gandhi</div>
//                             <div className="quote">"There are no miracles in agricultural production." — Norman Borlaug</div>
//                             <div className="quote">"A good farmer is nothing more nor less than a handy man with a sense of humus." — E.B. White</div>
//                             <div className="quote">"Farming looks mighty easy when your plow is a pencil, and you're a thousand miles from the cornfield." — Dwight D. Eisenhower</div>
//                             <div className="quote">"The land that you see is not just soil, it’s a canvas on which generations paint their legacy." — Unknown</div>
//                             <div className="quote">"He who plants a tree plants a hope." — Lucy Larcom</div>
//                             <div className="quote">"It is only the farmer who faithfully plants seeds in the Spring, who reaps a harvest in the Autumn." — B.C. Forbes</div>
//                             <div className="quote">"Farmers are the backbone of our society, feeding the world one harvest at a time." — Unknown</div>
//                             <div className="quote">"The soil is the great connector of our lives, the source and destination of all." — Wendell Berry</div>
//                             <div className="quote">"Sowing seeds into the soil is sowing hope into the future." — Unknown</div>
//                             <div className="quote">"Farming isn't a business; it's a way of life." — Unknown</div>
//                         </div>
//                     </div>

//                     {/* Images Section */}
//                     <div className="images-container">
//                         <div className="images-wrapper">
//                             <div className="image-item">
//                                 <img src="/Screenshot 2024-08-25 at 2.38.10 PM.png" alt="Farming Image 1" />
//                             </div>
//                             <div className="image-item">
//                                 <img src="/Screenshot 2024-08-25 at 2.40.21 PM.png" alt="Farming Image 2" />
//                             </div>
//                             <div className="image-item">
//                                 <img src="/Screenshot 2024-08-25 at 2.41.00 PM.png" alt="Farming Image 3" />
//                             </div>
//                             <div className="image-item">
//                                 <img src="/Screenshot 2024-08-25 at 2.41.39 PM.png" alt="Farming Image 4" />
//                             </div>
//                             <div className="image-item">
//                                 <img src="/Screenshot 2024-08-25 at 2.42.37 PM.png" alt="Farming Image 5" />
//                             </div>
//                             <div className="image-item">
//                                 <img src="/Screenshot 2024-08-25 at 2.43.38 PM.png" alt="Farming Image 6" />
//                             </div>
//                             <div className="image-item">
//                                 <img src="/Screenshot 2024-08-25 at 2.44.05 PM.png" alt="Farming Image 7" />
//                             </div>
//                             <div className="image-item">
//                                 <img src="/Screenshot 2024-08-25 at 2.58.50 PM.png" alt="Farming Image 8" />
//                             </div>
//                         </div>
//                     </div>
//                 </>
//             )}

//             {error && <p className="error">{error}</p>}

//             {weather && (
//                 <div className="container">
//                     <div className="row">
//                         <div className="box dashboard">
//                             <h2>Weather Dashboard</h2>
//                             <p>Temperature: {weather.temperature}°C</p>
//                             <p>Humidity: {weather.humidity}%</p>
//                             <p>Rainfall: {weather.rainfall}mm</p>
//                         </div>
//                         {renderDashboardContent()}
//                     </div>

//                     <div className="row">
//                         <div className={`box alerts ${alert.includes('Heatwave') ? 'blinking-alert-box' : ''}`}>
//                             <h2>Weather Alerts</h2>
//                             <p>{alert}</p>
//                         </div>

//                         <div className="box">
//                             <h2>Additional Information</h2>
//                             <p>Any additional content can go here.</p>
//                         </div>
//                     </div>

//                     <div className="row">
//                         <div className="box full-width-box knowledge-base">
//                             <FarmingAdvice weather={weather} />
//                         </div>
//                     </div>

//                     <div className="row">
//                         <Forum />
//                     </div>

//                     <div className="row">
//                         <div className="box full-width-box">
//                             <h2>Farming Tips & Best Practices</h2>
//                             <ul>
//                                 <div className="row farming-tips">
//                                     <div className="farming-item">
//                                         <img src="/Screenshot 2024-08-24 at 11.14.03 PM.png" alt="Weather forecast farming" className="farming-image" />
//                                         <p>Plant crops according to the weather forecast.</p>
//                                     </div>
//                                     <div className="farming-item">
//                                         <img src="/Screenshot 2024-08-24 at 11.22.48 PM.png" alt="Organic fertilizers" className="farming-image" />
//                                         <p>Use organic fertilizers to enrich soil health.</p>
//                                     </div>
//                                     <div className="farming-item">
//                                         <img src="/Screenshot 2024-08-24 at 11.24.11 PM.png" alt="Soil moisture monitoring" className="farming-image" />
//                                         <p>Monitor soil moisture regularly to optimize irrigation.</p>
//                                     </div>
//                                     <div className="farming-item">
//                                         <img src="/Screenshot 2024-08-24 at 11.24.51 PM.png" alt="Crop rotation" className="farming-image" />
//                                         <p>Rotate crops to maintain soil fertility.</p>
//                                     </div>
//                                 </div>
//                             </ul>
//                         </div>
//                     </div>

//                     <div className="row">
//                         <EducationalContent userType={userType} />
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default App;


import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FarmingAdvice from './components/FarmingAdvice';
import EducationalContent from './components/EducationalContent';
import Forum from './components/Forum';
import CO2Heatmap from './components/CO2Heatmap';
import './styles.css';
//export NODE_OPTIONS=--openssl-legacy-provider


const App = () => {
    const [userType, setUserType] = useState('farmer'); // Default user type
    const [city, setCity] = useState('');
    const [temperature, setTemperature] = useState('');
    const [humidity, setHumidity] = useState('');
    const [rainfall, setRainfall] = useState('');
    const [useLocation, setUseLocation] = useState(true);
    const [weather, setWeather] = useState(null);
    const [recommendation, setRecommendation] = useState('');
    const [alert, setAlert] = useState('');
    const [error, setError] = useState('');
    const [cropData, setCropData] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [recommendationFetched, setRecommendationFetched] = useState(false); // New state variable
    const [showPrecautions, setShowPrecautions] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [heatmapUrl, setHeatmapUrl] = useState('');

    const handleHeatmapSubmit = () => {
        const url = `http://127.0.0.1:5000/generate-heatmap?start_date=${startDate}&end_date=${endDate}`;
        window.location.href = url;
    };
    const handleHeatIndexPrediction = () => {
        window.location.href = 'http://127.0.0.1:8081/';
    };
    const WeatherConditionPrediction = () => {
        window.location.href = 'http://127.0.0.1:4880/';
    };
    const handleDewPointPrediction = () => {
        window.location.href = 'http://127.0.0.1:5670/';
    };
    

    useEffect(() => {
        fetch('/Crop_recommendation.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load crop data.');
                }
                return response.json();
            })
            .then(data => {
                setCropData(data);
                setDataLoaded(true);
            })
            .catch(error => setError(error.message));
    }, []);

    const fetchWeatherData = async () => {
        if (!dataLoaded) {
            setError('Crop data is not loaded yet.');
            return;
        }

        try {
            let weatherData;
            if (useLocation) {
                const API_KEY = 'bf1a8422d92b4eedb2d143836242408';
                const response = await fetch(
                    `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`
                );
                if (!response.ok) {
                    throw new Error('City not found');
                }
                const data = await response.json();
                weatherData = {
                    temperature: data.current.temp_c,
                    humidity: data.current.humidity,
                    rainfall: data.current.precip_mm,
                };
            } else {
                weatherData = {
                    temperature: parseFloat(temperature),
                    humidity: parseFloat(humidity),
                    rainfall: parseFloat(rainfall),
                };
            }

            setWeather(weatherData);

            const closestMatch = cropData.reduce((prev, curr) => {
                const prevDiff = Math.abs(prev.temperature - weatherData.temperature) +
                                 Math.abs(prev.humidity - weatherData.humidity) +
                                 Math.abs(prev.rainfall - weatherData.rainfall);
                const currDiff = Math.abs(curr.temperature - weatherData.temperature) +
                                 Math.abs(curr.humidity - weatherData.humidity) +
                                 Math.abs(curr.rainfall - weatherData.rainfall);
                return currDiff < prevDiff ? curr : prev;
            }, cropData[0]);

            setRecommendation(closestMatch ? closestMatch.label : 'No suitable crops found');

            if (weatherData.temperature > 35) {
                setAlert('Heatwave alert! Take precautions.');
            } else if (weatherData.rainfall > 10) {
                setAlert('Heavy rainfall expected. Protect your crops.');
            } else {
                setAlert('No extreme weather conditions expected.');
            }

            setError('');
            setRecommendationFetched(true); // Set the recommendation as fetched
        } catch (error) {
            setError(error.message);
            setWeather(null);
            setRecommendation('');
            setAlert('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchWeatherData();
    };

    const handleShowPrecautions = () => {
        setShowPrecautions(!showPrecautions);
    };

    const renderDashboardContent = () => {
        switch (userType) {
            case 'farmer':
                return (
                    <div className="box crop-recommendations">
                        <h2>Crop Recommendations</h2>
                        <p>{recommendation}</p>
                    </div>
                );
            case 'city_planner':
                return (
                    <div className="box">
                        <h2>City Planning Insights</h2>
                        <p>Use the data to optimize resource allocation and urban planning.</p>
                    </div>
                );
            case 'environmentalist':
                return (
                    <div className="box">
                        <h2>Environmental Impact</h2>
                        <p>Analyze the impact of weather and climate conditions on local ecosystems.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Router>
        <div className="App">
        <h1>
    <span style={{ fontSize: '48px', fontWeight: 'bold' }}>TerraTide</span>
    <br />
    <span style={{ fontSize: '24px', fontStyle: 'italic' }}>Harness the Earth's Rhythms for Smarter Farming</span>
</h1>




            {/* Chatbot Buttons */}
            <div className="bot-buttons">
                <a href="http://127.0.0.1:7860/" target="_blank" rel="noopener noreferrer">
                    <img src="/Screenshot 2024-08-24 at 11.36.52 PM.png" alt="Chatbot" className="bot-image" />
                </a>
                <a href="http://localhost:8501/" target="_blank" rel="noopener noreferrer">
                    <img src="/Screenshot 2024-08-25 at 11.50.44 AM.png" alt="ResearchBot" className="bot-image" />
                </a>
            </div>

            <div className="user-type-selection">
                <label>
                    <input
                        type="radio"
                        value="farmer"
                        checked={userType === 'farmer'}
                        onChange={() => setUserType('farmer')}
                    />
                    Farmer
                </label>
                <label>
                    <input
                        type="radio"
                        value="city_planner"
                        checked={userType === 'city_planner'}
                        onChange={() => setUserType('city_planner')}
                    />
                    City Planner
                </label>
                <label>
                    <input
                        type="radio"
                        value="environmentalist"
                        checked={userType === 'environmentalist'}
                        onChange={() => setUserType('environmentalist')}
                    />
                    Environmental Enthusiast
                </label>
            </div>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        <input
                            type="radio"
                            value="location"
                            checked={useLocation}
                            onChange={() => setUseLocation(true)}
                        />
                        Use Location-Based Data
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="manual"
                            checked={!useLocation}
                            onChange={() => setUseLocation(false)}
                        />
                        Enter Data Manually
                    </label>
                </div>

                {useLocation ? (
                    <div>
                        <input
                            type="text"
                            placeholder="Enter city name"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            disabled={!dataLoaded}
                        />
                    </div>
                ) : (
                    <div>
                        <input
                            type="number"
                            placeholder="Enter temperature (°C)"
                            value={temperature}
                            onChange={(e) => setTemperature(e.target.value)}
                            disabled={!dataLoaded}
                        />
                        <input
                            type="number"
                            placeholder="Enter humidity (%)"
                            value={humidity}
                            onChange={(e) => setHumidity(e.target.value)}
                            disabled={!dataLoaded}
                        />
                        <input
                            type="number"
                            placeholder="Enter rainfall (mm)"
                            value={rainfall}
                            onChange={(e) => setRainfall(e.target.value)}
                            disabled={!dataLoaded}
                        />
                    </div>
                )}

                <button type="submit" disabled={!dataLoaded}>Get Recommendation</button>
            </form>
            <div className="main-container">
    {/* Generate Heat Map Section */}
    <div className="heatmap-section">
        <h2>GENERATE HEAT MAP</h2>
        <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
            className="date-input"
        />
        <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
            className="date-input"
        />
        <button onClick={handleHeatmapSubmit} className="generate-btn">
            Generate Heatmap
        </button>
    </div>

    {/* Heat Index Prediction Section */}
    <div className="prediction-section">
        <div className="prediction-container">
            <h2>HEAT INDEX PREDICTION</h2>
            <button onClick={handleHeatIndexPrediction} className="prediction-btn">
                Heat Index Prediction
            </button>
        </div>
    </div>

    {/* Weather Condition Prediction Section */}
    <div className="prediction-section">
        <div className="prediction-container">
            <h2>WEATHER CONDITION PREDICTION</h2>
            <button onClick={WeatherConditionPrediction} className="prediction-btn">
                Weather Condition Prediction
            </button>
        </div>
    </div>
    {/* Dew Points Section */}
    <div className="prediction-section">
        <div className="prediction-container">
            <h2>DEW POINT,TEMPERATURE AND HUMIDITY ANALYSIS</h2>
            <button onClick={handleDewPointPrediction} className="prediction-btn">
                Dew Point Prediction
            </button>
        </div>
    </div>

    {/* CO2 Heatmap Section */}
    <div className="co2-heatmap-section">
        <h2>HEAT MAP OF CO2 EMISSIONS</h2>
        <Link to="/co2-heatmap" className="co2-heatmap-button">
            View CO2 Emission Heatmap
        </Link>
    </div>
</div>

            

            <Routes>
                    {/* Other routes */}
                    <Route path="/co2-heatmap" element={<CO2Heatmap />} />
            </Routes>
            
            
            {!recommendationFetched && (
                <>
                    {/* Quotes Section */}
                    <div className="quotes-container">
                        <div className="quotes-wrapper">
                            <div className="quote">"The farmer is the only man in our economy who buys everything at retail, sells everything at wholesale, and pays the freight both ways." — John F. Kennedy</div>
                            <div className="quote">"To forget how to dig the earth and to tend the soil is to forget ourselves." — Mahatma Gandhi</div>
                            <div className="quote">"Farming is a profession of hope." — Brian Brett</div>
                            <div className="quote">"The land is the real teacher. All we need as students is mindfulness." — Robin Wall Kimmerer</div>
                            <div className="quote">"The ultimate goal of farming is not the growing of crops, but the cultivation and perfection of human beings." — Masanobu Fukuoka</div>
                            <div className="quote">"Farming is not just a job, it's a way of life." — Unknown</div>
                            <div className="quote">"The farmer has to be an optimist or he wouldn't still be a farmer." — Will Rogers</div>
                            <div className="quote">"Agriculture is the most healthful, most useful, and most noble employment of man." — George Washington</div>
                            <div className="quote">"To forget how to dig the earth and to tend the soil is to forget ourselves." — Mahatma Gandhi</div>
                            <div className="quote">"There are no miracles in agricultural production." — Norman Borlaug</div>
                            <div className="quote">"A good farmer is nothing more nor less than a handy man with a sense of humus." — E.B. White</div>
                            <div className="quote">"Farming looks mighty easy when your plow is a pencil, and you're a thousand miles from the cornfield." — Dwight D. Eisenhower</div>
                            <div className="quote">"The land that you see is not just soil, it’s a canvas on which generations paint their legacy." — Unknown</div>
                            <div className="quote">"He who plants a tree plants a hope." — Lucy Larcom</div>
                            <div className="quote">"It is only the farmer who faithfully plants seeds in the Spring, who reaps a harvest in the Autumn." — B.C. Forbes</div>
                            <div className="quote">"Farmers are the backbone of our society, feeding the world one harvest at a time." — Unknown</div>
                            <div className="quote">"The soil is the great connector of our lives, the source and destination of all." — Wendell Berry</div>
                            <div className="quote">"Sowing seeds into the soil is sowing hope into the future." — Unknown</div>
                            <div className="quote">"Farming isn't a business; it's a way of life." — Unknown</div>
                        </div>
                    </div>

                    {/* Images Section */}
                    <div className="images-container">
                        <div className="images-wrapper">
                            <div className="image-item">
                                <img src="/Screenshot 2024-08-25 at 2.38.10 PM.png" alt="Farming Image 1" />
                            </div>
                            <div className="image-item">
                                <img src="/Screenshot 2024-08-25 at 2.40.21 PM.png" alt="Farming Image 2" />
                            </div>
                            <div className="image-item">
                                <img src="/Screenshot 2024-08-25 at 2.41.00 PM.png" alt="Farming Image 3" />
                            </div>
                            <div className="image-item">
                                <img src="/Screenshot 2024-08-25 at 2.41.39 PM.png" alt="Farming Image 4" />
                            </div>
                            <div className="image-item">
                                <img src="/Screenshot 2024-08-25 at 2.42.37 PM.png" alt="Farming Image 5" />
                            </div>
                            <div className="image-item">
                                <img src="/Screenshot 2024-08-25 at 2.43.38 PM.png" alt="Farming Image 6" />
                            </div>
                            <div className="image-item">
                                <img src="/Screenshot 2024-08-25 at 2.44.05 PM.png" alt="Farming Image 7" />
                            </div>
                            <div className="image-item">
                                <img src="/Screenshot 2024-08-25 at 2.58.50 PM.png" alt="Farming Image 8" />
                            </div>
                        </div>
                    </div>
                </>
            )}

            {error && <p className="error">{error}</p>}


            {weather && (
                <div className="container">
                    <div className="row">
                        <div className="box dashboard">
                            <h2>Weather Dashboard</h2>
                            <p>Temperature: {weather.temperature}°C</p>
                            <p>Humidity: {weather.humidity}%</p>
                            <p>Rainfall: {weather.rainfall}mm</p>
                        </div>
                        {renderDashboardContent()}
                    </div>

                    <div className="row">
                        <div className={`box alerts ${alert.includes('Heatwave') ? 'blinking-alert-box' : ''}`}>
                            <h2>Weather Alerts</h2>
                            <p>{alert}</p>
                            {alert.includes('Heatwave') && (
                                <button onClick={handleShowPrecautions} className="precautions-button">
                                    What Precautions?
                                </button>
                            )}
                        </div>

                        {/* Show precautions when button is clicked */}
                        {showPrecautions && (
                            <div className="precautions">
                                <h2>Heatwave Precautions</h2>
                                <ul>
                                    <li>Drink sufficient water and as often as possible, even if not thirsty.</li>
                                    <li>Wear lightweight, light-colored, loose, and porous cotton clothes. Use protective goggles, umbrella/hat, shoes or chappals while going out in sun.</li>
                                    <li>Avoid strenuous activities when the outside temperature is high. Avoid working outside between 12 noon and 3 p.m.</li>
                                    <li>While traveling, carry water with you.</li>
                                    <li>Avoid alcohol, tea, coffee, and carbonated soft drinks, which dehydrate the body.</li>
                                    <li>Avoid high-protein food and do not eat stale food.</li>
                                    <li>If you work outside, use a hat or an umbrella and also use a damp cloth on your head, neck, face, and limbs.</li>
                                    <li>Do not leave children or pets in parked vehicles.</li>
                                    <li>If you feel faint or ill, see a doctor immediately.</li>
                                    <li>Use ORS, homemade drinks like lassi, torani (rice water), lemon water, buttermilk, etc., which helps to rehydrate the body.</li>
                                    <li>Keep animals in shade and give them plenty of water to drink.</li>
                                    <li>Keep your home cool; use curtains, shutters, or sunshade, and open windows at night.</li>
                                    <li>Use fans, damp clothing, and take a bath in cold water frequently.</li>
                                </ul>
                            </div>
                        )}

                        <div className="box">
                            <h2>Additional Information</h2>
                            <p>Any additional content can go here.</p>
                        </div>
                    </div>

                    <div className="row">
                        <div className="box full-width-box knowledge-base">
                            <FarmingAdvice weather={weather} />
                        </div>
                    </div>

                    <div className="row">
                        <Forum />
                    </div>

                    <div className="row">
                        <div className="box full-width-box">
                            <h2>Farming Tips & Best Practices</h2>
                            <ul>
                                <div className="row farming-tips">
                                    <div className="farming-item">
                                        <img src="/Screenshot 2024-08-24 at 11.14.03 PM.png" alt="Weather forecast farming" className="farming-image" />
                                        <p>Plant crops according to the weather forecast.</p>
                                    </div>
                                    <div className="farming-item">
                                        <img src="/Screenshot 2024-08-24 at 11.22.48 PM.png" alt="Organic fertilizers" className="farming-image" />
                                        <p>Use organic fertilizers to enrich soil health.</p>
                                    </div>
                                    <div className="farming-item">
                                        <img src="/Screenshot 2024-08-24 at 11.24.11 PM.png" alt="Soil moisture monitoring" className="farming-image" />
                                        <p>Monitor soil moisture regularly to optimize irrigation.</p>
                                    </div>
                                    <div className="farming-item">
                                        <img src="/Screenshot 2024-08-24 at 11.24.51 PM.png" alt="Crop rotation" className="farming-image" />
                                        <p>Rotate crops to maintain soil fertility.</p>
                                    </div>
                                </div>
                            </ul>
                        </div>
                    </div>

                    <div className="row">
                        <EducationalContent userType={userType} />
                    </div>
                </div>
            )}
        </div>
        </Router>
    );
};

export default App;
