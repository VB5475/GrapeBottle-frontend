import { useState, useEffect, useRef } from "react";
import Form from "./Form";

const Popup = ({ item, onClose, globalFormData, setGlobalFormData }) => {
    const popupRef = useRef();
    const [edit, setEdit] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null); // State for selected image in the modal

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose(); // Close popup if clicking outside
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const handleEdit = (item) => {
        setGlobalFormData(item);
        setEdit(true);
    };

    const handleVerify = () => {
        console.log("This function verifies the item");
    };

    const openImageModal = (src) => {
        setSelectedImage(src); // Open modal with the clicked image
    };

    const closeImageModal = () => {
        setSelectedImage(null); // Close modal
    };

    if (!item) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div
                ref={popupRef}
                className="w-10/12 md:w-3/4 lg:w-1/2 bg-white rounded-lg shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
                style={{ maxWidth: "100%", maxHeight: "90vh" }}
            >
                <div className="flex justify-end items-center">
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
                        X
                    </button>
                </div>

                {edit && globalFormData ? (
                    <Form globalFormData={item} />
                ) : (
                    <>
                        <div className="mt-4 border-[1px] border-gray-200 bg-blue-300 shadow-md rounded-md text-gray-900 overflow-hidden">
                            <table className="w-full table-auto text-left">
                                <thead className="bg-primary text-white">
                                    <tr>
                                        <th className="w-1/4 py-3 px-4 text-lg font-medium text-center">Attribute</th>
                                        <th className="py-3 px-4 text-lg font-medium text-center">Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="bg-white border border-gray-200 py-3 px-4 font-semibold text-center">Name</td>
                                        <td className="bg-gray-50 border border-gray-200 py-3 px-4 text-center">{item.item || "unknown"}</td>
                                    </tr>
                                    <tr>
                                        <td className="bg-white border border-gray-200 py-3 px-4 font-semibold text-center">Vintage</td>
                                        <td className="bg-gray-50 border border-gray-200 py-3 px-4 text-center">{item.vintage}</td>
                                    </tr>
                                    <tr>
                                        <td className="bg-white border border-gray-200 py-3 px-4 font-semibold text-center">Size</td>
                                        <td className="bg-gray-50 border border-gray-200 py-3 px-4 text-center">{item.size}</td>
                                    </tr>
                                    <tr>
                                        <td className="bg-white border border-gray-200 py-3 px-4 font-semibold text-center">Current Market Price</td>
                                        <td className="bg-gray-50 border border-gray-200 py-3 px-4 text-center">{item.currentMarketPrice}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-center mt-5">
                            <button
                                onClick={() => handleEdit(item)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
                            >
                                Edit
                            </button>
                            {item.verified.toLowerCase() === "false" && (
                                <button
                                    onClick={() => handleVerify(item)}
                                    className="px-4 py-2 ml-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-300"
                                >
                                    Verify
                                </button>
                            )}
                        </div>

                        {item.photos && item.photos.length > 0 && (
                            <div className="mt-4">
                                <h4 className="font-semibold">Photos:</h4>
                                <div className="flex flex-wrap gap-2 items-center justify-center">
                                    {item.photos.map((src, photoIndex) => (
                                        <img
                                            key={photoIndex}
                                            src={src}
                                            alt={`Photo ${photoIndex}`}
                                            className="w-full h-auto rounded shadow-lg shadow-gray-400 cursor-pointer"
                                            style={{ maxHeight: "200px", maxWidth: "200px" }}
                                            onClick={() => openImageModal(src)} // Open modal on click
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

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

                    </>
                )}
            </div>
        </div>
    );
};

export default Popup;
