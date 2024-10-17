import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select  } from 'antd';

import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hook/useAuthContext';
import { Modal } from 'react-bootstrap';
import env from "react-dotenv";
import 'bootstrap/dist/css/bootstrap.min.css';

const { Option } = Select;

const CreateWip = () => {
    const [Code_Wip, setCode_Wip] = useState('');
    const [Name_Wip, setName_Wip] = useState('');
    const [Code_Mold, setCode_Mold] = useState('');
    const [Dimension, setDimension] = useState('');
    const [Chem_Grade, setChem_Grade] = useState('');
    const [Weight_Per_Pcs, setWeight_Per_Pcs] = useState('');
    const [Pcs_Per_Mold, setPcs_Per_Mold] = useState('');
    const [Pcs_Per_Set, setPcs_Per_Set] = useState('');
    const [Type_Brake, setType_Brake] = useState('');
    const [Type_Mold, setType_Mold] = useState('');
    const [Time_Per_Mold, setTime_Per_Mold] = useState('');
    const [Mold_Per_8_Hour, setMold_Per_8_Hour] = useState('');
    const [Remark, setRemark] = useState('');
    const [isPending, setIsPending] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuthContext();

    const handleCloseModal = () => setShowModal(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsPending(true);

        const wip = { 
            Code_Wip, Name_Wip, Code_Mold, Dimension, Chem_Grade, Weight_Per_Pcs, Pcs_Per_Mold, 
            Pcs_Per_Set, Type_Brake, Type_Mold, Time_Per_Mold, Mold_Per_8_Hour, Remark 
        };

        try {
            const response = await fetch(`${env.API_URL}/api/wip/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(wip),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || `HTTP error! Status: ${response.status}`);
            }

            setModalContent(data.msg);
            setShowModal(true);

            setTimeout(() => {
                setShowModal(false);
                navigate('/wip');

            }, 1500);

        } catch (error) {
            setModalContent(error.message || 'Please check the details and try again.');
            setShowModal(true);
        } finally {
            setIsPending(false);
        }
    };

    const handleOnClick = () => {
        navigate('/wip');
    };
    //validate
        // Function to handle Code_Wip change
    const handleCodeWipChange = (e) => {
        const value = e.target.value;
        setCode_Wip(value);

        // Split the Code_Wip by '-' to extract the parts
        const parts = value.split('-');
        if (parts.length === 2) {
            const firstPart = parts[0];  // e.g., "216110194"
            const secondPart = parts[1]; // e.g., "515"

            // Ensure the first part has at least 9 characters (3 sets of 3 digits)
            if (firstPart.length >= 9) {
                const firstThree = parseInt(firstPart.slice(0, 3));  // 216
                const secondThree = parseInt(firstPart.slice(3, 6)); // 110
                const thirdThree = parseInt(firstPart.slice(6, 9));  // 194
               
                // Calculate the Dimension
                const calculatedDimension = firstThree + "*" + secondThree + "-" + thirdThree;
                setDimension(calculatedDimension);
                console.log(firstThree, secondThree, thirdThree,calculatedDimension)
                // Set Chem_Grade to the part after '-'
                setChem_Grade(secondPart);
            } else {
                // Reset Dimension and Chem_Grade if input is invalid
                setDimension('');
                setChem_Grade('');
            }
        } else {
            // Reset Dimension and Chem_Grade if input is invalid
            setDimension('');
            setChem_Grade('');
        }
    }
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
                <div>
                    <h2>Create New WIP (สร้างรหัสกึ่งสำเร็จรูป)</h2>
                    <Form onSubmitCapture={handleSubmit} layout="vertical">
                        <div className='container-fluid'>
                            <div className='row'>
                                <div className='col-xl-6 col-lg-6 col-md-12'>
                                    <Form.Item label="Code Wip">
                                        <Input
                                            type="text"
                                            required
                                            value={Code_Wip}
                                            onChange={handleCodeWipChange}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Name Wip">
                                        <Input
                                            type="text"
                                            required
                                            value={Name_Wip}
                                            onChange={(e) => setName_Wip(e.target.value)}
                                        />
                                    </Form.Item>
                                    <Form.Item label="รหัสแม่พิมพ์">
                                        <Input
                                            type="text"
                                            required
                                            value={Code_Mold}
                                            onChange={(e) => setCode_Mold(e.target.value)}
                                        />
                                    </Form.Item>
                                    <Form.Item label="ขนาด(กว้าง*หนา-ยาว)">
                                        <Input
                                            type="text"
                                            required
                                            value={Dimension}
                                            onChange={(e) => setDimension(e.target.value)}
                                        />
                                    </Form.Item>
                                    <Form.Item label="เกรดเคมี">
                                        <Input
                                            type="text"
                                            required
                                            value={Chem_Grade}
                                            onChange={(e) => setChem_Grade(e.target.value)}
                                        />
                                    </Form.Item>
                                    <Form.Item label="น้ำหนักต่อชิ้น">
                                        <Input
                                            type="text"
                                            required
                                            value={Weight_Per_Pcs}
                                            onChange={(e) => setWeight_Per_Pcs(e.target.value)}
                                        />
                                    </Form.Item>
                                    <Form.Item label="ชิ้นต่อพิมพ์">
                                        <Input
                                            type="text"
                                            required
                                            value={Pcs_Per_Mold}
                                            onChange={(e) => setPcs_Per_Mold(e.target.value)}
                                        />
                                    </Form.Item>
                                </div>
                                <div className='col-xl-6 col-lg-6 col-md-12'>
                                    <Form.Item label="ชิ้นต่อชุด">
                                        <Select
                                            showSearch
                                            required
                                            placeholder="เลือกชิ้นต่อชุด"
                                            value={Pcs_Per_Set}
                                            onChange={(value) => setPcs_Per_Set(value)}
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().includes(input.toLowerCase())
                                            }
                                            >
                                            <Option value="-">-</Option>
                                            {optionPcsperset.map(item => (
                                                <Option key={item.Pcs_Per_Set} value={item.Pcs_Per_Set}>
                                                    {item.Pcs_Per_Set}
                                                </Option>

                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="ลักษณะผ้าเบรก">
                                        <Select
                                            showSearch
                                            required
                                            placeholder="เลือกลักษณะผ้า"
                                            value={Type_Brake}
                                            onChange={(value) => setType_Brake(value)}
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().includes(input.toLowerCase())
                                            }
                                            >
                                            <Option value="-">-</Option>
                                            {optionTypebrake.map(item => (
                                                <Option key={item.Type_Brake} value={item.Type_Brake}>
                                                    {item.Type_Brake}
                                                </Option>

                                            ))}
                                        </Select>
                                    </Form.Item>


                                    <Form.Item label="ลักษณะแม่พิมพ์">
                                        <Select
                                            showSearch
                                            required
                                            placeholder="เลือกลักษณะแม่พิมพ์"
                                            value={Type_Mold}
                                            onChange={(value) => setType_Mold(value)}
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().includes(input.toLowerCase())
                                            }
                                            >
                                            <Option value="-">-</Option>
                                            {optionTypemold.map(item => (
                                                <Option key={item.Type_Mold} value={item.Type_Mold}>
                                                    {item.Type_Mold}
                                                </Option>

                                            ))}
                                        </Select>
                                    </Form.Item>
                                    

                                    {/* <Form.Item label="ลักษณะแม่พิมพ์">
                                        <Input
                                            type="text"
                                            required
                                            value={Type_Mold}
                                            onChange={(e) => setType_Mold(e.target.value)}
                                        />
                                    </Form.Item> */}
                                    
                                    <Form.Item label="เวลาต่อพิมพ์">
                                        <Input
                                            type="text"
                                            required
                                            value={Time_Per_Mold}
                                            onChange={(e) => setTime_Per_Mold(e.target.value)}
                                        />
                                    </Form.Item>
                                    <Form.Item label="พิมพ์ต่อ8ชั่วโมง">
                                        <Input
                                            type="text"
                                            required
                                            value={Mold_Per_8_Hour}
                                            onChange={(e) => setMold_Per_8_Hour(e.target.value)}
                                        />
                                    </Form.Item>
                                    <Form.Item label="หมายเหตุ">
                                        <Input
                                            type="text"
                                            required
                                            value={Remark}
                                            onChange={(e) => setRemark(e.target.value)}
                                        />
                                    </Form.Item>
                                </div>
                                <div className='col-12'>
                                    <Form.Item>
                                        <Button type="" className='me-2' onClick={handleOnClick}>
                                            Back
                                        </Button>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            disabled={isPending}
                                        >
                                            {isPending ? 'Saving...' : 'Save Data'}
                                        </Button>
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                    </Form>
                </div>

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

export default CreateWip;
