import React, { useState, useEffect } from "react";
import Popup from "./Popup"; // Adjust the import path as needed
import SearchBar from "./SearchBar"; // Import the SearchBar component
import { toast, ToastContainer } from "react-toastify";

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
  const [filter, setFilter] = useState("all"); // State to manage Verified/Not Verified filter

  useEffect(() => {
    const applyFilter = () => {
      let filtered = gridData;

      // Apply filter based on selected filter type
      if (filter === "verified") {
        filtered = gridData.filter((item) => item.Verified);
      } else if (filter === "not-verified") {
        filtered = gridData.filter((item) => !item.Verified);
      }

      // Apply search query filter
      if (searchQuery) {
        filtered = filtered.filter((item) => {
          const lowerCaseQuery = searchQuery.toLowerCase();
          return (
            item.Name?.toLowerCase().includes(lowerCaseQuery) ||
            item.Size?.toLowerCase().includes(lowerCaseQuery) ||
            item["Original Market Value"]?.toLowerCase().includes(lowerCaseQuery)
          );
        });
      }

      setFilteredData(filtered);
    };

    applyFilter();
  }, [gridData, filter, searchQuery]);

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  const updateWineData = (itemData) => {
    console.log("Update Wine Data")
    console.log(itemData)
    filteredData[selectedItemIndex] = itemData
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
{/* Search Bar and Filter Badges */}
<div className="flex flex-col gap-4 mb-4 items-center">
    {/* Search Bar */}
    <div className="w-full">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </div>

    {/* Filter Badges */}
    <div className="flex justify-center gap-4">
        <span
            onClick={() => handleFilterChange("verified")}
            className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium ${
                filter === "verified"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-800"
            }`}
        >
            Verified
        </span>
        <span
            onClick={() => handleFilterChange("not-verified")}
            className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium ${
                filter === "not-verified"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-800"
            }`}
        >
            Not Verified
        </span>
        <span
            onClick={() => handleFilterChange("all")}
            className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium ${
                filter === "all"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
            }`}
        >
            All
        </span>
    </div>
</div>

      {/* Grid Content */}
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
                formData.Verified ? "shadow-green-400" : "shadow-blue-400"
              }`}
            >
              {/* Row Number */}
              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {index + 1} {/* Display row number starting from 1 */}
              </div>

              {/* Verified Tick */}
              {formData.Verified && (
                <div className="absolute top-2 right-2">
                  <img
                    src="/src/assets/greentick.png" // Replace with the actual path to your green tick icon
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
                    backgroundImage: `url(${formData.Photos.split(",")[0]})`,
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

                {/* Conditional Rendering for New Price */}
                {formData["New Price"] && (
                  <p className="text-sm text-green-600 mt-1">
                    <strong>New Retail Price:</strong> {formData["New Price"]}
                  </p>
                )}

                {/* View Details Button */}
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
        />
      )}

      <ToastContainer />
    </>
  );
};

export default Grid;