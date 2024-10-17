import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { nanoid } from 'nanoid'

const Form = () => {
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
        photos: [],  // File objects
    });

    const [imagePreviews, setImagePreviews] = useState([]);
    const [uploadedUrls, setUploadedUrls] = useState([]);  // Stores Cloudinary URLs
    const [isUploading, setIsUploading] = useState(false); // Track upload process
    const [isSubmitEnabled, setIsSubmitEnabled] = useState(false); // Track submit button state

    useEffect(() => {
        console.log(formData);
    }, [formData]);

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

        setFormData(prev => ({
            ...prev,
            photos: [...prev.photos, ...files]  // Store File objects
        }));

        setImagePreviews(prev => [...prev, ...newImagePreviews]);
    };

    // Handle image upload to the backend
    const handleUploadImages = async () => {
        try {
            setIsUploading(true);
            const urls = [];
            for (const photo of formData.photos) {
                const formDataToUpload = new FormData();
                formDataToUpload.append('image', photo); // Append each image to the FormData

                const response = await axios.post(, formDataToUpload, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                if (response.data.url) {
                    urls.push(response.data.url);  // Store Cloudinary URL
                }
            }

            if (urls.length > 0) {
                setUploadedUrls(urls); // Save Cloudinary URLs
                setIsSubmitEnabled(true); // Enable the submit button
                alert('Images uploaded successfully!');
            } else {
                alert('Failed to upload images.');
            }
        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Error uploading images.');
        } finally {
            setIsUploading(false); // Reset upload state
        }
    };


    async function test() {

        const scriptURL =
            "https://script.google.com/macros/s/AKfycbyMVtw_WHRPwodiABbCMe4EUZiZu-fN-XXpFDolHVFkvh6PyG3gIHOvjnNHauxw86zx/exec";
        const newForm = document.forms["wineForm"];
        const urlArray = [...uploadedUrls]
        const stringphotosUrls = urlArray.join(', ');

        const tempFormData = new FormData(newForm);
        tempFormData.append("photos", stringphotosUrls)


        newForm.addEventListener("submit", (event) => {
            event.preventDefault(); // Prevent the default form submission

            fetch(scriptURL, { method: "POST", body: tempFormData })
                .then((response) => {
                    console.log(response)
                    alert("Thanks for Contacting us..! We Will Contact You Soon...")
                })
                .catch((error) => console.error("Error!", error.message));
        });
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Prepare the updated form data
            const updatedFormData = {
                ...formData,
                photos: uploadedUrls, // Use Cloudinary URLs
            };

            // You can now use `updatedFormData` to save data to your localStorage or backend
            console.log("Form data with Cloudinary URLs:", updatedFormData);
            await test()




            // Save the updated data to localStorage (or make additional API calls as needed)
            const gridData = JSON.parse(localStorage.getItem("gridData")) || [];
            const newGridData = [...gridData, updatedFormData];
            localStorage.setItem("gridData", JSON.stringify(newGridData));

            alert('Form submitted successfully!');
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit data.');
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6">Vintage Wine Form</h2>
            <form name='wineForm' onSubmit={handleSubmit}>
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
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="w-full mb-4" />

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

                {/* Upload Images Button */}
                <button
                    type="button"
                    onClick={handleUploadImages}
                    disabled={isUploading || formData.photos.length === 0}
                    className={`w-full p-2 mb-4 ${isUploading ? 'bg-gray-400' : 'bg-green-600'} text-white rounded hover:bg-green-700`}
                >
                    {isUploading ? 'Uploading...' : 'Upload Images'}
                </button>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={!isSubmitEnabled}
                    className={`w-full p-2 ${isSubmitEnabled ? 'bg-blue-600' : 'bg-gray-400'} text-white rounded hover:bg-blue-700`}
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Form;
