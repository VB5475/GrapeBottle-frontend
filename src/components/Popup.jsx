
import { useState, useEffect, useRef } from "react";
const Popup = ({ item, onClose }) => {
    const popupRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose(); // Close popup if clicking outside
            }
        };

        // Add event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup function to remove the event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    if (!item) return null; // Return null if no item is provided

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div
                ref={popupRef}
                className="w-10/12 md:w-3/4 lg:w-1/2 bg-white rounded-lg shadow-2xl p-6 max-h-[90vh] overflow-y-auto  "
                style={{ maxWidth: '100%', maxHeight: '90vh' }} // Ensure it doesn't exceed the viewport
            >
                <div className="flex justify-end items-center">
                    {/* <h2 className="text-lg font-semibold">{item.item}</h2> */}
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
                        X
                    </button>
                </div>
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
                                <td className="bg-white border border-gray-200 py-3 px-4 font-semibold text-center">Quantity</td>
                                <td className="bg-gray-50 border border-gray-200 py-3 px-4 text-center">{item.qty}</td>
                            </tr>
                            <tr>
                                <td className="bg-white border border-gray-200 py-3 px-4 font-semibold text-center">Packaging</td>
                                <td className="bg-gray-50 border border-gray-200 py-3 px-4 text-center">{item.packaging}</td>
                            </tr>
                            <tr>
                                <td className="bg-white border border-gray-200 py-3 px-4 font-semibold text-center">Condition</td>
                                <td className="bg-gray-50 border border-gray-200 py-3 px-4 text-center">{item.condition}</td>
                            </tr>
                            <tr>
                                <td className="bg-white border border-gray-200 py-3 px-4 font-semibold text-center">Label</td>
                                <td className="bg-gray-50 border border-gray-200 py-3 px-4 text-center">{item.label}</td>
                            </tr>
                            <tr>
                                <td className="bg-white border border-gray-200 py-3 px-4 font-semibold text-center">Capsules/Corks</td>
                                <td className="bg-gray-50 border border-gray-200 py-3 px-4 text-center">{item.capsulesCorks}</td>
                            </tr>
                            <tr>
                                <td className="bg-white border border-gray-200 py-3 px-4 font-semibold text-center">Temp/Humidity</td>
                                <td className="bg-gray-50 border border-gray-200 py-3 px-4 text-center">{item.tempHumidity}</td>
                            </tr>
                            <tr>
                                <td className="bg-white border border-gray-200 py-3 px-4 font-semibold text-center">Bottle Fill Level</td>
                                <td className="bg-gray-50 border border-gray-200 py-3 px-4 text-center">{item.bottleFillLevel}</td>
                            </tr>
                            <tr>
                                <td className="bg-white border border-gray-200 py-3 px-4 font-semibold text-center">Provenance</td>
                                <td className="bg-gray-50 border border-gray-200 py-3 px-4 text-center">{item.provenance}</td>
                            </tr>
                            <tr>
                                <td className="bg-white border border-gray-200 py-3 px-4 font-semibold text-center">Tasting Notes</td>
                                <td className="bg-gray-50 border border-gray-200 py-3 px-4 text-center">{item.tastingNotes}</td>
                            </tr>
                            <tr>
                                <td className="bg-white border border-gray-200 py-3 px-4 font-semibold text-center">LWIN</td>
                                <td className="bg-gray-50 border border-gray-200 py-3 px-4 text-center">{item.lwin}</td>
                            </tr>
                            <tr>
                                <td className="bg-white border border-gray-200 py-3 px-4 font-semibold text-center">Box ID</td>
                                <td className="bg-gray-50 border border-gray-200 py-3 px-4 text-center">{item.boxId}</td>
                            </tr>
                            <tr>
                                <td className="bg-white border border-gray-200 py-3 px-4 font-semibold text-center">Market Value</td>
                                <td className="bg-gray-50 border border-gray-200 py-3 px-4 text-center">{item.marketValue}</td>
                            </tr>
                            <tr>
                                <td className="bg-white border border-gray-200 py-3 px-4 font-semibold text-center">Last Trade</td>
                                <td className="bg-gray-50 border border-gray-200 py-3 px-4 text-center">{item.lastTrade}</td>
                            </tr>
                            <tr>
                                <td className="bg-white border border-gray-200 py-3 px-4 font-semibold text-center">Barcode</td>
                                <td className="bg-gray-50 border border-gray-200 py-3 px-4 text-center">{item.barcode}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {item.photos && item.photos.length > 0 && (
                    <div className="mt-4">
                        <h4 className="font-semibold">Photos:</h4>
                        <div className="flex flex-wrap gap-2 items-center justify-center   ">
                            {item.photos.map((src, photoIndex) => (
                                <img
                                    key={photoIndex}
                                    src={src}
                                    alt={`Photo ${photoIndex}`}
                                    className="w-full h-auto rounded shadow-lg shadow-gray-400"
                                    style={{ maxHeight: '200px', maxWidth: '200px' }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default Popup