import React, { useState, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

const BarcodeScanner = ({ onScan }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState('');
    const videoRef = useRef(null);
    const codeReader = useRef(new BrowserMultiFormatReader());
    const modalRef = useRef(null); // Ref for the modal content

    const startScanning = async () => {
        setIsScanning(true);
        setError(''); // Clear previous errors

        // Request camera permission
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;

            codeReader.current.decodeFromVideoDevice(undefined, videoRef.current, (result, err) => {
                if (result) {
                    onScan(result.getText());
                    stopScanning(); // Stop scanning after a successful read
                }
                if (err && !(err instanceof Error)) {
                    setError(err); // Capture the error message
                }
            });
        } catch (e) {
            console.error('Permission denied or error accessing the camera:', e);
            setError('Error starting the scanner. Please check permissions.');
            setIsScanning(false); // Stop scanning if there is an error
        }
    };

    const stopScanning = () => {
        setIsScanning(false);
        codeReader.current.reset(); // Reset the scanner
    };

    const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            stopScanning(); // Close modal if click is outside of modal content
        }
    };

    return (
        <div>
            <div className="flex justify-center mb-4">
                <button
                    type="button"
                    onClick={() => {
                        if (isScanning) {
                            stopScanning();
                        } else {
                            startScanning();
                        }
                    }}
                    className={`px-4 py-2 font-semibold text-white rounded-lg transition-colors ${isScanning ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {isScanning ? 'Stop Scanning' : 'Scan Barcode'}
                </button>
            </div>
            {error && <p className="text-red-500">{error}</p>}

            {/* Modal */}
            {isScanning && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    onClick={handleClickOutside} // Detect clicks outside the modal
                >
                    <div ref={modalRef} className="bg-white p-4 rounded-lg shadow-lg relative">
                        <button
                            onClick={stopScanning}
                            className="absolute top-2 right-2 text-black font-bold"
                        >
                            X
                        </button>
                        <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default BarcodeScanner;
