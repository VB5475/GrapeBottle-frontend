// Grid.js
import React, { useState, useEffect } from 'react';
import Popup from './Popup';// Adjust the import path as needed
import SearchBar from './SearchBar'; // Import the SearchBar component

const Grid = () => {
    const [gridData, setGridData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const gsheetApiUrl = process.env.REACT_APP_GSHEET_API_URL;
    const dataBaseApiUrl = process.env.REACT_APP_GSHEET_API_URL;
    const backendApiUrl = process.env.REACT_APP_GSHEET_API_URL;


    async function fettcher() {
        try {
            const response = await fetch("https://103.27.120.198/provioWS/webservice/Charts.asmx/GrapebottleData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    Mode: "Get",
                    id: "",
                    itemData: ""
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Log the raw response text
            const rawData = await response.text(); // Use .text() to get the raw response
            // console.log("Raw response data:", rawData);

            // Parse the JSON response
            const data = JSON.parse(rawData); // Parse the outer JSON
            // console.log("Parsed outer JSON data:", data);

            const jsonData = JSON.parse(data.d); // Parse the 'd' property
            // console.log("Parsed 'd' property:", jsonData);

            const tempData = jsonData.Data;
            // console.log("Original tempData:", tempData);

            // Transform tempData into newtempData
            const newtempData = tempData.map((element, index) => {
                console.log(`Parsing data for element ${index}:`, element.data); // Log each data before parsing
                return JSON.parse(element.data); // Parse the 'data' property
            });

            console.log("Transformed newtempData:", newtempData);
            setGridData(newtempData)
            // return newtempData; // Optionally return the transformed data
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }





    useEffect(() => {
        // const tempGridData = JSON.parse(localStorage.getItem('gridData')) || [];


        // setGridData(tempGridData);
        // setFilteredData(tempGridData); // Initialize filteredData with all gridData


        fettcher()
    }, []);

    useEffect(() => {
        // Filter grid data based on search query
        const results = gridData.filter(item =>
            item.item.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredData(results);
    }, [searchQuery, gridData]);

    const handleViewDetails = (item) => {
        setSelectedItem(item);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedItem(null);
    };

    if (filteredData.length === 0) {
        return <>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <div>No data found. Please submit the form first.</div>
        </>;
    }

    return (<>  <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="flex items-center justify-center min-h-screen p-5">

            <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 max-w-6xl w-[200%] mt-4  " >
                {filteredData.map((formData, index) => (
                    <div key={index} className="flex flex-col bg-gray-200 rounded-lg p-4 m-2 shadow-md shadow-blue-400 ">
                        {formData.photos && formData.photos.length > 0 ? (
                            <div
                                className="h-40 bg-gray-400 rounded-lg"
                                style={{
                                    backgroundImage: `url(${formData.photos[0]})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            />
                        ) : (
                            <div className="h-40 bg-gray-400 rounded-lg"></div>
                        )}
                        <div className="flex flex-col items-center mt-4">
                            <h4 className="text-xl font-semibold">{formData.item}  </h4>
                            <p className="text-sm"><strong>Vintage:</strong> {formData.vintage}</p>
                            <p className="text-sm"><strong>Size:</strong> {formData.size}</p>
                            <a
                                className="p-2 leading-none rounded font-medium mt-3 bg-green-500 text-xs uppercase cursor-pointer text-white"
                                onClick={() => handleViewDetails(formData)}
                            >
                                View Details
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {isPopupOpen && <Popup item={selectedItem} onClose={closePopup} />}
        </div>
    </>

    );
};

export default Grid;
