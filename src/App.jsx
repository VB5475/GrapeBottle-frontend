import React, { useEffect, useState } from 'react';

import Grid from './components/Grid'; // Import your grid component
import Form from './components/Form';
import Form2 from './components/Form2';
import "./App.css"
// import Form from './components/Form';

const App = () => {
    const [activeTab, setActiveTab] = useState('grid');
    const [globalFormData, setGlobalFormData] = useState({})
    const [gridData, setGridData] = useState([]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // useEffect(() => {
    //     fettcher2()
    // }, [])
    function csvToJson(csvString) {
        // Split the CSV string into rows
        const rows = csvString.split('\n');

        // Extract the headers from the first row
        const headers = rows[0].split(',');

        // Map the remaining rows to JSON objects
        const json = rows.slice(1).reduce((accum, row) => {
            const values = row.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/); // Split respecting quotes

            // Skip empty rows or rows with only empty values
            if (values.every(value => value.trim() === '')) {
                return accum;
            }

            const obj = headers.reduce((acc, header, index) => {
                const key = header.trim().toLowerCase().replace(/\s+/g, ''); // Remove spaces and convert to lowercase
                const value = values[index]?.trim();

                // If the key is 'Photos' or 'GPhotos', split the value into an array by commas
                if (key === 'photos' || key === 'gphotos') {
                    acc[key] = value ? value.replace(/(^\"|\"$)/g, '').split(',').map(url => url.trim()) : [];
                } else {
                    acc[key] = value;
                }

                return acc;
            }, {});

            // Skip entries that result in an empty object or empty key-value pairs
            if (Object.entries(obj).every(([key, value]) => !key.trim() || !value.trim())) {
                return accum;
            }

            accum.push(obj);
            return accum;
        }, []);

        return json;
    }

    const fettcher2 = async () => {
        const link = process.env.REACT_APP_GSHEET_PUBLISH_URL;

        if (!link) {
            console.error("Environment variable REACT_APP_GSHEET_PUBLISH_URL is not set.");
            return;
        }

        console.log("Fetching data from:", link);

        try {
            const response = await fetch(link, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const rawData = await response.text();
            console.log("rawData:", rawData)
            const jsonData = csvToJson(rawData)
            console.log("Fetched data:", jsonData);
            setGridData(jsonData)

            // Handle the parsed data here, e.g., setState(rawData);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };

    return (<>


        <div className="w-full max-w-md mx-auto mt-10 bg-white rounded-lg shadow-lg ">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 gap-2 ">
                <button
                    onClick={() => handleTabChange('form')}
                    className={`flex-1 text-center py-2 rounded-lg transition-all ${activeTab === 'form' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                        }`}
                >
                    Form
                </button>
                <button
                    onClick={() => handleTabChange('grid')}
                    className={`flex-1 text-center py-2 rounded-lg transition-all ${activeTab === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                        }`}
                >
                    Grid
                </button>

            </div>

            <div className="p-4">
                {activeTab === 'form' ? (
                    <Form globalFormData={globalFormData} setActiveTab={setActiveTab} gridData={gridData} setGridData={setGridData} />
                ) : (
                    <Grid setActiveTab={setActiveTab} setGlobalFormData={setGlobalFormData} globalFormData={globalFormData} gridData={gridData} setGridData={setGridData} fettcher2={fettcher2} />
                )}
            </div>
        </div >

    </>
    );
};

export default App;
