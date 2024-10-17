import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select  } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hook/useAuthContext';
import { Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import env from "react-dotenv";
const { Option } = Select;

const CreateBom = () => {
    const [Code_Fg, setCode_Fg] = useState('');
    const [Name_Fg, setName_Fg] = useState('');
    const [Code_Dr, setCode_Dr] = useState('');
    const [Name_Dr, setName_Dr] = useState('');
    const [Code_Wip, setCode_Wip] = useState('');
    const [Name_Wip, setName_Wip] = useState('');
    const [Ra_Wip, setRa_Wip] = useState('');
    const [Ra_L, setRa_L] = useState('');
    const [Remark, setRemark] = useState('');
    const [isPending, setIsPending] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuthContext(); // Retrieve user context

    const handleCloseModal = () => setShowModal(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsPending(true);

        const bom = { Code_Fg, Name_Fg, Code_Dr, Name_Dr, Code_Wip, Name_Wip, Ra_Wip, Ra_L, Remark };

        try {
            const response = await fetch(`${env.API_URL}/api/bom/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bom),
            });

            const data = await response.json();
            //if cilent status != 200. Then throw Error message (data.msg got from server-side)
            if (!response.ok) {
                throw new Error(data.msg || `HTTP error! Status: ${response.status}`);
            }

            // Success modal message from the server
            setModalContent(data.msg); // Use message from server-side
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
                navigate('/bom');
            }, 2000); // Redirect after 2 seconds

        } catch (error) {
            // Error modal message from the server
            //Catch message from throm have 2 sanarios: 1, Problem from query. 2, From catch error.
            setModalContent(error.message || 'Please check the details and try again.');
            setShowModal(true);
        } finally {
            setIsPending(false);
        }
    };
    const handleOnClick = () => {
        navigate('/bom');
    };
    //staic data    
    const [optionFg, setOptionFg] = useState([]);
    useEffect(() => {
        // Function to fetch FG options data from the server
        const fetchDatafg = async () => {
            try {
                const response = await fetch(`${env.API_URL}/api/static/fg`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user.token}`, // Adding token to the request headers
                        'Content-Type': 'application/json'
                    }
                });
    
                // Check if the response is okay before proceeding
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.msg}`);
                }
    
                // Parse the response JSON and set it in the state
                const data = await response.json();
                setOptionFg(data.data);
                // console.log(data.data);
            } catch (error) {
                // Log any errors encountered during the fetch
                console.error("Failed to fetch FG options:", error);
            }
        };
    
        // Call the fetch function after component mounts
        fetchDatafg();
    }, [user.token]); // Empty dependency array ensures this effect runs once after the component mounts
    const handleCodeFgChange = (value) => {
        setCode_Fg(value);
    
        // Find the corresponding Name_Fg from the options
        const selectedItem = optionFg.find(item => item.Code_Fg === value);
        if (selectedItem) {
          setName_Fg(selectedItem.Name_Fg);
        }else if(value === '-') {
            setName_Fg('-'); // Clear Name_Fg if '-' is selected
        }
    };
    const [optionDr, setOptionDr] = useState([]);
    useEffect(() => {
        // Function to fetch FG options data from the server
        const fetchDatadr = async () => {
            try {
                const response = await fetch(`${env.API_URL}/api/static/dr`, {
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
                const data = await response.json();
                setOptionDr(data.data);
                // console.log(data);
            } catch (error) {
                // Log any errors encountered during the fetch
                console.error("Failed to fetch FG options:", error);
            }
        };
    
        // Call the fetch function after component mounts
        fetchDatadr();
    }, [user.token]); // Empty dependency array ensures this effect runs once after the component mounts
    const handleCodeDrChange = (value) => {
        setCode_Dr(value);

        // Find the corresponding Name_Fg from the options
        const selectedItem = optionDr.find(item => item.Code_Dr === value);
        if (selectedItem) {
          setName_Dr(selectedItem.Name_Dr);
        }
        else if(value === '-') {
            setName_Dr('-'); // Clear Name_Fg if '-' is selected
        }
    };
    const [optionWip, setOptionwip] = useState([])
    useEffect(() => {
        // Function to fetch FG options data from the server
        const fetchDatawip = async () => {
            try {
                const response = await fetch(`${env.API_URL}/api/static/wip`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user.token}`, // Adding token to the request headers
                        'Content-Type': 'application/json'
                    }
                });
    
                // Check if the response is okay before proceeding
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.msg}`);
                }
    
                // Parse the response JSON and set it in the state
                const data = await response.json();
                setOptionwip(data.data);
                // console.log("wip",data);
            } catch (error) {
                // Log any errors encountered during the fetch
                console.error("Failed to fetch FG options:", error);
            }
        };
    
        // Call the fetch function after component mounts
        fetchDatawip();
    }, [user.token]); // Empty dependency array ensures this effect runs once after the component mounts
    const handleCodeWipChange = (value) => {
        setCode_Wip(value);
        console.log("codewip",value )
        // Find the corresponding Name_Fg from the options
        const selectedItem = optionWip.find(item => item.Code_Wip === value);
        if (selectedItem) {
          setName_Wip(selectedItem.Name_Wip);
        }
        else if(value === '-') {
            setName_Wip('-'); // Clear Name_Fg if '-' is selected
        }
    };


    return (

        <div>            
            <div>
                <h2>Create New BOM</h2>
                <Form onSubmitCapture={handleSubmit} layout="vertical">
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className='col-xl-6 col-lg-6 col-md-12'>
                                <Form.Item label="Code FG">
                                    <Select
                                        showSearch
                                        placeholder="Select Code FG"
                                        value={Code_Fg}
                                        onChange={handleCodeFgChange}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().includes(input.toLowerCase())
                                        }
                                        >
                                        <Option key="-" value="-">-</Option>
                                        {optionFg.map(item => (
                                            <Option key={item.Code_Fg} value={item.Code_Fg}>
                                                {item.Code_Fg}
                                            </Option>

                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Name FG">
                                    <Input
                                        type="text"
                                        required
                                        value={Name_Fg}
                                        onChange={(e) => setName_Fg(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="Code Dr">
                                    <Select
                                        showSearch
                                        placeholder="Select Code Dr"
                                        value={Code_Dr}
                                        onChange={handleCodeDrChange}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().includes(input.toLowerCase())
                                        }
                                        >
                                        <Option key="-" value="-">-</Option>
                                        {optionDr.map(item => (
                                            <Option key={item.Code_Dr} value={item.Code_Dr}>
                                                {item.Code_Dr}
                                            </Option>

                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Name Dr">
                                    <Input
                                        type="text"
                                        required
                                        value={Name_Dr}
                                        onChange={(e) => setName_Dr(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="Code Wip">
                                    <Select
                                        showSearch
                                        placeholder="Select Code Wip"
                                        value={Code_Wip}
                                        onChange={handleCodeWipChange}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().includes(input.toLowerCase())
                                        }
                                        >
                                        <Option key="-" value="-">-</Option>
                                        {optionWip.map((item) => (
                                            <Option key={item.Code_Wip} value={item.Code_Wip}>
                                                {item.Code_Wip}
                                            </Option>

                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Name Wip">
                                    <Input
                                        type="text"
                                        required
                                        value={Name_Wip}
                                        onChange={(e) => setName_Wip(e.target.value)}
                                    />
                                </Form.Item>
                            </div>
                            <div className='col-xl-6 col-lg-6 col-md-12'>
                                <Form.Item label="Ra Wip">
                                    <Input
                                        type="text"
                                        required
                                        value={Ra_Wip}
                                        onChange={(e) => setRa_Wip(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="Ra L">
                                    <Input
                                        type="text"
                                        required
                                        value={Ra_L}
                                        onChange={(e) => setRa_L(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="Remark">
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

export default CreateBom;
