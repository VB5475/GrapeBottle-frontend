import React, { useState, useEffect } from 'react';

const Grid = () => {
    const [gridData, setGridData] = useState([])

    useEffect(() => {
        const tempGridData = JSON.parse(localStorage.getItem('gridData')) || [];
        console.log(tempGridData)
        setGridData(tempGridData)
    }, [])


    if (gridData.length === 0) {
        return <div>No data found. Please submit the form first.</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {gridData.map((formData, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4 h-auto">
                    <h3 className="text-lg font-bold">{formData.item}</h3>
                    <p><strong>Vintage:</strong> {formData.vintage}</p>
                    <p><strong>Size:</strong> {formData.size}</p>
                    <p><strong>Quantity:</strong> {formData.qty}</p>
                    <p><strong>Packaging:</strong> {formData.packaging}</p>
                    <p><strong>Condition:</strong> {formData.condition}</p>
                    <p><strong>Label:</strong> {formData.label}</p>
                    <p><strong>Capsules/Corks:</strong> {formData.capsulesCorks}</p>
                    <p><strong>Temp/Humidity:</strong> {formData.tempHumidity}</p>
                    <p><strong>Bottle Fill Level:</strong> {formData.bottleFillLevel}</p>
                    <p><strong>Provenance:</strong> {formData.provenance}</p>
                    <p><strong>Tasting Notes:</strong> {formData.tastingNotes}</p>
                    <p><strong>LWIN:</strong> {formData.lwin}</p>
                    <p><strong>Box ID:</strong> {formData.boxId}</p>
                    <p><strong>Market Value:</strong> {formData.marketValue}</p>
                    <p><strong>Last Trade:</strong> {formData.lastTrade}</p>

                    {formData.photos && formData.photos.length > 0 && (
                        <div>
                            <h4 className="font-semibold">Photos:</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {formData.photos.map((src, photoIndex) => (
                                    <img
                                        key={photoIndex}
                                        src={src} // Use loaded image or placeholder
                                        alt={`Photo ${photoIndex}`}
                                        className="w-full h-auto rounded"
                                        style={{ maxHeight: '200px' }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Grid;
