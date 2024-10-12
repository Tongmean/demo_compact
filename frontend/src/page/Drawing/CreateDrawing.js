import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import axios from 'axios';
import { Modal } from 'react-bootstrap'; // Import Modal from react-bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuthContext } from '../../hook/useAuthContext';
import env from "react-dotenv";
import { useNavigate } from 'react-router-dom';

const CreateDrawing = () => {
    // State to hold the part number and files
    
    const { user } = useAuthContext();
    const [Part_No, setPart_No] = useState('');
    const [files, setFiles] = useState([]);
    const [isPending, setIsPending] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    // Handle part number input change
    const handlePartNoChange = (e) => {
        setPart_No(e.target.value);
    };

    // Handle file input change
    const handleFileChange = (e) => {
        // Limit file uploads to a maximum of 4 files
        if (e.target.files.length > 4) {
            alert("You can upload a maximum of 4 files.");
            return;
        }
        setFiles(Array.from(e.target.files)); // Convert FileList to array
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setIsPending(true); // Set loading state

        // Create a FormData object to hold the part number and files
        const formData = new FormData();

        formData.append('Part_No', Part_No); // Add part number input

        files.forEach((file) => {
            formData.append('file', file); // Append each file to FormData
        });

        // Debugging FormData - log each key-value pair
        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key}:`, value);
        // }
        
        console.log('formData',formData)

        try {
            // Make a POST request to the server with the form data
            const response = await axios.post(`${env.API_URL}/api/drawing/create`, formData, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data' // Specify the content type
                }
            });
            setModalContent(response.data.msg || 'Files uploaded successfully!'); // Get message from response
            setShowModal(true);
            setTimeout(() => navigate('/drawing'), 1500);


        } catch (error) {
            console.error('Error uploading files:', error); // Handle errors
            setModalContent('Error uploading files, please try again.');
            setShowModal(true);
        } finally {
            setIsPending(false); // Reset loading state
        }
    };

    const handleCloseModal = () => setShowModal(false);
    const handleOnClick = () => {
        navigate('/drawing');
    };
    return (
        <div>
            <h2>Create New Drawing</h2>
            <Form onSubmitCapture={handleSubmit} layout="vertical">
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-xl-6 col-lg-6 col-md-12'>
                            <Form.Item label="Part No">
                                <Input
                                    type="text"
                                    required
                                    value={Part_No}
                                    onChange={handlePartNoChange}
                                    style={{ width: '100%' }} // Ensure input takes full width
                                />
                            </Form.Item>
                        </div>
                        <div className='col-xl-6 col-lg-6 col-md-12'>
                            <Form.Item label="Upload Files (Max 4)">
                                <Input
                                    type="file"
                                    onChange={handleFileChange}
                                    multiple
                                    required
                                    style={{ width: '100%' }} // Ensure input takes full width
                                    accept='.pdf'
                                />
                            </Form.Item>
                        </div>
                        <div className='col-12'>
                            <Form.Item>
                                <Button className='btn-secondary' variant="primary" onClick={handleOnClick}>
                                    Back
                                </Button>
                                <Button type="primary" htmlType="submit" disabled={isPending}>
                                    {isPending ? 'Uploading...' : 'Upload'}
                                </Button>
                            </Form.Item>
                        </div>
                    </div>
                </div>
            </Form>

            {/* Modal for showing success/error messages */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Message</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalContent}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CreateDrawing;
