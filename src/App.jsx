import React, { useState } from 'react';

import Grid from './components/Grid'; // Import your grid component
import Form from './components/Form';
import Form2 from './components/Form2';
import "./App.css"
// import Form from './components/Form';

const App = () => {
    const [activeTab, setActiveTab] = useState('grid');
    const [globalFormData, setGlobalFormData] = useState({})

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (<>


        <div className="w-full max-w-md mx-auto mt-10 bg-white rounded-lg shadow-lg ">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 gap-2 ">
                <button
                    onClick={() => handleTabChange('form')}
                    className={`flex-1 text-center py-2 rounded-lg transition-all ${activeTab === 'form' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                        }`}
                >
                    Form
                </button>
                <button
                    onClick={() => handleTabChange('grid')}
                    className={`flex-1 text-center py-2 rounded-lg transition-all ${activeTab === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                        }`}
                >
                    Grid
                </button>

            </div>

            <div className="p-4">
                {activeTab === 'form' ? (
                    <Form globalFormData={globalFormData} />
                ) : (
                    <Grid setActiveTab={setActiveTab} setGlobalFormData={setGlobalFormData} />
                )}
            </div>
        </div >

    </>
    );
};

export default App;
