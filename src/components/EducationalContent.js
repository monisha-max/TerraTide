import React from 'react';
import { FaLeaf, FaGlobe, FaWater } from 'react-icons/fa';

const EducationalContent = ({ userType }) => {
    const getContent = () => {
        switch (userType) {
            case 'farmer':
                return (
                    <>
                        <h3><FaLeaf style={{ color: '#4CAF50' }} /> Importance of Precision Farming</h3>
                        <p>Precision farming allows farmers to optimize crop yields and reduce waste by utilizing data-driven techniques. Explore the following resources to learn more:</p>
                        <ul>
                            <li>
                                <a href="https://www.fao.org/climate-change/resources/en/" target="_blank" rel="noopener noreferrer">
                                    FAO Climate Change Resources
                                </a>
                            </li>
                            <li>
                                <a href="https://ocw.mit.edu/index.htm" target="_blank" rel="noopener noreferrer">
                                    MIT OpenCourseWare: Environmental Earth Science
                                </a>
                            </li>
                            <li>
                                <a href="https://www.noaa.gov/education" target="_blank" rel="noopener noreferrer">
                                    NOAA Educational Resources
                                </a>
                            </li>
                            <li>
                                <a href="https://www.youtube.com/user/crashcourse" target="_blank" rel="noopener noreferrer">
                                    CrashCourse: Agricultural Science Playlist
                                </a>
                            </li>
                        </ul>
                        <h3>Watch this video:</h3>
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/4-MVZ-dm3Es" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    </>
                );
            case 'city_planner':
                return (
                    <>
                        <h3><FaGlobe style={{ color: '#3F51B5' }} /> Urban Planning and Climate Impact</h3>
                        <p>Understand how climate change and weather patterns affect urban planning and infrastructure. Check out these resources:</p>
                        <ul>
                            <li>
                                <a href="https://www.epa.gov/students" target="_blank" rel="noopener noreferrer">
                                    EPA Educational Resources
                                </a>
                            </li>
                            <li>
                                <a href="https://ocw.mit.edu/index.htm" target="_blank" rel="noopener noreferrer">
                                    MIT OpenCourseWare: Urban Planning
                                </a>
                            </li>
                            <li>
                                <a href="https://www.jstor.org/" target="_blank" rel="noopener noreferrer">
                                    JSTOR: Climate Impact on Urban Areas
                                </a>
                            </li>
                            <li>
                                <a href="https://www.youtube.com/user/TEDEducation" target="_blank" rel="noopener noreferrer">
                                    TED-Ed: Climate Change and Cities
                                </a>
                            </li>
                        </ul>
                        <h3>Watch this video:</h3>
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/yM8mU-6W9Tg" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    </>
                );
            case 'environmentalist':
                return (
                    <>
                        <h3 style={{ display: 'flex', alignItems: 'center', color: '#3F51B5' }}>
                            <FaWater style={{ marginRight: '8px' }} />
                            Environmental Impact
                        </h3>
                        <p>Analyze the impact of weather and climate conditions on local ecosystems.</p>
                        <div className="infographic">
                            <img src="/Screenshot 2024-08-25 at 5.44.17 PM.png" alt="Infographic" style={{ width: '50%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }} />
                        </div>
                        <ul>
                            <li>
                                <a href="https://www.worldwildlife.org/initiatives/climate" target="_blank" rel="noopener noreferrer">
                                    WWF Climate & Energy Resources
                                </a>
                            </li>
                            <li>
                                <a href="https://www.greenpeace.org/usa/research/" target="_blank" rel="noopener noreferrer">
                                    Greenpeace Research
                                </a>
                            </li>
                            <li>
                                <a href="https://www.nature.org/en-us/what-we-do/our-insights/" target="_blank" rel="noopener noreferrer">
                                    The Nature Conservancy: Climate Change Insights
                                </a>
                            </li>
                            <li>
                                <a href="https://www.youtube.com/user/TEDEducation" target="_blank" rel="noopener noreferrer">
                                    TED-Ed: Protecting Ecosystems from Climate Change
                                </a>
                            </li>
                        </ul>
                        <h3>Watch this video:</h3>
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/PqT5PBeqDuY" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    </>
                );
            default:
                return <p>Select a user type to view relevant educational content.</p>;
        }
    };

    return (
        <div className="educational-content">
            <h2>Educational Content</h2>
            {getContent()}
        </div>
    );
};

export default EducationalContent;
