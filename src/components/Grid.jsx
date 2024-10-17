// Grid.js
import React, { useState, useEffect } from 'react';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai'; // Import icons from react-icons
import Popup from './Popup'; // Adjust the import path as needed
import SearchBar from './SearchBar'; // Import the SearchBar component
import { toast, ToastContainer } from 'react-toastify';

const Grid = ({ setActiveTab, setGlobalFormData }) => {
    const [gridData, setGridData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const gsheetApiUrl = process.env.REACT_APP_GSHEET_API_URL;
    const dataBaseApiUrl = process.env.REACT_APP_GSHEET_API_URL;
    const backendApiUrl = process.env.REACT_APP_GSHEET_API_URL;

    const fettcher = async () => {
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

            const rawData = await response.text();
            const data = JSON.parse(rawData);
            const jsonData = JSON.parse(data.d);
            const tempData = jsonData.Data;

            const newtempData = tempData.map((element) => {
                console.log(element)

                const newdata = JSON.parse(element.data)
                const newObj = { ...newdata, id: element.id }
                // const newObj = {
                //     id: element.id,
                //     data: JSON.parse(element.data)

                // }
                console.log("new obj")
                console.log(newObj)
                return newObj

            }

            );
            console.log(newtempData)

            setGridData(newtempData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fettcher();
    }, []);

    useEffect(() => {
        if (gridData?.length > 0) {
            console.log(gridData)
            const results = gridData?.filter(item => {
                console.log("itemishere")
                console.log(item)
                if (searchQuery === '') return true;
                return item.item.toLowerCase().includes(searchQuery.toLowerCase())
            }
            );
            console.log("result", results)
            setFilteredData(results);
        }
    }, [searchQuery, gridData]);

    const handleViewDetails = (item) => {
        setSelectedItem(item);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedItem(null);
    };

    const handleEdit = (item) => {
        // Add your edit logic here (e.g., open an edit form)
        console.log('Edit item:', item);

        setGlobalFormData(item)
        setActiveTab("form")


    };

    const handleDelete = async (item) => {
        // Add your delete logic here (e.g., remove item from gridData)
        console.log('Delete item:', item);

        await fetch(dataBaseApiUrl, {
            // headers: {
            //     "Content-Type": "application/json" // Fixed the capitalization
            // },

            method: "POST",
            body: JSON.stringify({ // Convert the body to a JSON string
                Mode: "Delete",
                id: item.id,
                itemData: ""
            })
        }).then(res => {
            toast.success("deleted success") // Ensure the promise is returned
        }).catch(e => {
            console.log(e.message)
            toast.error("not deleted")
        });

        setGridData((prevData) => prevData.filter((data) => data !== item)); // Example delete logic
    };

    if (filteredData.length === 0) {
        return (
            <>
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                <div>No data found. Please submit the form first.</div>
            </>
        );
    }
    console.log("filter data")
    // console.log(filteredData)
    filteredData.forEach((i) => console.log(i))
    return (
        <>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <div className="flex items-center justify-center min-h-screen p-5">
                <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 max-w-6xl w-[200%] mt-4">
                    {filteredData.map((formData, index) => (
                        <div key={index} className="relative flex flex-col bg-white rounded-lg p-4 m-2 shadow-md shadow-blue-400">

                            {formData?.photos && formData?.photos?.length > 0 ? (<>
                                {/* {console.log("here")}
                                {console.log(formData)}
                                <div>{formData}</div> */}
                                < div
                                    className="h-40 bg-gray-400 rounded-lg"
                                    // src={formData.photos[0]}
                                    style={{
                                        backgroundImage: `url(${formData.photos[0]})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                /></>

                            ) : (
                                <div className="h-40 bg-red-600 rounded-lg"></div>
                            )}
                            <div className="absolute top-2 right-2 flex space-x-2">
                                <button
                                    className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full hover:bg-gray-400 transition"
                                    onClick={() => handleEdit(formData)}
                                >
                                    <AiOutlineEdit onClick={console.log(formData)} size={16} className="text-gray-800" />
                                </button>
                                <button
                                    className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full hover:bg-gray-400 transition"
                                    onClick={() => handleDelete(formData)}
                                >
                                    <AiOutlineDelete size={16} className="text-gray-800" />
                                </button>
                            </div>
                            <div className="flex flex-col items-center mt-4">
                                <h4 className="text-xl font-semibold">{formData.item}</h4>
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

                <ToastContainer />
            </div>
        </>
    );
};

export default Grid;
