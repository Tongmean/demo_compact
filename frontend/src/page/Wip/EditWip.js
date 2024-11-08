import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hook/useAuthContext';
import { Form, Button, Spinner, Row, Col, Modal as BootstrapModal } from 'react-bootstrap';
import env from "react-dotenv";


const EditWip = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthContext();

    const [formData, setFormData] = useState({
        Code_Wip: '',
        Name_Wip: '',
        Code_Mold: '',
        Dimension: '',
        Chem_Grade: '',
        Weight_Per_Pcs: '',
        Pcs_Per_Mold: '',
        Pcs_Per_Set: '',
        Type_Brake: '',
        Type_Mold: '',
        Time_Per_Mold: '',
        Mold_Per_8_Hour: '',
        Remark: ''
    });

    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    const fetchWipData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${env.API_URL}/api/wip/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                }
            });

            const json = await response.json();

            console.log(json)
            if (response.ok) {
                const result = json.data;

                if (result.length > 0) {
                    const data = result[0];
                    setFormData({
                        Code_Wip: data.Code_Wip || '',
                        Name_Wip: data.Name_Wip || '',
                        Code_Mold: data.Code_Mold || '',
                        Dimension: data.Dimension || '',
                        Chem_Grade: data.Chem_Grade || '',
                        Weight_Per_Pcs: data.Weight_Per_Pcs || '',
                        Pcs_Per_Mold: data.Pcs_Per_Mold || '',
                        Pcs_Per_Set: data.Pcs_Per_Set || '',
                        Type_Brake: data.Type_Brake || '',
                        Type_Mold: data.Type_Mold || '',
                        Time_Per_Mold: data.Time_Per_Mold || '',
                        Mold_Per_8_Hour: data.Mold_Per_8_Hour || '',
                        Remark: data.Remark || ''
                    });
                } else {
                    setModalTitle('No Data Found');
                    setModalMessage(json.msg);
                    setModalVisible(true);
                }
            } else {
                setModalTitle('Fetch Error');
                setModalMessage(`Failed to fetch WIP data: ${json.msg}`);
                setModalVisible(true);
            }
        } catch (error) {
            setModalTitle('Fetch Error');
            setModalMessage(`Error fetching WIP data: ${error.message}`);
            setModalVisible(true);
            console.log(error.message)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWipData();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${env.API_URL}/api/wip/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify(formData)
            });

            const json = await response.json();

            if (response.ok) {
                setModalTitle('Success');
                setModalMessage(json.msg);
                setModalVisible(true);

                // Delay navigation by 2 seconds
                setTimeout(() => {
                    navigate('/wip');
                }, 1000);
            } else {
                setModalTitle('Update Error');
                setModalMessage(`Failed to update WIP: ${json.msg}`);
                setModalVisible(true);
            }
        } catch (error) {
            console.log(error.message)
            setModalTitle('Update Error');
            setModalMessage(`Error updating WIP: ${error.message}`);
            setModalVisible(true);
        } finally {
            setLoading(false);
        }
    };

    const handleOnClick = () => {
        navigate('/wip');
    };

    //static Data
    const [optionTypebrake, setOptiontypebrake]= useState([]);
    useEffect(() => {
        // Function to fetch FG options data from the server
        const fetchDatatyebrake = async () => {
            try {
                const response = await fetch(`${env.API_URL}/api/static/wip/typebrake`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user.token}`, // Adding token to the request headers
                        'Content-Type': 'application/json'
                    }
                });

                // Check if the response is okay before proceeding
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }

                // Parse the response JSON and set it in the state
                const result = await response.json();
                // console.log("API response data:", result.data);
                
                // Ensure data is an array before setting it
                if (Array.isArray(result.data)) {
                    setOptiontypebrake(result.data);
                } else {
                    console.error("Expected data to be an array, but got:", typeof result.data);
                }
            } catch (error) {
                // Log any errors encountered during the fetch
                console.error("Failed to fetch FG options:", error);
            }
        };

        // Call the fetch function after component mounts
        fetchDatatyebrake();
    }, [user.token]);
    const [optionTypemold, setOptiontypemold]= useState([]);
    useEffect(() => {
        // Function to fetch FG options data from the server
        const fetchDatatyemold = async () => {
            try {
                const response = await fetch(`${env.API_URL}/api/static/wip/typemold`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user.token}`, // Adding token to the request headers
                        'Content-Type': 'application/json'
                    }
                });

                // Check if the response is okay before proceeding
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }

                // Parse the response JSON and set it in the state
                const result = await response.json();
                // console.log("API response data:", result.data);
                
                // Ensure data is an array before setting it
                if (Array.isArray(result.data)) {
                    setOptiontypemold(result.data);
                } else {
                    console.error("Expected data to be an array, but got:", typeof result.data);
                }
            } catch (error) {
                // Log any errors encountered during the fetch
                console.error("Failed to fetch FG options:", error);
            }
        };

        // Call the fetch function after component mounts
        fetchDatatyemold();
    }, [user.token]);
    const [optionPcsperset, setOptionpcsperset]= useState([]);
    useEffect(() => {
        // Function to fetch FG options data from the server
        const fetchDatapcsperset = async () => {
            try {
                const response = await fetch(`${env.API_URL}/api/static/pcsperset`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user.token}`, // Adding token to the request headers
                        'Content-Type': 'application/json'
                    }
                });

                // Check if the response is okay before proceeding
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }

                // Parse the response JSON and set it in the state
                const result = await response.json();
                // console.log("API response data:", result.data);
                
                // Ensure data is an array before setting it
                if (Array.isArray(result.data)) {
                    setOptionpcsperset(result.data);
                } else {
                    console.error("Expected data to be an array, but got:", typeof result.data);
                }
            } catch (error) {
                // Log any errors encountered during the fetch
                console.error("Failed to fetch FG options:", error);
            }
        };

        // Call the fetch function after component mounts
        fetchDatapcsperset();
    }, [user.token]);

    return (

        <div>
            <h2>Edit WIP</h2>
            {loading ? (
                <Spinner animation="border" variant="primary" />
            ) : (
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="Code_Wip">
                                <Form.Label>Code Wip</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Code_Wip"
                                    value={formData.Code_Wip}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="Name_Wip">
                                <Form.Label>Name Wip</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Name_Wip"
                                    value={formData.Name_Wip}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="รหัสแม่พิม์">
                                <Form.Label>รหัสแม่พิม์</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Code_Mold"
                                    value={formData.Code_Mold}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="ขนาด(กว้าง*หนา-ยาว)">
                                <Form.Label>ขนาด(กว้าง*หนา-ยาว)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Dimension"
                                    value={formData.Dimension}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="เกรดเคมี">
                                <Form.Label>เกรดเคมี</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Chem_Grade"
                                    value={formData.Chem_Grade}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="น้ำหนักต่อชิ้น">
                                <Form.Label>น้ำหนักต่อชิ้น</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Weight_Per_Pcs"
                                    value={formData.Weight_Per_Pcs}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="ชิ้นต่อพิมพ์">
                                <Form.Label>ชิ้นต่อพิมพ์</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Pcs_Per_Mold"
                                    value={formData.Pcs_Per_Mold}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="ชิ้นต่อชุด">
                                <Form.Label>ชิ้นต่อชุด</Form.Label>
                                <select
                                    name="Pcs_Per_Set"
                                    value={formData.Pcs_Per_Set}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    {/* Display the selected value */}
                                    <option value={formData.Pcs_Per_Set}>{formData.Pcs_Per_Set}</option>
                                    {formData.Type_Brake !== '-' && <option value="-">-</option>}
                                    {/* Unique options array */}
                                    {optionPcsperset
                                        .map(item => item.Pcs_Per_Set)
                                        .filter(option => option !== formData.Pcs_Per_Set) // Filter out the selected value
                                        .map((option, index) => (
                                            <option key={index} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                </select>
                            </Form.Group>

                            <Form.Group controlId="ลักษณะผ้า">
                                <Form.Label>ลักษณะผ้า</Form.Label>
                                    <select
                                        name="Type_Brake"
                                        value={formData.Type_Brake}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        {/* Display the selected value */}
                                        <option value={formData.Type_Brake}>{formData.Type_Brake}</option>

                                        {/* Conditionally render '-' option based on the current value */}
                                        {formData.Type_Brake !== '-' && <option value="-">-</option>}

                                        {/* Unique options array */}
                                        {optionTypebrake
                                        .map(item => item.Type_Brake)
                                        .filter(option => option !== formData.Type_Brake) // Filter out the selected value
                                        .map((option, index) => (
                                            <option key={index} value={option}>
                                            {option}
                                            </option>
                                        ))}
                                    </select>
                                </Form.Group>

                        </Col>

                        <Col md={6}>
                            <Form.Group controlId="ลักษณะแม่พิมพ์">
                            <Form.Label>ลักษณะแม่พิมพ์</Form.Label>
                                <select
                                    name="Type_Mold"
                                    value={formData.Type_Mold}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                        {/* Display the selected value */}
                                        <option value={formData.Type_Mold}>{formData.Type_Mold}</option>

                                        {/* Conditionally render '-' option based on the current value */}
                                        {formData.Type_Mold !== '-' && <option value="-">-</option>}

                                        {/* Unique options array */}
                                        {optionTypemold
                                        .map(item => item.Type_Mold)
                                        .filter(option => option !== formData.Type_Mold) // Filter out the selected value
                                        .map((option, index) => (
                                            <option key={index} value={option}>
                                            {option}
                                            </option>
                                        ))}
                                </select>
                            </Form.Group>
 
                            {/* <Form.Group controlId="Type_Mold">
                                <Form.Label>Type Mold</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Type_Mold"
                                    value={formData.Type_Mold}
                                    onChange={handleChange}
                                />
                            </Form.Group> */}

                            <Form.Group controlId="เวลาต่อพิมพ์">
                                <Form.Label>เวลาต่อพิมพ์</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Time_Per_Mold"
                                    value={formData.Time_Per_Mold}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="พิมพ์ต่อ 8 ชัวโมง">
                                <Form.Label>พิมพ์ต่อ 8 ชัวโมง</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Mold_Per_8_Hour"
                                    value={formData.Mold_Per_8_Hour}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="Remark">
                                <Form.Label>หมายเหตุ</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="Remark"
                                    value={formData.Remark}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                
                    <Button variant="primary" type="submit"  className="mt-2" isabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'Update Wip'}
                    </Button>
                    <Button variant="secondary"  onClick={handleOnClick} className="mt-2 ms-2">
                        Cancel
                    </Button>
                </Form>
            )}
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

export default EditWip;
