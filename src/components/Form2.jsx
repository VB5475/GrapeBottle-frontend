import React, { useState } from 'react';
import axios from 'axios'; // Make sure you import axios
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';

const ImageGiver = ({ image }) => {
    const cld = new Cloudinary({ cloud: { cloudName: 'dn9xbamfz' } });

    // Use this sample image or upload your own via the Media Explorer
    const img = cld
        .image(image)
        .format('auto') // Optimize delivery by resizing and applying auto-format and auto-quality
        .quality('auto')
        .resize(auto().gravity(autoGravity()).width(500).height(500)); // Transform the image: auto-crop to square aspect_ratio
    console.log(img)
    // return (<AdvancedImage cldImg={img} />);
};

// export default ImageGiver

const gsheetApiUrl = process.env.REACT_APP_GSHEET_API_URL;
const dataBaseApiUrl = process.env.REACT_APP_GSHEET_API_URL;
const backendApiUrl = process.env.REACT_APP_GSHEET_API_URL;

function Form2() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        image: null, // Initial state for image file
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value, // Update name and email fields dynamically
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('image', formData.image);  // Add the selected file

        try {
            const response = await axios.post(backendApiUrl, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert(response.data.message);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit data.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
            />
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"

            />
            <input
                type="file"
                name="image"
                onChange={(e) => {
                    // ImageGiver(e.target.files[0])

                    setFormData({ ...formData, image: e.target.files[0] })


                }}
                required
            />
            <button type="submit">Submit</button>
        </form>
    );
}

export default Form2;
