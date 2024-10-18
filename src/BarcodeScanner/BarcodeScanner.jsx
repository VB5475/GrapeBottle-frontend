// BarcodeScanner.js
import React, { useState } from 'react';
import QrReader from 'react-qr-barcode-scanner';
const BarcodeScanner = ({ onScan }) => {
    const [isScanning, setIsScanning] = useState(false);

    const handleScan = (result) => {
        if (result) {
            onScan(result.text); // Pass the scanned value to the parent component
            setIsScanning(false); // Stop scanning after a successful read
        }
    };

    const handleError = (error) => {
        console.error(error);
    };

    return (
        <div>
            {isScanning ? (
                <QrReader
                    onError={handleError}
                    onScan={handleScan}
                    style={{ width: '100%' }}
                />
            ) : (
                <button type="button" onClick={() => setIsScanning(true)}>
                    Start Scanning
                </button>
            )}
        </div>
    );
};

export default BarcodeScanner;
