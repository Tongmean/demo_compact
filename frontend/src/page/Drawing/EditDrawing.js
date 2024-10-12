import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hook/useAuthContext';
import { Form, Button, Spinner, Row, Col, Modal as BootstrapModal } from 'react-bootstrap';
import env from "react-dotenv";

const EditDrawing = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthContext();

    const [formData, setFormData] = useState({
        Part_No: '',
        drawingFile: null,
    });

    const [currentFileName, setCurrentFileName] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    const fetchDrawingData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${env.API_URL}/api/drawing/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                }
            });

            const json = await response.json();
            if (response.ok) {
                const data = json.data[0]; // Get the first item directly
                if (data) {
                    setFormData({
                        Part_No: data.Part_No || '',
                        drawingFile: null, // Reset the file input
                    });
                    setCurrentFileName(data.filename || ''); // Use appropriate property
                } else {
                    showModal('No Data Found', json.msg);
                }
            } else {
                showModal('Fetch Error', `Failed to fetch Drawing data: ${json.msg}`);
            }
        } catch (error) {
            showModal('Fetch Error', `Error fetching Drawing data: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const showModal = (title, message) => {
        setModalTitle(title);
        setModalMessage(message);
        setModalVisible(true);
    };

    useEffect(() => {
        fetchDrawingData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'drawingFile') {
            setFormData(prevState => ({
                ...prevState,
                drawingFile: files[0], // handle file input
            }));
            setCurrentFileName(files[0]?.name || ''); // Update current file name on change
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log('formData',formData)

        const data = new FormData();
        data.append('Part_No', formData.Part_No);
        if (formData.drawingFile) {
            data.append('file', formData.drawingFile);
        }

        try {
            const response = await fetch(`${env.API_URL}/api/drawing/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
                body: data,
            });

            const json = await response.json();

            if (response.ok) {
                showModal('Success', json.msg);
                setTimeout(() => navigate('/drawing'), 1500);
            } else {
                throw new Error(json.msg || `HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            showModal('Update Error', `Error updating Drawing: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleOnClick = () => {
        navigate('/drawing');
    };

    return (
        <div>
            <h2>Edit Drawing</h2>
            {loading ? (
                <Spinner animation="border" variant="primary" />
            ) : (
                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="Part_No">
                                <Form.Label>Part No</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Part_No"
                                    value={formData.Part_No}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="drawingFile">
                                <Form.Label>Drawing File</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="drawingFile"
                                    onChange={handleChange}
                                />
                                {currentFileName && (
                                    <div className="mt-2">
                                        <strong>Current File:</strong> {currentFileName}
                                    </div>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className='mt-2'>
                        <Button className='btn-secondary' variant="primary" onClick={handleOnClick}>
                            Back
                        </Button>
                        <Button className='ms-2' variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Update'}
                        </Button>
                    </div>
                </Form>
            )}

            {/* Bootstrap Modal for messages */}
            <BootstrapModal show={modalVisible} onHide={() => setModalVisible(false)}>
                <BootstrapModal.Header closeButton>
                    <BootstrapModal.Title>{modalTitle}</BootstrapModal.Title>
                </BootstrapModal.Header>
                <BootstrapModal.Body>{modalMessage}</BootstrapModal.Body>
                <BootstrapModal.Footer>
                    <Button variant="secondary" onClick={() => setModalVisible(false)}>
                        Close
                    </Button>
                </BootstrapModal.Footer>
            </BootstrapModal>
        </div>
    );
};

export default EditDrawing;
