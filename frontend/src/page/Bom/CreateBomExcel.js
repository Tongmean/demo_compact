import { Layout } from 'antd';
import Sidebar from '../../component/Sidebar';
import HeaderComponent from '../../component/Header';
import FooterComponent from '../../component/Footer';
import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles
import { useAuthContext } from '../../hook/useAuthContext';
import template from '../../Asset/Bom_template.xlsx';

const { Content } = Layout;

const CreateBomExcel = () => {
    const { user } = useAuthContext(); // Retrieve user context
    const [collapsed, setCollapsed] = useState(false);
    const [excelData, setExcelData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // State to manage errors
    const [successMessage, setSuccessMessage] = useState(null); // State to manage success messages
    const fileInputRef = useRef(null); // Ref for the file input field

    // Function to handle file upload and reading the data
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        // When the file is successfully read
        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });

            // Assume we're reading the first sheet
            const firstSheetName = workbook.SheetNames[0];
            let worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName], { header: 1 });

            // Process headers (first row)
            const headers = worksheet[0];
            if (headers.length !== 9) {
                console.error('Header does not have exactly 9 columns.');
                alert('Check the Excel template again!');
                return;
            }

            // Process data rows
            const dataFromSecondLine = worksheet.slice(1).map(row => {
                // Ensure each row has 9 columns
                const processedRow = row.slice(0, 9); // Truncate to 9 columns
                while (processedRow.length < 9) {
                    processedRow.push("-"); // Add "-" for missing columns
                }

                // Replace any null, empty, or undefined values with "-"
                return processedRow.map(value =>
                    value === "" || value === null || value === undefined ? "-" : value
                );
            });

            console.log('Processed Data:', dataFromSecondLine);
            setExcelData(dataFromSecondLine);
        };

        // Read the file as a binary string
        reader.readAsBinaryString(file);
    };

    // Function to send data to the backend with token authentication
    const handleSubmit = () => {
        setLoading(true);
        setError(null); // Reset error before making the request
        setSuccessMessage(null); // Reset success message before making the request

        axios.post('http://localhost:3030/api/bom/createExcel', excelData, {
            headers: {
                Authorization: `Bearer ${user.token}` // Attach the token in the Authorization header
            }
        })
        .then(response => {
            setSuccessMessage('Data saved successfully'); // Set success message
            console.log('Data saved successfully', response.data);
            setLoading(false);  // Stop loading when data is successfully saved

            // Clear the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        })
        .catch(error => {
            console.log('Error saving data', error);
            setError('An error occurred while saving the data.'); // Set error message
            setLoading(false);
        });
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
            <Layout>
                <HeaderComponent />
                <Content
                    style={{
                        margin: '24px 16px 0',
                        padding: '24px',
                        background: '#ffffff',
                        borderRadius: '4px',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <div className="App">
                        <div className='container-fluid'>
                            <div className='row pe-5'>
                                <div class="card">
                                    <div class="card-header">
                                        Note
                                    </div>
                                    <div class="card-body">
                                        <blockquote class="blockquote mb-0">
                                        <p>Code_Fg, Name_Fg, Code_Dr, Name_Dr, Code_Wip, Name_Wip, Ra_Wip, Ra_L, Remark</p>
                                        <footer class="blockquote-footer">ต้องเรียงข้อมูลแต่ละ Column ตามนี้เท่านั้น</footer>
                                        </blockquote>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='row col-xl-4 col-lg-4 col-md-6'>
                                    Excel Template
                                    <div>
                                        <a href={template} download="Bom_template.xlsx" className="btn btn-secondary ">Download Excel Template</a>
                                    </div>
                                </div>
                                <div className='row col-xl-8 col-lg-8 col-md-6'>
                                    <label htmlFor="formFile" className="form-label">Default file input example</label>
                                    <input
                                        type="file"
                                        accept=".xlsx, .xls"
                                        onChange={handleFileUpload}
                                        className='form-control'
                                        ref={fileInputRef} // Attach ref to file input
                                    />
                                    <button onClick={handleSubmit} disabled={loading} className='btn btn-primary mt-2'>
                                        {loading ? 'Uploading...' : 'Upload and Save Data'}
                                    </button>
                                </div>
                            </div>
                        </div>
                        {loading && <div className="loading">Loading...</div>}
                    </div>

                    {/* Bootstrap Modal for Error Handling */}
                    {error && (
                        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Error</h5>
                                        <button type="button" className="close" onClick={() => setError(null)}>
                                            <span>&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <p>{error}</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setError(null)}>Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bootstrap Modal for Success Notification */}
                    {successMessage && (
                        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Success</h5>
                                      
                                    </div>
                                    <div className="modal-body">
                                        <p>{successMessage}</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setSuccessMessage(null)}>Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Content>
                <FooterComponent />
            </Layout>
        </Layout>
    );
};

export default CreateBomExcel;
