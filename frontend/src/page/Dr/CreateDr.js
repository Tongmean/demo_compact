import React, { useState } from 'react';
import {  Form, Input, Button } from 'antd';
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
                                <Form.Item label="Demension">
                                    <Input
                                        type="text"
                                        required
                                        value={Demension}
                                        onChange={(e) => setDemension(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="Type Brake">
                                    <Input
                                        type="text"
                                        required
                                        value={Type_Brake}
                                        onChange={(e) => setType_Brake(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="Chemical Grade">
                                    <Input
                                        type="text"
                                        required
                                        value={Chem_Grade}
                                        onChange={(e) => setChem_Grade(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="Status DR">
                                    <Input
                                        type="text"
                                        required
                                        value={Status_Dr}
                                        onChange={(e) => setStatus_Dr(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="No Grind">
                                    <Input
                                        type="text"
                                        required
                                        value={No_Grind}
                                        onChange={(e) => setNo_Grind(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="Number Hole">
                                    <Input
                                        type="text"
                                        required
                                        value={Num_Hole}
                                        onChange={(e) => setNum_Hole(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="No Jig Drill">
                                    <Input
                                        type="text"
                                        required
                                        value={No_Jig_Drill}
                                        onChange={(e) => setNo_Jig_Drill(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="No Drill">
                                    <Input
                                        type="text"
                                        required
                                        value={No_Drill}
                                        onChange={(e) => setNo_Drill(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="No Reamer">
                                    <Input
                                        type="text"
                                        required
                                        value={No_Reamer}
                                        onChange={(e) => setNo_Reamer(e.target.value)}
                                    />
                                </Form.Item>
                            </div>
                            <div className='col-xl-6 col-lg-6 col-md-12'>
                                <Form.Item label="Code">
                                    <Input
                                        type="text"
                                        required
                                        value={Code}
                                        onChange={(e) => setCode(e.target.value)}
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
                                <Form.Item label="Color">
                                    <Input
                                        type="text"
                                        required
                                        value={Color}
                                        onChange={(e) => setColor(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="Color Spray">
                                    <Input
                                        type="text"
                                        required
                                        value={Color_Spray}
                                        onChange={(e) => setColor_Spray(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="Grind Back">
                                    <Input
                                        type="text"
                                        required
                                        value={Grind_Back}
                                        onChange={(e) => setGrind_Back(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="Grind Front">
                                    <Input
                                        type="text"
                                        required
                                        value={Grind_Front}
                                        onChange={(e) => setGrind_Front(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="Grind Detail">
                                    <Input
                                        type="text"
                                        required
                                        value={Grind_Detail}
                                        onChange={(e) => setGrind_Detail(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="Drill">
                                    <Input
                                        type="text"
                                        required
                                        value={Drill}
                                        onChange={(e) => setDrill(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="Baat">
                                    <Input
                                        type="text"
                                        required
                                        value={Baat}
                                        onChange={(e) => setBaat(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="Ji Hou">
                                    <Input
                                        type="text"
                                        required
                                        value={Ji_Hou}
                                        onChange={(e) => setJi_Hou(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="Fon Hou">
                                    <Input
                                        type="text"
                                        required
                                        value={Fon_Hou}
                                        onChange={(e) => setFon_Hou(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="Tha Khob">
                                    <Input
                                        type="text"
                                        required
                                        value={Tha_Khob}
                                        onChange={(e) => setTha_Khob(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="Cut">
                                    <Input
                                        type="text"
                                        required
                                        value={Cut}
                                        onChange={(e) => setCut(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="Form">
                                    <Input
                                        type="text"
                                        required
                                        value={FormValue}
                                        onChange={(e) => setFormValue(e.target.value)}
                                    />
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
