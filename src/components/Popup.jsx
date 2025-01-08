import { useState, useEffect, useRef } from "react";

const Popup = ({ item, updateData, onClose, globalFormData, setGlobalFormData }) => {
    const popupRef = useRef();
    const [edit, setEdit] = useState(false);
    const [newPrice, setNewPrice] = useState(item["New Price"] || ""); // State for the New Price
    const [isPriceChanged, setIsPriceChanged] = useState(false); // Track if price has changed
    const [selectedImage, setSelectedImage] = useState(null);



    const handleSaveOrVerify = () => {
        const updatedItem = { ...item, "New Price": newPrice, Verified: 1 }; // Update New Price and Verified
        setGlobalFormData(updatedItem);
        console.log("Updated Item:", updatedItem);
        updateData(updatedItem);
        onClose(); // Close the modal
    };

    const handlePriceChange = (e) => {
        const updatedPrice = e.target.value;
        setNewPrice(updatedPrice);

        // Check if price has changed from the original value
        setIsPriceChanged(updatedPrice !== item["New Price"]);
    };

    const openImageModal = (src) => {
        setSelectedImage(src);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    if (!item) return null;

    const photos = item.Photos
        ? Array.isArray(item.Photos)
            ? item.Photos
            : item.Photos.split(",").map((url) => url.trim())
        : [];

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            {/* Close Button Outside the Popup */}
            <button
                onClick={onClose}
                className="absolute top-5 right-5 text-gray-600 hover:text-gray-900 text-2xl font-bold bg-white p-2 rounded-full shadow-md"
            >
                &times;
            </button>

            {/* Popup Content */}
            <div
                ref={popupRef}
                className="w-10/12 md:w-3/4 lg:w-1/2 bg-white rounded-lg shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
            >
                {/* Photos Section */}
                {photos.length > 0 && (
                    <div className="mt-2">
                        <h4 className="font-semibold text-center">Photos:</h4>
                        <div className="relative w-full overflow-hidden">
                            <div className="flex overflow-x-scroll snap-x snap-mandatory space-x-4 mt-4 w-full px-4">
                                {photos.map((src, photoIndex) => (
                                    <div
                                        key={photoIndex}
                                        className="flex-shrink-0 w-full max-w-xs snap-center flex flex-col items-center"
                                    >
                                        <img
                                            src={src}
                                            alt={`Photo ${photoIndex}`}
                                            className="w-full h-60 object-cover rounded shadow-lg"
                                            onClick={() => openImageModal(src)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Details Table */}
                <div className="mt-4 border-[1px] border-gray-200 bg-blue-50 shadow-md rounded-md text-gray-900 overflow-hidden">
                    <table className="w-full table-auto text-left">
                        <thead className="bg-primary">
                            <tr>
                                <th className="w-1/3 py-3 px-4 text-lg font-medium text-center">Attribute</th>
                                <th className="py-3 px-4 text-lg font-medium text-center">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="bg-white border border-gray-200 py-3 px-4 font-semibold text-center">Name</td>
                                <td className="bg-gray-50 border border-gray-200 py-3 px-4 text-center">{item.Name || "Unknown"}</td>
                            </tr>
                            <tr>
                                <td className="bg-white border border-gray-200 py-3 px-4 font-semibold text-center">Size</td>
                                <td className="bg-gray-50 border border-gray-200 py-3 px-4 text-center">{item.Size || "N/A"}</td>
                            </tr>
                            <tr>
                                <td className="bg-white border border-gray-200 py-3 px-4 font-semibold text-center"> Retail Price</td>
                                <td className="bg-gray-50 border border-gray-200 py-3 px-4 text-center">
                                    {item["Original Market Value"] || "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td className="bg-white border border-gray-200 py-3 px-4 font-semibold text-center">New Retail Price</td>
                                <td className="bg-gray-50 border border-gray-200 py-3 px-4 text-center">
                                    <input
                                        type="text"
                                        value={newPrice}
                                        onChange={handlePriceChange}
                                        className="border border-gray-300 rounded p-2 w-full"
                                        placeholder="Enter new price"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Save or Verify Button */}
                <div className="flex justify-center mt-5">
                    <button
                        onClick={handleSaveOrVerify}
                        className={`px-4 py-2 ${
                            isPriceChanged ? "bg-green-600" : "bg-blue-600"
                        } text-white rounded hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-300`}
                    >
                        {isPriceChanged ? "Save" : "Verified"}
                    </button>
                </div>

                {/* Image Modal */}
                {selectedImage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
                        <div className="relative bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 max-w-6xl">
                            <button
                                className="absolute top-3 right-3 text-white bg-red-600 p-3 rounded-lg hover:bg-red-700"
                                onClick={closeImageModal}
                            >
                                &times;
                            </button>
                            <div className="flex items-center justify-center p-4">
                                <img
                                    src={selectedImage}
                                    alt="Selected"
                                    className="w-full h-auto max-h-[85vh] rounded"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Popup;