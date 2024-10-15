import React, { useState } from 'react';
import {  Form, Input, Button,Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hook/useAuthContext';
import env from "react-dotenv";

import {Modal} from 'react-bootstrap';


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
    return (
        <div>
            <div>
                <h2>Create New DR</h2>
                <Form onSubmitCapture={handleSubmit} layout="vertical">
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className='col-xl-6 col-lg-6 col-md-12'>
                                <Form.Item label="Code DR">
                                    <Input
                                        type="text"
                                        required
                                        value={Code_Dr}
                                        onChange={(e) => setCode_Dr(e.target.value)}
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
                                    <Input
                                        type="text"
                                        required
                                        value={Name_Wip}
                                        onChange={(e) => setName_Wip(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="Name FG 1">
                                    <Input
                                        type="text"
                                        required
                                        value={Name_Fg_1}
                                        onChange={(e) => setName_Fg_1(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="ขนาด(กว้าง*หนา-ยาว)">
                                    <Input
                                        type="text"
                                        required
                                        value={Demension}
                                        onChange={(e) => setDemension(e.target.value)}
                                    />
                                </Form.Item>
                                {/* <Form.Item label="ลักษระผ้าเบรก">
                                    <Input
                                        type="text"
                                        required
                                        value={Type_Brake}
                                        onChange={(e) => setType_Brake(e.target.value)}
                                    />
                                </Form.Item> */}
                                <Form.Item label="ลักษระผ้าเบรก">
                                    <Select
                                        required
                                        value={Type_Brake}
                                        onChange={(value) => setType_Brake(value)}
                                    >
                                        <Select.Option value="-">-</Select.Option>
                                        <Select.Option value="ผ้าเบรกใหญ่">ผ้าเบรกใหญ่</Select.Option>
                                        <Select.Option value="ผ้าเบรกใหญ่เรียว">ผ้าเบรกใหญ่เรียว</Select.Option>
                                        <Select.Option value="ผ้าเบรกกลาง">ผ้าเบรกกลาง</Select.Option>
                                        <Select.Option value="ผ้าเบรกเล็ก">ผ้าเบรกเล็ก</Select.Option>
                                        <Select.Option value="ผ้าเบรกแผ่น">ผ้าเบรกแผ่น</Select.Option>
                                        <Select.Option value="ผ้าประกอบก้าม">ผ้าประกอบก้าม</Select.Option>
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
                                        <Select.Option value="-">-</Select.Option>
                                        <Select.Option value="เหลือง">เหลือง</Select.Option>
                                        <Select.Option value="ฟ้า">ฟ้า</Select.Option>
                                        <Select.Option value="ส้ม">ส้ม</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label="พ่นสี">
                                    <Select
                                        required
                                        value={Color_Spray}
                                        onChange={(e) => setColor_Spray(e.target.value)}
                                    >
                                        <Select.Option value="-">-</Select.Option>
                                        <Select.Option value="1">1</Select.Option>
                                        <Select.Option value="2">2</Select.Option>
                                        <Select.Option value="3">3</Select.Option>
                                        <Select.Option value="4">4</Select.Option>
                                        <Select.Option value="5">5</Select.Option>
                                        <Select.Option value="6">6</Select.Option>
                                        <Select.Option value="7">7</Select.Option>
                                        <Select.Option value="8">8</Select.Option>
                                        <Select.Option value="9">9</Select.Option>
                                        <Select.Option value="10">10</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label="ฝนหลังหยาบ">
                                    <Select
                                        required
                                        value={Grind_Back}
                                        onChange={(e) => setGrind_Back(e.target.value)}
                                    >
                                        <Select.Option value="-">-</Select.Option>
                                        <Select.Option value="1">1</Select.Option>
                                        <Select.Option value="2">2</Select.Option>
                                        <Select.Option value="3">3</Select.Option>
                                        <Select.Option value="4">4</Select.Option>
                                        <Select.Option value="5">5</Select.Option>
                                        <Select.Option value="6">6</Select.Option>
                                        <Select.Option value="7">7</Select.Option>
                                        <Select.Option value="8">8</Select.Option>
                                        <Select.Option value="9">9</Select.Option>
                                        <Select.Option value="10">10</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label="ฝนท้อง">
                                    <Select
                                        required
                                        value={Grind_Front}
                                        onChange={(e) => setGrind_Front(e.target.value)}
                                    >
                                        <Select.Option value="-">-</Select.Option>
                                        <Select.Option value="1">1</Select.Option>
                                        <Select.Option value="2">2</Select.Option>
                                        <Select.Option value="3">3</Select.Option>
                                        <Select.Option value="4">4</Select.Option>
                                        <Select.Option value="5">5</Select.Option>
                                        <Select.Option value="6">6</Select.Option>
                                        <Select.Option value="7">7</Select.Option>
                                        <Select.Option value="8">8</Select.Option>
                                        <Select.Option value="9">9</Select.Option>
                                        <Select.Option value="10">10</Select.Option>    
                                    </Select>
                                </Form.Item>
                                <Form.Item label="ฝนละเอียด">
                                    <Select
                                        required
                                        value={Grind_Detail}
                                        onChange={(e) => setGrind_Detail(e.target.value)}
                                    >
                                        <Select.Option value="-">-</Select.Option>
                                        <Select.Option value="1">1</Select.Option>
                                        <Select.Option value="2">2</Select.Option>
                                        <Select.Option value="3">3</Select.Option>
                                        <Select.Option value="4">4</Select.Option>
                                        <Select.Option value="5">5</Select.Option>
                                        <Select.Option value="6">6</Select.Option>
                                        <Select.Option value="7">7</Select.Option>
                                        <Select.Option value="8">8</Select.Option>
                                        <Select.Option value="9">9</Select.Option>
                                        <Select.Option value="10">10</Select.Option>    
                                    </Select>
                                </Form.Item>
                                <Form.Item label="เจาะ">
                                    <Select
                                        required
                                        value={Drill}
                                        onChange={(e) => setDrill(e.target.value)}
                                    >

                                        <Select.Option value="-">-</Select.Option>
                                        <Select.Option value="1">1</Select.Option>
                                        <Select.Option value="2">2</Select.Option>
                                        <Select.Option value="3">3</Select.Option>
                                        <Select.Option value="4">4</Select.Option>
                                        <Select.Option value="5">5</Select.Option>
                                        <Select.Option value="6">6</Select.Option>
                                        <Select.Option value="7">7</Select.Option>
                                        <Select.Option value="8">8</Select.Option>
                                        <Select.Option value="9">9</Select.Option>
                                        <Select.Option value="10">10</Select.Option> 
                                    </Select>
                                </Form.Item>
                                <Form.Item label="ปาด">
                                    <Select
                                        required
                                        value={Baat}
                                        onChange={(e) => setBaat(e.target.value)}
                                    >
                                        <Select.Option value="-">-</Select.Option>
                                        <Select.Option value="1">1</Select.Option>
                                        <Select.Option value="2">2</Select.Option>
                                        <Select.Option value="3">3</Select.Option>
                                        <Select.Option value="4">4</Select.Option>
                                        <Select.Option value="5">5</Select.Option>
                                        <Select.Option value="6">6</Select.Option>
                                        <Select.Option value="7">7</Select.Option>
                                        <Select.Option value="8">8</Select.Option>
                                        <Select.Option value="9">9</Select.Option>
                                        <Select.Option value="10">10</Select.Option> 
                                    </Select>
                                </Form.Item>
                                <Form.Item label="จี๋หัว">
                                    <Select
                                        required
                                        value={Ji_Hou}
                                        onChange={(e) => setJi_Hou(e.target.value)}
                                    >
                                        <Select.Option value="-">-</Select.Option>
                                        <Select.Option value="1">1</Select.Option>
                                        <Select.Option value="2">2</Select.Option>
                                        <Select.Option value="3">3</Select.Option>
                                        <Select.Option value="4">4</Select.Option>
                                        <Select.Option value="5">5</Select.Option>
                                        <Select.Option value="6">6</Select.Option>
                                        <Select.Option value="7">7</Select.Option>
                                        <Select.Option value="8">8</Select.Option>
                                        <Select.Option value="9">9</Select.Option>
                                        <Select.Option value="10">10</Select.Option> 
                                    </Select>
                                </Form.Item>
                                <Form.Item label="ฝนหัว">
                                    <Select
                                       required
                                       value={Fon_Hou}
                                       onChange={(e) => setFon_Hou(e.target.value)}
                                    >
                                        <Select.Option value="-">-</Select.Option>
                                        <Select.Option value="1">1</Select.Option>
                                        <Select.Option value="2">2</Select.Option>
                                        <Select.Option value="3">3</Select.Option>
                                        <Select.Option value="4">4</Select.Option>
                                        <Select.Option value="5">5</Select.Option>
                                        <Select.Option value="6">6</Select.Option>
                                        <Select.Option value="7">7</Select.Option>
                                        <Select.Option value="8">8</Select.Option>
                                        <Select.Option value="9">9</Select.Option>
                                        <Select.Option value="10">10</Select.Option> 
                                    </Select>
                                </Form.Item>
                                <Form.Item label="ทำขอบ">
                                    <Select
                                        required
                                        value={Tha_Khob}
                                        onChange={(e) => setTha_Khob(e.target.value)}
                                    >
                                        <Select.Option value="-">-</Select.Option>
                                        <Select.Option value="1">1</Select.Option>
                                        <Select.Option value="2">2</Select.Option>
                                        <Select.Option value="3">3</Select.Option>
                                        <Select.Option value="4">4</Select.Option>
                                        <Select.Option value="5">5</Select.Option>
                                        <Select.Option value="6">6</Select.Option>
                                        <Select.Option value="7">7</Select.Option>
                                        <Select.Option value="8">8</Select.Option>
                                        <Select.Option value="9">9</Select.Option>
                                        <Select.Option value="10">10</Select.Option> 
                                    </Select>
                                </Form.Item>
                                <Form.Item label="ตัด">
                                    <Select
                                        required
                                        value={Cut}
                                        onChange={(e) => setCut(e.target.value)}
                                    >
                                    <Select.Option value="-">-</Select.Option>
                                        <Select.Option value="1">1</Select.Option>
                                        <Select.Option value="2">2</Select.Option>
                                        <Select.Option value="3">3</Select.Option>
                                        <Select.Option value="4">4</Select.Option>
                                        <Select.Option value="5">5</Select.Option>
                                        <Select.Option value="6">6</Select.Option>
                                        <Select.Option value="7">7</Select.Option>
                                        <Select.Option value="8">8</Select.Option>
                                        <Select.Option value="9">9</Select.Option>
                                        <Select.Option value="10">10</Select.Option> 
                                    </Select>
                                </Form.Item>
                                <Form.Item label="ฟอร์ม">
                                    <Select
                                        required
                                        value={FormValue}
                                        onChange={(e) => setFormValue(e.target.value)}
                                    >
                                        <Select.Option value="1">1</Select.Option>
                                        <Select.Option value="2">2</Select.Option>
                                        <Select.Option value="3">3</Select.Option>
                                        <Select.Option value="4">4</Select.Option>
                                        <Select.Option value="5">5</Select.Option>
                                        <Select.Option value="6">6</Select.Option>
                                        <Select.Option value="7">7</Select.Option>
                                        <Select.Option value="8">8</Select.Option>
                                        <Select.Option value="9">9</Select.Option>
                                        <Select.Option value="10">10</Select.Option> 
                                        <Select.Option value="11">11</Select.Option> 
                                        <Select.Option value="12">12</Select.Option> 
                                        <Select.Option value="13">13</Select.Option> 
                                        <Select.Option value="14">14</Select.Option> 
                                        <Select.Option value="15">15</Select.Option> 
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
