import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { nanoid } from 'nanoid'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import BarcodeScanner from '../BarcodeScanner/BarcodeScanner';
import BarcodeScanner from '../BarcodeScanner/BarcodeScanner2';
import logo from "../../public/grapebottle.gif"


const myUniqueID = nanoid()

const defaulFormData = {
    uniqueID: myUniqueID,
    id: myUniqueID,
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
    gDrivePhotos: [],
    barcode: '',
    currentMarketPrice: "",
    verified: false
}


const Form = ({ globalFormData, setActiveTab, gridData, setGridData }) => {
    const [isEdit, setIsEdit] = useState(false)
    const [isScanning, setIsScanning] = useState(false);

    const [formData, setFormData] = useState(defaulFormData);

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
            console.log("globalFormData:", globalFormData)
            setEditTimePhotos([...globalFormData.photos])
            setEditTimeGDrivePhotos([...globalFormData.gphotos])
            setImagePreviews(globalFormData.photos)
            setFormData({ ...globalFormData, photos: [], action: "edit" })

            setIsEdit(true)
        }
    }, [globalFormData])

    const gsheetApiUrl = process.env.REACT_APP_GSHEET_API_URL;
    const dataBaseApiUrl = process.env.REACT_APP_GSHEET_API_URL;
    const backendApiUrl = process.env.REACT_APP_GSHEET_API_URL;
    console.log(gsheetApiUrl)
    useEffect(() => {
        console.log("formdata is here ")
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

    // barcode scan handler
    const handleBarcodeScan = (barcode) => {
        setFormData((prev) => ({ ...prev, barcode: barcode })); // Update the form data with the scanned barcode
    };
    const handleBarcodeChange = (e) => {
        setFormData((prev) => ({ ...prev, barcode: e.target.value })); // Allow user to edit the barcode
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

                const response = await axios.post("https://grapebottle-backend.onrender.com/upload", formDataToUpload, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                // const response = await axios.post("http://localhost:4000/upload", formDataToUpload, {
                //     headers: { 'Content-Type': 'multipart/form-data' },
                // });

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
    function jsonToCsv(jsonArray) {
        if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
            return ''; // Return an empty string for invalid or empty input
        }

        // Extract the headers from the keys of the first object
        const headers = Object.keys(jsonArray[0]);

        // Create the CSV string for the headers
        const csvHeaders = headers.join(',');

        // Map the JSON array to CSV rows
        const csvRows = jsonArray.map(obj => {
            return headers.map(header => {
                const key = header.trim().toLowerCase().replace(/\s+/g, ''); // Match header normalization in the parser
                let value = obj[key];

                // Handle 'photos' or 'gphotos' fields by joining the array into a comma-separated string
                if (Array.isArray(value)) {
                    value = value.map(url => url.trim()).join(',');
                }

                // Wrap values in quotes if they contain commas, quotes, or newlines
                if (typeof value === 'string' && /[",\n]/.test(value)) {
                    value = `"${value.replace(/"/g, '""')}"`; // Escape double quotes by doubling them
                }

                return value ?? ''; // Ensure null or undefined values are converted to empty strings
            }).join(',');
        });

        // Combine the headers and rows into the final CSV string
        return [csvHeaders, ...csvRows].join('\n');
    }


    const poster = async (csvValue) => {
        const link = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTDrsVCl3ZV5w5AevqJd_BaCz-ud8fUcX9-cCa7d-62fgIn1lMr_tocviRE2SAsb8UtOECmdwH2xAWD/pub?gid=0&single=true&output=csv";

        if (!link) {
            console.error("Environment variable REACT_APP_GSHEET_PUBLISH_URL is not set.");
            return;
        }

        console.log("Fetching data from:", link);

        try {
            const response = await fetch(link, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(csvValue)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const rawData = await response;
            console.log("rawData:", rawData)
            // const jsonData = csvToJson(rawData)
            // console.log("Fetched data:", jsonData);
            // setGridData(jsonData)

            // Handle the parsed data here, e.g., setState(rawData);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };


    async function test() {
        console.log("test triggred")

        const newForm = document.forms["wineForm"];
        const urlArray = editTimePhotos?.length > 0 ? [...editTimePhotos, ...uploadedUrls] : [...uploadedUrls]
        const gDriveUrlArray = editTimeGDrivePhotos?.length > 0 ? [...editTimeGDrivePhotos, ...gDriveUploadedUrls] : [...gDriveUploadedUrls]
        console.log("zara yaha pe")
        console.log(gDriveUrlArray)
        const stringphotosUrls = urlArray.join(', ');
        const stringDrivePhotosUrls = gDriveUrlArray.join(', ');
        console.log("idhar bhai idhar")
        console.log(stringDrivePhotosUrls)
        const tempFormData = new FormData(newForm);
        tempFormData.append("photos", stringphotosUrls)
        tempFormData.append("gDrivePhotos", stringDrivePhotosUrls)
        tempFormData.append("action", isEdit ? "edit" : "add")
        tempFormData.append("uniqueID", formData.uniqueID)




        // Print the contents of tempFormData
        tempFormData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });

        fetch("https://script.google.com/macros/s/AKfycbzxtco7C36mXnJ5vhb0-YBviC6guoJY4X5NjcsTZv6G9pwUrQszLw3r5CF2l0Amwt4/exec", { method: "POST", body: tempFormData })
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
        // const uniqueID = nanoid()
        // console.log("id is here ")
        // console.log(uniqueID)
        const updatedFormData = {
            ...formData,
            // action: isEdit ? "edit" : "add",
            photos: editTimePhotos?.length > 0 ? [...editTimePhotos, ...uploadedUrls] : uploadedUrls, // Use Cloudinary URLs
            gphotos: editTimeGDrivePhotos?.length > 0 ? [...editTimeGDrivePhotos, ...gDriveUploadedUrls] : gDriveUploadedUrls,
        };
        console.log("Form data with Cloudinary URLs:", updatedFormData);

        try {

            if (!isEdit) {
                await test()
            }
            else {
                console.log('updatedFormData:', updatedFormData)

                if (gridData?.length > 0) {
                    const newGridData = gridData.map((data) => {
                        if (data.uniqueid === updatedFormData.uniqueid) {
                            return updatedFormData
                        }
                        else {
                            return data
                        }
                    })


                    const csvGridData = jsonToCsv(newGridData)

                    await poster(csvGridData)

                }





            }



            // // Save the updated data to localStorage (or make additional API calls as needed)
            // const gridData = JSON.parse(localStorage.getItem("gridData")) || [];
            // const newGridData = [...gridData, { ...updatedFormData, id: uniqueID }];
            // localStorage.setItem("gridData", JSON.stringify(newGridData));


        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to submit data.');
        }

        // setActiveTab("grid")
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-gray-50 rounded-lg shadow-lg ">
            <div className='flex gap-x-1 justify-center items-center -mt-3 '>
                <img src={logo} alt="main logo" className='h-14   ' />
                <h2 className="text-2xl font-bold text-center mt-2 mb-4">GrapeBottle   </h2>

            </div>

            <form name='wineForm' onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="item"
                    placeholder="Item"
                    value={formData.item}
                    onChange={handleChange}
                    readOnly={isEdit}
                    className={`w-full p-2 mb-4 border rounded ${isEdit ? "bg-blue-100" : ""}`}
                />
                <input
                    type="text"
                    name="vintage"
                    placeholder="Vintage"
                    value={formData.vintage}
                    onChange={handleChange}
                    readOnly={isEdit}
                    className={`w-full p-2 mb-4 border rounded ${isEdit ? "bg-blue-100" : ""}`}
                />
                <select
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    disabled={isEdit}
                    className={`w-full p-2 mb-4 border rounded ${isEdit ? "bg-blue-100" : ""}`}
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
                    readOnly={isEdit}
                    className={`w-full p-2 mb-4 border rounded ${isEdit ? "bg-blue-100" : ""}`}
                />
                <select
                    name="packaging"
                    value={formData.packaging}
                    onChange={handleChange}
                    disabled={isEdit}
                    className={`w-full p-2 mb-4 border rounded ${isEdit ? "bg-blue-100" : ""}`}
                >
                    <option value="">Packaging</option>
                    <option value="Individually">Individually</option>
                    <option value="Sealed Box">Sealed Box</option>
                </select>
                <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    disabled={isEdit}
                    className={`w-full p-2 mb-4 border rounded ${isEdit ? "bg-blue-100" : ""}`}
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
                    disabled={isEdit}
                    className={`w-full p-2 mb-4 border rounded ${isEdit ? "bg-blue-100" : ""}`}
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
                    disabled={isEdit}
                    className={`w-full p-2 mb-4 border rounded ${isEdit ? "bg-blue-100" : ""}`}
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
                    readOnly={isEdit}
                    className={`w-full p-2 mb-4 border rounded ${isEdit ? "bg-blue-100" : ""}`}
                />
                <input
                    type="text"
                    name="currentMarketPrice"
                    placeholder="Current Market Price"
                    value={formData.currentMarketPrice}
                    onChange={handleChange}
                    className="w-full p-2 mb-4 border rounded"
                />
                <select
                    name="bottleFillLevel"
                    value={formData.bottleFillLevel}
                    onChange={handleChange}
                    disabled={isEdit}
                    className={`w-full p-2 mb-4 border rounded ${isEdit ? "bg-blue-100" : ""}`}
                >
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
                    disabled={isEdit}
                    className={`w-full p-2 mb-4 border rounded ${isEdit ? "bg-blue-100" : ""}`}
                >
                    <option value="">Select Provenance</option>
                    <option value="Documentation">Documentation or NA (Not Available)</option>
                    <option value="Receipt">Receipt</option>
                </select>
                <textarea
                    name="tastingNotes"
                    placeholder="Tasting Notes"
                    value={formData.tastingNotes}
                    onChange={handleChange}
                    readOnly={isEdit}
                    className={`w-full p-2 mb-4 border rounded ${isEdit ? "bg-blue-100" : ""}`}
                    rows="4"
                />
                <input
                    type="text"
                    name="lwin"
                    placeholder="LWIN #"
                    value={formData.lwin}
                    onChange={handleChange}
                    readOnly={isEdit}
                    className={`w-full p-2 mb-4 border rounded ${isEdit ? "bg-blue-100" : ""}`}
                />
                <input
                    type="text"
                    name="boxId"
                    placeholder="Box ID #"
                    value={formData.boxId}
                    onChange={handleChange}
                    readOnly={isEdit}
                    className={`w-full p-2 mb-4 border rounded ${isEdit ? "bg-blue-100" : ""}`}
                />
                <input
                    type="text"
                    name="marketValue"
                    placeholder="Market Value"
                    value={formData.marketValue}
                    onChange={handleChange}
                    readOnly={isEdit}
                    className={`w-full p-2 mb-4 border rounded ${isEdit ? "bg-blue-100" : ""}`}
                />
                <input
                    type="text"
                    name="lastTrade"
                    placeholder="Last Trade"
                    value={formData.lastTrade}
                    onChange={handleChange}
                    readOnly={isEdit}
                    className={`w-full p-2 mb-4 border rounded ${isEdit ? "bg-blue-100" : ""}`}
                />
                <div className="mb-0">
                    <input
                        type="text"
                        name="barcode"
                        placeholder='Barcode'
                        value={formData.barcode}
                        onChange={handleBarcodeChange}
                        readOnly={isEdit}
                        className={`w-full p-2 mb-4 border rounded ${isEdit ? "bg-blue-100" : ""}`}
                    />
                </div>
                {!isEdit && <BarcodeScanner onScan={handleBarcodeScan} />}
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={isEdit}
                    className="w-full mb-4"
                />
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
                {!isEdit && <button
                    type="button"
                    onClick={handleUploadImages}
                    disabled={isUploading || formData.photos.length === 0}
                    className={`w-full p-2 mb-4 ${isUploading ? 'bg-gray-400' : 'bg-green-600'} text-white rounded hover:bg-green-700`}
                >
                    {isUploading ? 'Uploading...' : 'Upload Images'}
                </button>}
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
