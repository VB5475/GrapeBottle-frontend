import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import Popup from "./Popup";
import SearchBar from "./SearchBar";

const Grid = ({
    setActiveTab,
    setGlobalFormData,
    globalFormData,
    gridData,
    setGridData,
}) => {
    const [filteredData, setFilteredData] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
    const [loading, setLoading] = useState(false); // Loading state

    const handleEdit = (item) => {
        setGlobalFormData(item);
        setActiveTab("form");
    };

    async function handleGsheetDelete(id) {
        setLoading(true); // Start loading
        const tempFormData = new FormData();
        tempFormData.append("uniqueID", id);
        tempFormData.append("action", "delete");

        try {
            const response = await fetch(
                "https://script.google.com/macros/s/AKfycbzxtco7C36mXnJ5vhb0-YBviC6guoJY4X5NjcsTZv6G9pwUrQszLw3r5CF2l0Amwt4/exec",
                { method: "POST", body: tempFormData }
            );
            console.log(response);
            toast.success("Deleted from Excel");
        } catch (error) {
            toast.error("Failed to delete from Excel");
        } finally {
            setLoading(false); // Stop loading
        }
    }

    const fettcher = async () => {
        setLoading(true); // Start loading
        try {
            const response = await fetch(
                "https://103.27.120.198/provioWS/webservice/Charts.asmx/GrapebottleWinesData",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ Mode: "GETALL", id: "", itemData: "" }),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const rawData = await response.text();
            const data = JSON.parse(rawData);
            const jsonData = JSON.parse(data.d);
            const tempData = jsonData.Data;

            setGridData(tempData);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to fetch data");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const updateWineData = async (itemData) => {
        setLoading(true); // Start loading
        const sanitizedItemData = Object.keys(itemData).reduce((acc, key) => {
            const sanitizedKey = key.replace(/\s+/g, ""); // Remove spaces from key
            acc[sanitizedKey] = itemData[key];
            return acc;
        }, {});

        try {
            await fetch(
                "https://103.27.120.198/provioWS/webservice/Charts.asmx/GrapebottleWinesData",
                {
                    headers: { "Content-Type": "application/json" },
                    method: "POST",
                    body: JSON.stringify({
                        Mode: "Update",
                        id: `${itemData.ID}`,
                        itemData: JSON.stringify(sanitizedItemData),
                    }),
                }
            );
            fettcher(); // Refresh data
            toast.success("Saved Successfully");
        } catch (e) {
            console.log(e.message);
            toast.error("Save Failed");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    useEffect(() => {
        fettcher();
    }, []);

    useEffect(() => {
        if (gridData?.length > 0) {
            const results = gridData.filter((item) => {
                if (!searchQuery) return true;
                const lowerCaseQuery = searchQuery.toLowerCase();
                return (
                    item.Name?.toLowerCase().includes(lowerCaseQuery) ||
                    item.Size?.toLowerCase().includes(lowerCaseQuery) ||
                    item["Original Market Value"]?.toLowerCase().includes(lowerCaseQuery)
                );
            });
            setFilteredData(results);
        } else {
            setFilteredData([]);
        }
    }, [searchQuery, gridData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-green-500"></div>
            </div>
        );
    }

    const handleViewDetails = (item) => {
        setSelectedItem(item);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedItem(null);
    };

    return (
        <>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <div
                className={`flex ${
                    filteredData?.length > 2 ? "items-center" : "items-start"
                } justify-center h-auto p-5`}
            >
                <div className="grid md:grid-cols-1 grid-cols-1 gap-4 max-w-6xl w-[200%] mt-4">
                    {filteredData.map((formData, index) => (
                        <div
                            key={index}
                            className={`relative flex flex-col bg-white rounded-lg p-4 m-2 shadow-md ${
                                formData.Verified
                                    ? "shadow-green-400"
                                    : "shadow-blue-400"
                            }`}
                        >
                            {/* Row Number */}
                            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                {index + 1}
                            </div>

                            {/* Verified Tick */}
                            {formData.Verified && (
                                <div className="absolute top-2 right-2">
                                    <img
                                        src="/src/assets/greentick.png"
                                        alt="Verified"
                                        className="w-6 h-6"
                                    />
                                </div>
                            )}

                            {/* Image Section */}
                            {formData?.Photos && formData?.Photos?.length > 0 ? (
                                <div
                                    className="h-40 bg-white rounded-lg flex items-center justify-center"
                                    style={{
                                        backgroundImage: `url(${formData.Photos.split(
                                            ","
                                        )[0]})`,
                                        backgroundSize: "contain",
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "center",
                                    }}
                                />
                            ) : (
                                <div className="h-40 bg-red-600 rounded-lg flex items-center justify-center text-white">
                                    <span>No Image</span>
                                </div>
                            )}

                            {/* Details Section */}
                            <div className="flex flex-col items-center mt-4">
                                <h4 className="text-xl font-semibold break-words text-center">
                                    {formData.Name || "No Name"}
                                </h4>
                                <p className="text-sm mt-2">
                                    <strong>Size:</strong> {formData.Size || "N/A"}
                                </p>
                                <p className="text-sm">
                                    <strong>Retail Price:</strong>{" "}
                                    {formData["Original Market Value"] || "N/A"}
                                </p>
                                {formData["New Price"] && (
                                    <p className="text-sm text-green-600 mt-1">
                                        <strong>New Retail Price:</strong>{" "}
                                        {formData["New Price"]}
                                    </p>
                                )}

                                <a
                                    className="p-2 leading-none rounded font-medium mt-3 bg-green-500 text-xs uppercase cursor-pointer text-white"
                                    onClick={() => {
                                        setSelectedItemIndex(index);
                                        handleViewDetails(formData);
                                    }}
                                >
                                    View Details
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isPopupOpen && (
                <Popup
                    item={selectedItem}
                    updateData={updateWineData}
                    onClose={closePopup}
                    setGridData={setGridData}
                    globalFormData={globalFormData}
                    setGlobalFormData={setGlobalFormData}
                />
            )}

            <ToastContainer />
        </>
    );
};

export default Grid;