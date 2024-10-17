import React, { useState, useEffect } from 'react';
import {  Form, Input, Button,Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hook/useAuthContext';
import env from "react-dotenv";
import {Modal} from 'react-bootstrap';
const { Option } = Select;



const CreateDr = () => {
    const [Code_Dr, setCode_Dr] = useState('');
    const [Name_Dr, setName_Dr] = useState('');
    const [Name_Wip, setName_Wip] = useState('');
    const [Name_Fg_1, setName_Fg_1] = useState('');
    const [Demension, setDemension] = useState('');
    const [Type_Brake, setType_Brake] = useState('');
    const [Chem_Grade, setChem_Grade] = useState('');
    const [Status_Dr, setStatus_Dr] = useState('');
    const [No_Grind, setNo_Grind] = useState('');
    const [Num_Hole, setNum_Hole] = useState('');
    const [No_Jig_Drill, setNo_Jig_Drill] = useState('');
    const [No_Drill, setNo_Drill] = useState('');
    const [No_Reamer, setNo_Reamer] = useState('');
    const [Code, setCode] = useState('');
    const [Remark, setRemark] = useState('');
    const [Color, setColor] = useState('');
    const [Color_Spray, setColor_Spray] = useState('');
    const [Grind_Back, setGrind_Back] = useState('');
    const [Grind_Front, setGrind_Front] = useState('');
    const [Grind_Detail, setGrind_Detail] = useState('');
    const [Drill, setDrill] = useState('');
    const [Baat, setBaat] = useState('');
    const [Ji_Hou, setJi_Hou] = useState('');
    const [Fon_Hou, setFon_Hou] = useState('');
    const [Tha_Khob, setTha_Khob] = useState('');
    const [Cut, setCut] = useState('');
    const [FormValue, setFormValue] = useState('');
    const [isPending, setIsPending] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuthContext();

    const handleCloseModal = () => setShowModal(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsPending(true);

        const dr = { 
            Code_Dr, Name_Dr, Name_Wip, Name_Fg_1, Demension, Type_Brake, Chem_Grade, Status_Dr, 
            No_Grind, Num_Hole, No_Jig_Drill, No_Drill, No_Reamer, Code, Remark, Color, Color_Spray,
            Grind_Back, Grind_Front, Grind_Detail, Drill, Baat, Ji_Hou, Fon_Hou, Tha_Khob, Cut, FormValue 
        };

        try {
            const response = await fetch(`${env.API_URL}/api/dr/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dr),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || `HTTP error! Status: ${response.status}`);
            }

            setModalContent(data.msg);
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
                navigate('/dr');
            }, 2000);

        } catch (error) {
            setModalContent(error.message || 'Please check the details and try again.');
            setShowModal(true);
        } finally {
            setIsPending(false);
        }
    };

    const handleOnClick = () => {
        navigate('/dr');
    };
    //basic validation
    const handleCodeDrChange = (e) => {
        const value = e.target.value;
        setCode_Dr(value);

        // Extract the Code and Status_Dr based on the specified rules
        const parts = value.split('-'); // Split by '-'
        if (parts.length > 1) {
            const modelPart = value.split("-");
            // const model = modelPart[0].substring(modelPart[0].length - 5); // Extract Model (last 5 digits before '-')
            // const partNo = value.substring(value.length - 12); // Extract last 10 digits for Part_No
            const code = value.slice(0, -12); ;
            const firstDigitAfterDash = parts[1][0];
            if(firstDigitAfterDash === '0'){
                setStatus_Dr("A");
            }else{
                setStatus_Dr("B");
            }
            setCode(code)
        } else {
            // Reset Code and Status_Dr if format is incorrect
            setCode("");
            setStatus_Dr("");
        }
    }
    //Static ---
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
                const data = (await response.json()).data;
                //
                const unique_Name_wip = Array.from(
                    new Set(data.map(item => item.Name_Wip))
                ).map(name => ({ Name_Wip: name }));
                

                // console.log("data", data);
                // console.log("unique_Name_wip", unique_Name_wip);
                setOptionwip(unique_Name_wip)
                // console.log('optionWip',optionWip)
            } catch (error) {
                // Log any errors encountered during the fetch
                console.error("Failed to fetch FG options:", error);
            }
        };
    
        // Call the fetch function after component mounts
        fetchDatawip();
    }, [user.token]);

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
                const data = (await response.json()).data;
                
                const unique_Name_Fg = Array.from(
                    new Set(data.map(item => item.Name_Fg))
                ).map(name => ({ Name_Fg: name }));

                setOptionFg(unique_Name_Fg);
                // console.log(data.data);
            } catch (error) {
                // Log any errors encountered during the fetch
                console.error("Failed to fetch FG options:", error);
            }
        };
    
        // Call the fetch function after component mounts
        fetchDatafg();
    }, [user.token]); 
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
                <h2>Create New DR (สร้างรหัสกึ่งสำเร็จรูป ฝน-เจาะ)</h2>
                <Form onSubmitCapture={handleSubmit} layout="vertical">
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className='col-xl-6 col-lg-6 col-md-12'>
                                <Form.Item label="Code DR">
                                    <Input
                                        type="text"
                                        required
                                        value={Code_Dr}
                                        onChange={handleCodeDrChange}
                                    />
                                </Form.Item>
                                <Form.Item label="Name DR">
                                    <Input
                                        type="text"
                                        required
                                        value={Name_Dr}
                                        onChange={(e) => setName_Dr(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="Name WIP">
                                    <Select
                                        showSearch
                                        placeholder="Select Name Wip"
                                        value={Name_Wip}
                                        onChange={(value) => setName_Wip(value)}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().includes(input.toLowerCase())
                                        }
                                        >
                                        <Option key="-" value="-">-</Option>
                                        {optionWip.map((item) => (
                                            <Option key={item.Name_Wip} value={item.Name_Wip}>
                                                {item.Name_Wip}
                                            </Option>

                                        ))}
                                    </Select>
                                   
                                </Form.Item>
                                <Form.Item label="Name FG 1">
                                    <Select
                                        showSearch
                                        placeholder="Select Code FG 1"
                                        value={Name_Fg_1}
                                        onChange={(value) => setName_Fg_1(value)}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().includes(input.toLowerCase())
                                        }
                                        >
                                        <Option key="-" value="-">-</Option>
                                        {optionFg.map(item => (
                                            <Option key={item.Name_Fg} value={item.Name_Fg}>
                                                {item.Name_Fg}
                                            </Option>

                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="ขนาด(กว้าง*หนา-ยาว)">
                                    <Input
                                        type="text"
                                        required
                                        value={Demension}
                                        onChange={(e) => setDemension(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="ลักษระผ้าเบรก">
                                    <Select
                                        required
                                        value={Type_Brake}
                                        onChange={(value) => setType_Brake(value)}
                                    >
                                        <Option value="-">-</Option>
                                        {optionTypebrake.map(item => (
                                            <Option key={item.Type_Brake} value={item.Type_Brake}>
                                                {item.Type_Brake}
                                            </Option>

                                        ))}
                                    </Select>
                                            
                                </Form.Item>

                                <Form.Item label="เกรดเคมี">
                                    <Input
                                        type="text"
                                        required
                                        value={Chem_Grade}
                                        onChange={(e) => setChem_Grade(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="สถานะการเจาะ">
                                    <Select
                                        required
                                        value={Status_Dr}
                                        onChange={(e) => setStatus_Dr(e.target.value)}
                                    >
                                        <Select.Option value="-">-</Select.Option>
                                        <Select.Option value="A">A</Select.Option>
                                        <Select.Option value="B">B</Select.Option>

                                    </Select>
                                </Form.Item>

                                <Form.Item label="ขนาดโค้งผ้า">
                                    <Input
                                        type="text"
                                        required
                                        value={No_Grind}
                                        onChange={(e) => setNo_Grind(e.target.value)}
                                    />
                                </Form.Item>

                                <Form.Item label="จำนวนรู">
                                    <Input
                                        type="text"
                                        required
                                        value={Num_Hole}
                                        onChange={(e) => setNum_Hole(e.target.value)}
                                    />
                                </Form.Item>

                                <Form.Item label="No.ก้ามเจาะ">
                                    <Input
                                        type="text"
                                        required
                                        value={No_Jig_Drill}
                                        onChange={(e) => setNo_Jig_Drill(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="ขนาดรูเจาะ">
                                    <Input
                                        type="text"
                                        required
                                        value={No_Drill}
                                        onChange={(e) => setNo_Drill(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="ขนาดรูคว้าน">
                                    <Input
                                        type="text"
                                        required
                                        value={No_Reamer}
                                        onChange={(e) => setNo_Reamer(e.target.value)}
                                    />
                                </Form.Item>
                            </div>

                            <div className='col-xl-6 col-lg-6 col-md-12'>
                                <Form.Item label="โค้ดการขาย">
                                    <Input
                                        type="text"
                                        required
                                        value={Code}
                                        onChange={(e) => setCode(e.target.value)}
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
                                <Form.Item label="สี">
                                    <Select
                                        required
                                        value={Color}
                                        onChange={(e) => setColor(e.target.value)}
                                    >
                                        <Option key="-" value="-">-</Option>
                                        {optionColor.map((item) => (
                                            <Option key={item.Color} value={item.Color}>
                                                {item.Color}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="พ่นสี">
                                    <Select
                                        required
                                        showSearch
                                        value={Color_Spray}
                                        onChange={(e) => setColor_Spray(e.target.value)}
                                    >
                                        <Option key="-" value="-">-</Option>
                                        {optionProcessorder.map((item) => (
                                            <Option key={item.Process_Order} value={item.Process_Order}>
                                                {item.Process_Order}
                                            </Option>

                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="ฝนหลังหยาบ">
                                    <Select
                                        showSearch
                                        required
                                        value={Grind_Back}
                                        onChange={(e) => setGrind_Back(e.target.value)}
                                    >
                                        <Option key="-" value="-">-</Option>
                                        {optionProcessorder.map((item) => (
                                            <Option key={item.Process_Order} value={item.Process_Order}>
                                                {item.Process_Order}
                                            </Option>

                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="ฝนท้อง">
                                    <Select
                                        showSearch
                                        required
                                        value={Grind_Front}
                                        onChange={(e) => setGrind_Front(e.target.value)}
                                    >
                                        <Option key="-" value="-">-</Option>
                                        {optionProcessorder.map((item) => (
                                            <Option key={item.Process_Order} value={item.Process_Order}>
                                                {item.Process_Order}
                                            </Option>

                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="ฝนละเอียด">
                                    <Select
                                        showSearch
                                        required
                                        value={Grind_Detail}
                                        onChange={(e) => setGrind_Detail(e.target.value)}
                                    >
                                        <Option key="-" value="-">-</Option>
                                        {optionProcessorder.map((item) => (
                                            <Option key={item.Process_Order} value={item.Process_Order}>
                                                {item.Process_Order}
                                            </Option>
                                        ))} 
                                    </Select>
                                </Form.Item>
                                <Form.Item label="เจาะ">
                                    <Select
                                        showSearch
                                        required
                                        value={Drill}
                                        onChange={(e) => setDrill(e.target.value)}
                                    >
                                        <Option key="-" value="-">-</Option>
                                        {optionProcessorder.map((item) => (
                                            <Option key={item.Process_Order} value={item.Process_Order}>
                                                {item.Process_Order}
                                            </Option>

                                        ))}                                      
                                    </Select>
                                </Form.Item>
                                <Form.Item label="ปาด">
                                    <Select
                                        showSearch
                                        required
                                        value={Baat}
                                        onChange={(e) => setBaat(e.target.value)}
                                    >
                                        <Option key="-" value="-">-</Option>
                                        {optionProcessorder.map((item) => (
                                            <Option key={item.Process_Order} value={item.Process_Order}>
                                                {item.Process_Order}
                                            </Option>

                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="จี๋หัว">
                                    <Select
                                        showSearch
                                        required
                                        value={Ji_Hou}
                                        onChange={(e) => setJi_Hou(e.target.value)}
                                    >
                                        <Option key="-" value="-">-</Option>
                                        {optionProcessorder.map((item) => (
                                            <Option key={item.Process_Order} value={item.Process_Order}>
                                                {item.Process_Order}
                                            </Option>

                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="ฝนหัว">
                                    <Select
                                        showSearch
                                       required
                                       value={Fon_Hou}
                                       onChange={(e) => setFon_Hou(e.target.value)}
                                    >
                                        <Option key="-" value="-">-</Option>
                                        {optionProcessorder.map((item) => (
                                            <Option key={item.Process_Order} value={item.Process_Order}>
                                                {item.Process_Order}
                                            </Option>

                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="ทำขอบ">
                                    <Select
                                        showSearch
                                        required
                                        value={Tha_Khob}
                                        onChange={(e) => setTha_Khob(e.target.value)}
                                    >
                                        <Option key="-" value="-">-</Option>
                                        {optionProcessorder.map((item) => (
                                            <Option key={item.Process_Order} value={item.Process_Order}>
                                                {item.Process_Order}
                                            </Option>

                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="ตัด">
                                    <Select
                                        showSearch
                                        required
                                        value={Cut}
                                        onChange={(e) => setCut(e.target.value)}
                                    >
                                        <Option key="-" value="-">-</Option>
                                        {optionProcessorder.map((item) => (
                                            <Option key={item.Process_Order} value={item.Process_Order}>
                                                {item.Process_Order}
                                            </Option>

                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="ฟอร์ม">
                                    <Select
                                        showSearch
                                        required
                                        value={FormValue}
                                        onChange={(e) => setFormValue(e.target.value)}
                                    >
                                        <Option key="-" value="-">-</Option>
                                        {optionFormreport.map((item) => (
                                            <Option key={item.Form} value={item.Form}>
                                                {item.Form}
                                            </Option>

                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                    <Form.Item>
                        <Button type="" className='me-2' onClick={handleOnClick}>
                            Back
                        </Button>
                        <Button type="primary" htmlType="submit" loading={isPending}>
                            Create
                        </Button>

                    </Form.Item>
                </Form>
            </div>

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

export default CreateDr;
