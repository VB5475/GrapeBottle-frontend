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
                const newdata = JSON.parse(element.data);
                const newObj = { ...newdata, id: element.id };
                return newObj;
            });

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
            const results = gridData?.filter(item => {
                if (searchQuery === '') return true;
                return item.item.toLowerCase().includes(searchQuery.toLowerCase());
            });
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
        setGlobalFormData(item);
        setActiveTab("form");
    };

    const handleDelete = async (item) => {
        await fetch("https://103.27.120.198/provioWS/webservice/Charts.asmx/GrapebottleData", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                Mode: "Delete",
                id: `${item.id}`,
                itemData: ""
            })
        })
            .then(res => {
                toast.success("Deleted successfully");
            })
            .catch(e => {
                console.log(e.message);
                toast.error("Delete failed");
            });

        setGridData((prevData) => prevData.filter((data) => data !== item));
    };

    if (filteredData.length === 0) {
        return (
            <>
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                <div>No data found. Please submit the form first.</div>
            </>
        );
    }

    return (
        <>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <div className={`flex ${filteredData?.length > 2 ? "items-center" : "items-start"} justify-center h-auto  p-5`}>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-4 max-w-6xl w-[200%] mt-4">
                    {filteredData.map((formData, index) => (
                        <div key={index} className="relative flex flex-col bg-white rounded-lg p-4 m-2 shadow-md shadow-blue-400">

                            {formData?.photos && formData?.photos?.length > 0 ? (
                                <div
                                    className="h-40 bg-gray-400 rounded-lg"
                                    style={{
                                        backgroundImage: `url(${formData.photos[0]})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                />
                            ) : (
                                <div className="h-40 bg-red-600 rounded-lg"></div>
                            )}

                            <div className="absolute top-2 right-2 flex space-x-2">
                                {/* Edit button with yellow outline */}
                                <button
                                    className="flex items-center justify-center w-8 h-8 bg-white border border-yellow-500 rounded-full hover:bg-gray-400 transition"
                                    onClick={() => handleEdit(formData)}
                                >
                                    <AiOutlineEdit size={16} color='#eab308' />
                                </button>


                                {/* Delete button with red outline */}
                                <button
                                    className="flex items-center justify-center w-8 h-8 bg-white border border-red-500 rounded-full hover:bg-gray-400 transition"
                                    onClick={() => handleDelete(formData)}
                                >
                                    <AiOutlineDelete size={16} color='red' />
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
