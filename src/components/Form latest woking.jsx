import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { nanoid } from 'nanoid'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Form = ({ globalFormData }) => {
    const [isEdit, setIsEdit] = useState(false)


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
        gDrivePhotos: []
    });

    const [imagePreviews, setImagePreviews] = useState([]);
    const [uploadedUrls, setUploadedUrls] = useState([]);  // Stores Cloudinary URLs
    const [gDriveUploadedUrls, setGDriveUploadedUrls] = useState([]) // Stores Gdrive URLs
    const [isUploading, setIsUploading] = useState(false); // Track upload process
    const [isSubmitEnabled, setIsSubmitEnabled] = useState(false); // Track submit button state
    const [editTimePhotos, setEditTimePhotos] = useState([])
    const [editTimeGDrivePhotos, setEditTimeGDrivePhotos] = useState([])

    useEffect(() => {
        if (globalFormData && Object.keys(globalFormData).length > 0) {
            if (globalFormData?.photos?.length > 0) setIsSubmitEnabled(true)
            setEditTimePhotos([...globalFormData.photos])
            setEditTimeGDrivePhotos([...globalFormData.gDrivePhotos])
            setImagePreviews(globalFormData.photos)
            setFormData({ ...globalFormData, photos: [] })

            setIsEdit(true)
        }
    }, [globalFormData])

    const gsheetApiUrl = process.env.REACT_APP_GSHEET_API_URL;
    const dataBaseApiUrl = process.env.REACT_APP_GSHEET_API_URL;
    const backendApiUrl = process.env.REACT_APP_GSHEET_API_URL;
    console.log(gsheetApiUrl)
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
        console.log("image files are here")
        console.log(formData.photos)
        console.log(files)
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
            console.log("ahi jo")
            console.log(formData)
            setIsUploading(true);
            const urls = [];
            const gDriveUrls = []
            for (const photo of formData.photos) {
                const formDataToUpload = new FormData();
                formDataToUpload.append('image', photo); // Append each image to the FormData

                // const response = await axios.post("https://wineapp-backend.onrender.com/upload", formDataToUpload, {
                //     headers: { 'Content-Type': 'multipart/form-data' },
                // });
                const response = await axios.post("http://localhost:4000/upload", formDataToUpload, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                if (response.data.urls) {
                    urls.push(response.data.urls.cloudinaryURL);  // Store Cloudinary URL

                    console.log(response.data.urls.gDriveURL)
                    gDriveUrls.push(response.data.urls.gDriveURL);
                }
            }

            if (urls.length > 0 && gDriveUrls.length > 0) {
                setUploadedUrls(urls); // Save Cloudinary URLs
                setGDriveUploadedUrls(gDriveUrls); // Save Gdrive URLs
                setIsSubmitEnabled(true); // Enable the submit button
                toast.success('Images uploaded successfully!');
            } else {
                toast.error('Failed to upload images.');
            }
        } catch (error) {
            console.error('Error uploading images:', error);
            toast.error('Error uploading images.');
        } finally {
            setIsUploading(false); // Reset upload state
        }
    };


    async function test() {
        console.log("test triggred")

        const newForm = document.forms["wineForm"];
        const urlArray = [...uploadedUrls]
        const gDriveUrlArray = [...gDriveUploadedUrls]
        console.log("zara yaha pe")
        console.log(gDriveUrlArray)
        const stringphotosUrls = urlArray.join(', ');
        const stringDrivePhotosUrls = gDriveUrlArray.join(', ');
        console.log("idhar bhai idhar")
        console.log(stringDrivePhotosUrls)
        const tempFormData = new FormData(newForm);
        tempFormData.append("photos", stringphotosUrls)
        tempFormData.append("gDrivePhotos", stringDrivePhotosUrls)


        // Print the contents of tempFormData
        tempFormData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });

        fetch(gsheetApiUrl, { method: "POST", body: tempFormData })
            .then((response) => {
                console.log("trrigerd from here")
                console.log(response)
                toast.success("posted to excel")
            })
            .catch((error) => toast.error("failed to post at excel"));


    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const uniqueID = nanoid()
        console.log("id is here ")
        console.log(uniqueID)
        const updatedFormData = {
            ...formData,
            photos: editTimePhotos?.length > 0 ? [...editTimePhotos, ...uploadedUrls] : uploadedUrls, // Use Cloudinary URLs
            gDrivePhotos: editTimeGDrivePhotos?.length > 0 ? [...editTimeGDrivePhotos, ...gDriveUploadedUrls] : gDriveUploadedUrls,
        };
        console.log("Form data with Cloudinary URLs:", updatedFormData);
        await test()
        try {


            const stringForm = JSON.stringify(updatedFormData)
            console.log("string form")
            console.log(stringForm)
            console.log("isediting")

            console.log(formData.id)

            await fetch("https://103.27.120.198/provioWS/webservice/Charts.asmx/GrapebottleData", {
                headers: {
                    "Content-Type": "application/json" // Fixed the capitalization
                },

                method: "POST",
                body: JSON.stringify({ // Convert the body to a JSON string
                    Mode: isEdit ? "Update" : "Insert",
                    id: isEdit ? `${formData.id}` : uniqueID,
                    itemData: stringForm
                })
            }).then(res => {
                return res.json(); // Ensure the promise is returned
            }).then(newres => { // Added another then to handle the resolved promise
                console.log(newres);
                toast.success('Form submitted successfully!');
            }).catch(e => {
                console.log(e.message)
                toast.error("data base error")
            });



            // Save the updated data to localStorage (or make additional API calls as needed)
            const gridData = JSON.parse(localStorage.getItem("gridData")) || [];
            const newGridData = [...gridData, { ...updatedFormData, id: uniqueID }];
            localStorage.setItem("gridData", JSON.stringify(newGridData));


        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to submit data.');
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


                <select
                    name="label"
                    value={formData.label}
                    onChange={handleChange}

                    className="w-full p-2 mb-4 border rounded"
                >
                    <option value="">Label</option>
                    <option value="Pristine">Pristine</option>
                    <option value="Good">Good</option>
                    <option value="Poor">Poor</option>
                </select>

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
                    <option value="">Bottle Fill Level</option>
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
            <ToastContainer />
        </div>
    );
};

export default Form;
