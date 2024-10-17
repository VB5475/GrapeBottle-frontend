import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Form = () => {
    const gsheetApiUrl = process.env.REACT_APP_GSHEET_API_URL;
    const dataBaseApiUrl = process.env.REACT_APP_GSHEET_API_URL;
    const backendApiUrl = process.env.REACT_APP_GSHEET_API_URL;
    const [formData, setFormData] = useState({
        item: '',
        vintage: '',
        size: '',
        qty: '',
        packaging: '',
        condition: '',
        label: '',
        capsulesCorks: '',
        tempHumidity: '',
        bottleFillLevel: '',
        provenance: '',
        tastingNotes: '',
        lwin: '',
        boxId: '',
        marketValue: '',
        lastTrade: '',
        photos: [],
    });

    const [imagePreviews, setImagePreviews] = useState([]);


    useEffect(() => {
        console.log(formData)

    }, [formData])


    useEffect(() => {
        // Cleanup function to revoke object URLs
        return () => {
            imagePreviews.forEach(src => URL.revokeObjectURL(src));
        };
    }, [imagePreviews]);


    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle file input (multiple image uploads)
    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        const newImagePreviews = files.map(file => URL.createObjectURL(file));

        // Update formData with file names or URLs
        setFormData(prev => ({
            ...prev,
            photos: [...prev.photos, ...files] // Store File objects
        }));


        setImagePreviews(prev => [...prev, ...newImagePreviews]);
    };


    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedFormData = {
            ...formData,
            // photos: imageUrls, // Include the uploaded image URLs
        };

        try {
            const response = await axios.post(backendApiUrl, updatedFormData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert(response.data.message);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit data.');
        }

        const gridData = JSON.parse(localStorage.getItem("gridData")) || [];
        const newGridData = [...gridData, updatedFormData];
        localStorage.setItem("gridData", JSON.stringify(newGridData));


        // msalInstance()
        // const accessToken = await getAccessToken()
        // console.log(accessToken)
        // // Step 1: Upload images to OneDrive
        // const imageUrls = [];
        // for (const photo of formData.photos) {
        //     const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/root:/path/to/folder/${photo.name}:/content`, {
        //         method: 'PUT',
        //         headers: {
        //             Authorization: `Bearer ${accessToken}`,
        //             'Content-Type': photo.type,
        //         },
        //         body: photo, // You need to pass the actual File object here
        //     });

        //     if (response.ok) {
        //         const data = await response.json();
        //         imageUrls.push(data.webUrl); // Get the image URL from the response
        //     } else {
        //         console.error('Image upload failed:', await response.json());
        //         return; // Handle upload error
        //     }
        // }

        // // Step 2: Update Excel spreadsheet with form data
        // const updatedFormData = {
        //     ...formData,
        //     photos: imageUrls, // Include the uploaded image URLs
        // };
        // console.log(updatedFormData)
        // const excelResponse = await fetch('https://graph.microsoft.com/v1.0/me/drive/root:/path/to/your/excel.xlsx:/workbook/tables/Table1/rows/add', {
        //     method: 'POST',
        //     headers: {
        //         Authorization: `Bearer ${accessToken}`,
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         values: [[
        //             updatedFormData.item,
        //             updatedFormData.vintage,
        //             updatedFormData.size,
        //             updatedFormData.qty,
        //             updatedFormData.packaging,
        //             updatedFormData.condition,
        //             updatedFormData.label,
        //             updatedFormData.capsulesCorks,
        //             updatedFormData.tempHumidity,
        //             updatedFormData.bottleFillLevel,
        //             updatedFormData.provenance,
        //             updatedFormData.tastingNotes,
        //             updatedFormData.lwin,
        //             updatedFormData.boxId,
        //             updatedFormData.marketValue,
        //             updatedFormData.lastTrade,
        //             ...imageUrls, // Add the image URLs here
        //         ]],
        //     }),
        // });

        // if (excelResponse.ok) {
        //     const gridData = JSON.parse(localStorage.getItem("gridData")) || [];
        //     const newGridData = [...gridData, updatedFormData];
        //     localStorage.setItem("gridData", JSON.stringify(newGridData));
        //     alert('Data and images uploaded successfully!');
        // } else {
        //     console.error('Excel update failed:', await excelResponse.json());
        // }
    };
    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     const data = new FormData();
    //     data.append('name', formData.name);
    //     data.append('email', formData.email);
    //     data.append('image', "C:\Users\V B\Desktop\VATSAL BHATTI.jpg");

    //     try {
    //         const response = await axios.post('http://localhost:4000/upload', data, {
    //             headers: { 'Content-Type': 'multipart/form-data' },
    //         });
    //         alert(response.data);
    //     } catch (error) {
    //         console.error('Error submitting form:', error);
    //         alert('Failed to submit data.');
    //     }
    // };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6">Vintage Wine Form</h2>
            <form method="post" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="item"
                    placeholder="Item"
                    value={formData.item}
                    onChange={handleChange}

                    className="w-full p-2 mb-4 border rounded"
                />
                <input
                    type="text"
                    name="vintage"
                    placeholder="Vintage"
                    value={formData.vintage}
                    onChange={handleChange}

                    className="w-full p-2 mb-4 border rounded"
                />

                <select
                    name="size"
                    value={formData.size}
                    onChange={handleChange}

                    className="w-full p-2 mb-4 border rounded"
                >
                    <option value="">Size</option>
                    <option value="375ml">375ml</option>
                    <option value="750ml">750ml</option>
                    <option value="1L">1L</option>
                    <option value="1.5L">1.5L</option>
                    <option value="3L">3L</option>
                </select>

                <input
                    type="number"
                    name="qty"
                    placeholder="Qty"
                    value={formData.qty}
                    onChange={handleChange}

                    className="w-full p-2 mb-4 border rounded"
                />

                <select
                    name="packaging"
                    value={formData.packaging}
                    onChange={handleChange}

                    className="w-full p-2 mb-4 border rounded"
                >
                    <option value="">Packaging</option>
                    <option value="Individually">Individually</option>
                    <option value="Sealed Box">Sealed Box</option>
                </select>

                <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}

                    className="w-full p-2 mb-4 border rounded"
                >
                    <option value="">Condition</option>
                    <option value="Pristine">Pristine</option>
                    <option value="Good">Good</option>
                    <option value="Poor">Poor</option>
                </select>

                <input
                    type="text"
                    name="label"
                    placeholder="Label"
                    value={formData.label}
                    onChange={handleChange}

                    className="w-full p-2 mb-4 border rounded"
                />

                <select
                    name="capsulesCorks"
                    value={formData.capsulesCorks}
                    onChange={handleChange}

                    className="w-full p-2 mb-4 border rounded"
                >
                    <option value="">Capsules/Corks</option>
                    <option value="New">Pristine</option>
                    <option value="Used">Good</option>
                    <option value="Damaged">Poor</option>
                </select>

                <input
                    type="text"
                    name="tempHumidity"
                    placeholder="Temp/Humidity"
                    value={formData.tempHumidity}
                    onChange={handleChange}

                    className="w-full p-2 mb-4 border rounded"
                />

                <select
                    name="bottleFillLevel"
                    value={formData.bottleFillLevel}
                    onChange={handleChange}
                    placeholder="select bottel level"

                    className="w-full p-2 mb-4 border rounded"
                >
                    {/* <option value="">Bottle Fill Level</option> */}
                    <option value="InNeck">In Neck (IN)</option>
                    <option value="BaseNeck">Base Neck (BN)</option>
                    <option value="VeryTopShoulder">Very Top Shoulder (VTS)</option>
                    <option value="TopShoulder">Top Shoulder (TS)</option>
                    <option value="HighShoulder">High Shoulder (HS)</option>
                    <option value="MidShoulder">Mid Shoulder (MS)</option>
                    <option value="LowShoulder">Low Shoulder (LS)</option>
                </select>

                <select
                    name="provenance"
                    value={formData.provenance}
                    onChange={handleChange}

                    className="w-full p-2 mb-4 border rounded"
                >
                    <option value="">Select Provenance</option>
                    <option value="Region A">Documentation or NA(Not Available)</option>
                    <option value="Region A">Receipt</option>
                </select>

                <textarea
                    name="tastingNotes"
                    placeholder="Tasting Notes"
                    value={formData.tastingNotes}
                    onChange={handleChange}

                    className="w-full p-2 mb-4 border rounded"
                    rows="4"
                />

                <input
                    type="text"
                    name="lwin"
                    placeholder="LWIN #"
                    value={formData.lwin}
                    onChange={handleChange}

                    className="w-full p-2 mb-4 border rounded"
                />

                <input
                    type="text"
                    name="boxId"
                    placeholder="Box ID #"
                    value={formData.boxId}
                    onChange={handleChange}

                    className="w-full p-2 mb-4 border rounded"
                />

                <input
                    type="text"
                    name="marketValue"
                    placeholder="Market Value"
                    value={formData.marketValue}
                    onChange={handleChange}

                    className="w-full p-2 mb-4 border rounded"
                />

                <input
                    type="text"
                    name="lastTrade"
                    placeholder="Last Trade"
                    value={formData.lastTrade}
                    onChange={handleChange}

                    className="w-full p-2 mb-4 border rounded"
                />

                {/* Input for photo upload */}
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="w-full mb-4"
                />

                {/* Display the selected images */}
                {imagePreviews.length > 0 && (
                    <div className="mb-4">
                        <h3 className="font-semibold">Selected Images:</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {imagePreviews.map((src, index) => (
                                <img key={index} src={src} alt={`Selected ${index}`} className="w-full h-auto border rounded" />
                            ))}
                        </div>
                    </div>
                )}

                <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default Form;
