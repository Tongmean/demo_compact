import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hook/useAuthContext';
import { Form, Button, Spinner, Row, Col, Modal as BootstrapModal } from 'react-bootstrap';
import env from "react-dotenv";


const EditDr = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthContext();

    const [formData, setFormData] = useState({
        Code_Dr: '',
        Name_Dr: '',
        Name_Wip: '',
        Name_Fg_1: '',
        Demension: '',
        Type_Brake: '',
        Chem_Grade: '',
        Status_Dr: '',
        No_Grind: '',
        Num_Hole: '',
        No_Jig_Drill: '',
        No_Drill: '',
        No_Reamer: '',
        Code: '',
        Remark: '',
        Color: '',
        Color_Spray: '',
        Grind_Back: '',
        Grind_Front: '',
        Grind_Detail: '',
        Drill: '',
        Baat: '',
        Ji_Hou: '',
        Fon_Hou: '',
        Tha_Khob: '',
        Cut: '',
        Form: '',
    });

    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    const fetchDrData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${env.API_URL}/api/dr/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                }
            });

            const json = await response.json();
            if (response.ok) {
                const result = json.data;

                if (result.length > 0) {
                    const data = result[0];
                    setFormData({
                        Code_Dr: data.Code_Dr || '',
                        Name_Dr: data.Name_Dr || '',
                        Name_Wip: data.Name_Wip || '',
                        Name_Fg_1: data.Name_Fg_1 || '',
                        Demension: data.Demension || '',
                        Type_Brake: data.Type_Brake || '',
                        Chem_Grade: data.Chem_Grade || '',
                        Status_Dr: data.Status_Dr || '',
                        No_Grind: data.No_Grind || '',
                        Num_Hole: data.Num_Hole || '',
                        No_Jig_Drill: data.No_Jig_Drill || '',
                        No_Drill: data.No_Drill || '',
                        No_Reamer: data.No_Reamer || '',
                        Code: data.Code || '',
                        Remark: data.Remark || '',
                        Color: data.Color || '',
                        Color_Spray: data.Color_Spray || '',
                        Grind_Back: data.Grind_Back || '',
                        Grind_Front: data.Grind_Front || '',
                        Grind_Detail: data.Grind_Detail || '',
                        Drill: data.Drill || '',
                        Baat: data.Baat || '',
                        Ji_Hou: data.Ji_Hou || '',
                        Fon_Hou: data.Fon_Hou || '',
                        Tha_Khob: data.Tha_Khob || '',
                        Cut: data.Cut || '',
                        Form: data.Form || '',
                    });
                } else {
                    setModalTitle('No Data Found');
                    setModalMessage(json.msg);
                    setModalVisible(true);
                }
            } else {
                setModalTitle('Fetch Error');
                setModalMessage(`Failed to fetch DR data: ${json.msg}`);
                setModalVisible(true);
            }
        } catch (error) {
            setModalTitle('Fetch Error');
            setModalMessage(`Error fetching DR data: ${error.message}`);
            setModalVisible(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrData();
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
            const response = await fetch(`${env.API_URL}/api/dr/update/${id}`, {
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
                    navigate('/dr');
                }, 1000);

            } else {
                setModalTitle('Update Error');
                setModalMessage(`Failed to update DR: ${json.msg}`);
                setModalVisible(true);
            }
        } catch (error) {
            setModalTitle('Update Error');
            setModalMessage(`Error updating DR: ${error.message}`);
            setModalVisible(true);
        } finally {
            setLoading(false);
        }
    };

    const handleOnClick = () => {
        navigate('/dr');
    };
    //Static
    const [optionTypebrake, setOptiontypebrake]= useState([]);
    useEffect(() => {
        // Function to fetch FG options data from the server
        const fetchDatatyebrake = async () => {
            try {
                const response = await fetch(`${env.API_URL}/api/static/dr/typebrake`, {
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
    const [optionColor, setOptioncolor]= useState([]);
    useEffect(() => {
        // Function to fetch FG options data from the server
        const fetchDatacolor = async () => {
            try {
                const response = await fetch(`${env.API_URL}/api/static/dr/color`, {
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
                    setOptioncolor(result.data);
                } else {
                    console.error("Expected data to be an array, but got:", typeof result.data);
                }
            } catch (error) {
                // Log any errors encountered during the fetch
                console.error("Failed to fetch FG options:", error);
            }
        };

        // Call the fetch function after component mounts
        fetchDatacolor();
    }, [user.token]);
    const [optionProcessorder, setOptionprocessorder]= useState([]);
    useEffect(() => {
        // Function to fetch FG options data from the server
        const fetchDataprocessorder = async () => {
            try {
                const response = await fetch(`${env.API_URL}/api/static/dr/processorder`, {
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
                    setOptionprocessorder(result.data);
                } else {
                    console.error("Expected data to be an array, but got:", typeof result.data);
                }
            } catch (error) {
                // Log any errors encountered during the fetch
                console.error("Failed to fetch FG options:", error);
            }
        };

        // Call the fetch function after component mounts
        fetchDataprocessorder();
    }, [user.token]);
    const [optionFormreport, setOptionformreport]= useState([]);
    useEffect(() => {
        // Function to fetch FG options data from the server
        const fetchDataformreport = async () => {
            try {
                const response = await fetch(`${env.API_URL}/api/static/dr/formreport`, {
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
                    setOptionformreport(result.data);
                } else {
                    console.error("Expected data to be an array, but got:", typeof result.data);
                }
            } catch (error) {
                // Log any errors encountered during the fetch
                console.error("Failed to fetch FG options:", error);
            }
        };

        // Call the fetch function after component mounts
        fetchDataformreport();
    }, [user.token]);


    return (
        <div>            
            <div>
                <h2>Edit DR</h2>
                {loading ? (
                    <Spinner animation="border" variant="primary" />
                ) : (
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="Code_Dr">
                                    <Form.Label>Code Dr</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Code_Dr"
                                        value={formData.Code_Dr}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group controlId="Name_Dr">
                                    <Form.Label>Name Dr</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Name_Dr"
                                        value={formData.Name_Dr}
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
                                    />
                                </Form.Group>

                                <Form.Group controlId="Name_Fg_1">
                                    <Form.Label>Name Fg 1</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Name_Fg_1"
                                        value={formData.Name_Fg_1}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group controlId="Demension">
                                    <Form.Label>Demension</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Demension"
                                        value={formData.Demension}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group controlId="Type_Brake">
                                    <Form.Label>Type Brake</Form.Label>
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

                                <Form.Group controlId="Chem_Grade">
                                    <Form.Label>Chem Grade</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Chem_Grade"
                                        value={formData.Chem_Grade}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="Status_Dr">
                                    <Form.Label>Status Dr</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Status_Dr"
                                        value={formData.Status_Dr}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group controlId="No_Grind">
                                    <Form.Label>No Grind</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="No_Grind"
                                        value={formData.No_Grind}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group controlId="Num_Hole">
                                    <Form.Label>Num Hole</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Num_Hole"
                                        value={formData.Num_Hole}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group controlId="No_Jig_Drill">
                                    <Form.Label>No Jig Drill</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="No_Jig_Drill"
                                        value={formData.No_Jig_Drill}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group controlId="No_Drill">
                                    <Form.Label>No Drill</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="No_Drill"
                                        value={formData.No_Drill}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group controlId="No_Reamer">
                                    <Form.Label>No Reamer</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="No_Reamer"
                                        value={formData.No_Reamer}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="Code">
                                    <Form.Label>Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Code"
                                        value={formData.Code}
                                        onChange={handleChange}
                                    />
                                </Form.Group> 
                                <Form.Group controlId="Remark">
                                    <Form.Label>Remark</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Remark"
                                        value={formData.Remark}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>


                                <Form.Group controlId="Color">
                                    <Form.Label>Color</Form.Label>
                                        <select
                                            name="Color"
                                            value={formData.Color}
                                            onChange={handleChange}
                                            className="form-select"
                                        >
                                            {/* Display the selected value */}
                                            <option value={formData.Color}>{formData.Color}</option>

                                            {/* Conditionally render '-' option based on the current value */}
                                            {formData.Color !== '-' && <option value="-">-</option>}

                                            {/* Unique options array */}
                                            {optionColor
                                            .map(item => item.Color)
                                            .filter(option => option !== formData.Color) // Filter out the selected value
                                            .map((option, index) => (
                                                <option key={index} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                </Form.Group>

                                <Form.Group controlId="Color_Spray">
                                    <Form.Label>Color Spray</Form.Label>
                                        <select
                                            name="Color_Spray"
                                            value={formData.Color_Spray}
                                            onChange={handleChange}
                                            className="form-select"
                                        >
                                            {/* Display the selected value */}
                                            <option value={formData.Color_Spray}>{formData.Color_Spray}</option>

                                            {/* Conditionally render '-' option based on the current value */}
                                            {formData.Color_Spray !== '-' && <option value="-">-</option>}

                                            {/* Unique options array */}
                                            {optionProcessorder
                                            .map(item => item.Process_Order)
                                            .filter(option => option !== formData.Color_Spray) // Filter out the selected value
                                            .map((option, index) => (
                                                <option key={index} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                </Form.Group>

                                <Form.Group controlId="Grind_Back">
                                    <Form.Label>Grind Back</Form.Label>
                                    <select
                                            name="Grind_Back"
                                            value={formData.Grind_Back}
                                            onChange={handleChange}
                                            className="form-select"
                                        >
                                            {/* Display the selected value */}
                                            <option value={formData.Grind_Back}>{formData.Grind_Back}</option>

                                            {/* Conditionally render '-' option based on the current value */}
                                            {formData.Grind_Back !== '-' && <option value="-">-</option>}

                                            {/* Unique options array */}
                                            {optionProcessorder
                                            .map(item => item.Process_Order)
                                            .filter(option => option !== formData.Grind_Back) // Filter out the selected value
                                            .map((option, index) => (
                                                <option key={index} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                </Form.Group>

                                <Form.Group controlId="Grind_Front">
                                    <Form.Label>Grind Front</Form.Label>

                                        <select
                                            name="Grind_Front"
                                            value={formData.Grind_Front}
                                            onChange={handleChange}
                                            className="form-select"
                                        >
                                            {/* Display the selected value */}
                                            <option value={formData.Grind_Front}>{formData.Grind_Front}</option>

                                            {/* Conditionally render '-' option based on the current value */}
                                            {formData.Grind_Front !== '-' && <option value="-">-</option>}

                                            {/* Unique options array */}
                                            {optionProcessorder
                                            .map(item => item.Process_Order)
                                            .filter(option => option !== formData.Grind_Front) // Filter out the selected value
                                            .map((option, index) => (
                                                <option key={index} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                </Form.Group>

                                <Form.Group controlId="Grind_Detail">
                                    <Form.Label>Grind Detail</Form.Label>
                                        <select
                                            name="Grind_Front"
                                            value={formData.Grind_Detail}
                                            onChange={handleChange}
                                            className="form-select"
                                        >
                                            {/* Display the selected value */}
                                            <option value={formData.Grind_Detail}>{formData.Grind_Detail}</option>

                                            {/* Conditionally render '-' option based on the current value */}
                                            {formData.Grind_Detail !== '-' && <option value="-">-</option>}

                                            {/* Unique options array */}
                                            {optionProcessorder
                                            .map(item => item.Process_Order)
                                            .filter(option => option !== formData.Grind_Detail) // Filter out the selected value
                                            .map((option, index) => (
                                                <option key={index} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                </Form.Group>

                                <Form.Group controlId="Drill">
                                    <Form.Label>Drill</Form.Label>
                                        <select
                                            name="Drill"
                                            value={formData.Drill}
                                            onChange={handleChange}
                                            className="form-select"
                                        >
                                            {/* Display the selected value */}
                                            <option value={formData.Drill}>{formData.Drill}</option>

                                            {/* Conditionally render '-' option based on the current value */}
                                            {formData.Drill !== '-' && <option value="-">-</option>}

                                            {/* Unique options array */}
                                            {optionProcessorder
                                            .map(item => item.Process_Order)
                                            .filter(option => option !== formData.Drill) // Filter out the selected value
                                            .map((option, index) => (
                                                <option key={index} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                </Form.Group>

                                <Form.Group controlId="Baat">
                                    <Form.Label>Baat</Form.Label>
                                        <select
                                            name="Baat"
                                            value={formData.Baat}
                                            onChange={handleChange}
                                            className="form-select"
                                        >
                                            {/* Display the selected value */}
                                            <option value={formData.Baat}>{formData.Baat}</option>

                                            {/* Conditionally render '-' option based on the current value */}
                                            {formData.Baat !== '-' && <option value="-">-</option>}

                                            {/* Unique options array */}
                                            {optionProcessorder
                                            .map(item => item.Process_Order)
                                            .filter(option => option !== formData.Baat) // Filter out the selected value
                                            .map((option, index) => (
                                                <option key={index} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                </Form.Group>

                                <Form.Group controlId="Ji_Hou">
                                    <Form.Label>Ji Hou</Form.Label>
                                        <select
                                            name="Ji_Hou"
                                            value={formData.Ji_Hou}
                                            onChange={handleChange}
                                            className="form-select"
                                        >
                                            {/* Display the selected value */}
                                            <option value={formData.Ji_Hou}>{formData.Ji_Hou}</option>

                                            {/* Conditionally render '-' option based on the current value */}
                                            {formData.Ji_Hou !== '-' && <option value="-">-</option>}

                                            {/* Unique options array */}
                                            {optionProcessorder
                                            .map(item => item.Process_Order)
                                            .filter(option => option !== formData.Ji_Hou) // Filter out the selected value
                                            .map((option, index) => (
                                                <option key={index} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                </Form.Group>

                                <Form.Group controlId="Fon_Hou">
                                    <Form.Label>Fon Hou</Form.Label>
                                        <select
                                            name="Fon_Hou"
                                            value={formData.Ji_HFon_Houou}
                                            onChange={handleChange}
                                            className="form-select"
                                        >
                                            {/* Display the selected value */}
                                            <option value={formData.Fon_Hou}>{formData.Fon_Hou}</option>

                                            {/* Conditionally render '-' option based on the current value */}
                                            {formData.Fon_Hou !== '-' && <option value="-">-</option>}

                                            {/* Unique options array */}
                                            {optionProcessorder
                                            .map(item => item.Process_Order)
                                            .filter(option => option !== formData.Fon_Hou) // Filter out the selected value
                                            .map((option, index) => (
                                                <option key={index} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                </Form.Group>

                                <Form.Group controlId="Tha_Khob">
                                    <Form.Label>Tha Khob</Form.Label>
                                     <select
                                            name="Tha_Khob"
                                            value={formData.Tha_Khob}
                                            onChange={handleChange}
                                            className="form-select"
                                        >
                                            {/* Display the selected value */}
                                            <option value={formData.Tha_Khob}>{formData.Tha_Khob}</option>

                                            {/* Conditionally render '-' option based on the current value */}
                                            {formData.Tha_Khob !== '-' && <option value="-">-</option>}

                                            {/* Unique options array */}
                                            {optionProcessorder
                                            .map(item => item.Process_Order)
                                            .filter(option => option !== formData.Tha_Khob) // Filter out the selected value
                                            .map((option, index) => (
                                                <option key={index} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                </Form.Group>

                                <Form.Group controlId="Cut">
                                    <Form.Label>Cut</Form.Label>
         
                                     <select
                                            name="Fon_Hou"
                                            value={formData.Cut}
                                            onChange={handleChange}
                                            className="form-select"
                                        >
                                            {/* Display the selected value */}
                                            <option value={formData.Cut}>{formData.Cut}</option>

                                            {/* Conditionally render '-' option based on the current value */}
                                            {formData.Cut !== '-' && <option value="-">-</option>}

                                            {/* Unique options array */}
                                            {optionProcessorder
                                            .map(item => item.Process_Order)
                                            .filter(option => option !== formData.Cut) // Filter out the selected value
                                            .map((option, index) => (
                                                <option key={index} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                </Form.Group>

                                <Form.Group controlId="Form">
                                    <Form.Label>Form</Form.Label>
                                         <select
                                            isSearchable={true}
                                            name="Form"
                                            value={formData.Form}
                                            onChange={handleChange}
                                            className="form-select"
                                        >
                                            {/* Display the selected value */}
                                            <option value={formData.Form}>{formData.Form}</option>

                                            {/* Conditionally render '-' option based on the current value */}
                                            {formData.Form !== '-' && <option value="-">-</option>}

                                            {/* Unique options array */}
                                            {optionFormreport
                                            .map(item => item.Form)
                                            .filter(option => option !== formData.Form) // Filter out the selected value
                                            .map((option, index) => (
                                                <option key={index} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Button variant="primary" type="submit" className="mt-3">
                            Update
                        </Button>
                        <Button variant="secondary" onClick={handleOnClick} className="mt-3 ms-2">
                            Cancel
                        </Button>
                    </Form>
                )}
            </div>


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

export default EditDr;
