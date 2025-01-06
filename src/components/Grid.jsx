import React, { useState, useEffect } from 'react';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai'; // Import icons from react-icons
import { FaCircleCheck } from "react-icons/fa6";
import Popup from './Popup'; // Adjust the import path as needed
import SearchBar from './SearchBar'; // Import the SearchBar component
import { toast, ToastContainer } from 'react-toastify';
import Form from './Form';
const Grid = ({ setActiveTab, setGlobalFormData, globalFormData, gridData, setGridData, fettcher2 }) => {

    const [filteredData, setFilteredData] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query



    const handleEdit = (item) => {
        setGlobalFormData(item);
        // setEdit(true)
        setActiveTab("form")
    };

    async function handleGsheetDelete(id) {

        console.log("test triggred")



        console.log("its triggered")
        const tempFormData = new FormData();
        tempFormData.append("uniqueID", id)
        tempFormData.append("action", "delete")






        // Print the contents of tempFormData
        tempFormData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });

        fetch("https://script.google.com/macros/s/AKfycbzxtco7C36mXnJ5vhb0-YBviC6guoJY4X5NjcsTZv6G9pwUrQszLw3r5CF2l0Amwt4/exec", { method: "POST", body: tempFormData })
            .then((response) => {
                console.log("trrigerd from here")
                console.log(response)
                toast.success("deleted from excel")
            })
            .catch((error) => toast.error("failed to delete at excel"));



    }






    const poster = async (csvValue) => {
        const link = process.env.REACT_APP_GSHEET_PUBLISH_URL;

        if (!link) {
            console.error("Environment variable REACT_APP_GSHEET_PUBLISH_URL is not set.");
            return;
        }

        console.log("Fetching data from:", link);

        try {
            const response = await fetch(link, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(csvValue)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const rawData = await response;
            console.log("rawData:", rawData)
            // const jsonData = csvToJson(rawData)
            // console.log("Fetched data:", jsonData);
            // setGridData(jsonData)

            // Handle the parsed data here, e.g., setState(rawData);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };




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
            console.log("newtempData:", newtempData)
            setGridData(newtempData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        // fettcher();
        fettcher2()
    }, []);

    useEffect(() => {
        if (gridData?.length > 0) {
            console.log("gridData:", gridData)
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



    const handleDelete = async (item) => {

        console.log("item is here")
        console.log(item)

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
            .then(async res => {
                await handleGsheetDelete(item.uniqueID)
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
                <div className="grid md:grid-cols-1 grid-cols-1 gap-4 max-w-6xl w-[200%] mt-4">
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
                                {formData.verified.toLowerCase() === "true" && <button
                                    className="flex items-center justify-center w-8 h-8 bg-white border border-blue-500 rounded-full hover:bg-gray-400 transition"
                                    onClick={() => handleEdit(formData)}
                                >
                                    <FaCircleCheck size={20} color='#1d4ed8' />
                                </button>
                                }

                                {/* Delete button with red outline */}
                                {/* <button
                                    className="flex items-center justify-center w-8 h-8 bg-white border border-red-500 rounded-full hover:bg-gray-400 transition"
                                    onClick={() => handleDelete(formData)}
                                >
                                    <AiOutlineDelete size={16} color='red' />
                                </button> */}

                            </div>
                            <div className="flex flex-col items-center mt-4">
                                <h4 className="text-xl font-semibold break-words text-center">{formData.item}</h4>
                                <div className='flex mt-5 mb-3 gap-10 items-center justify-center'> <p className="text-sm ">
                                    <strong>Vintage:</strong> {formData.vintage}
                                </p>
                                    <p className="text-sm">
                                        <strong>Size:</strong> {formData.size}
                                    </p></div>

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

                {isPopupOpen && <Popup item={selectedItem} onClose={closePopup} setGridData={setGridData} poster={poster} globalFormData={globalFormData} setGlobalFormData={setGlobalFormData} />}

                <ToastContainer />
            </div>
        </>
    );
};

export default Grid;
