import React, { useState } from 'react';

function Worked() {
    const [images, setImages] = useState([]);

    // Handle multiple image uploads from gallery or camera
    const handleImageUpload = (event) => {
        const files = event.target.files;
        const newImages = [];

        // Loop through all selected files
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            reader.onload = (e) => {
                newImages.push(e.target.result); // Add the image Data URL to the array
                // Once all images are read, update the state
                if (newImages.length === files.length) {
                    setImages((prevImages) => [...prevImages, ...newImages]); // Append new images to the existing ones
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const imgStyle = {
        width: '100%',
        height: 'auto',
        maxWidth: '400px',
        border: '1px solid black',
        margin: '20px auto',
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Select Images from Gallery or Camera</h2>

            {/* Input to select multiple images from the gallery or camera */}
            <input
                type="file"
                accept="image/*"
                multiple // Allows selecting multiple images
                onChange={handleImageUpload}
                style={{ display: 'block', margin: '20px auto' }}
            />

            {/* Display all selected images */}
            {images.length > 0 && (
                <div>
                    <h3>Selected Images:</h3>
                    {images.map((src, index) => (
                        <img key={index} src={src} alt={`Selected ${index}`} style={imgStyle} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Worked;
