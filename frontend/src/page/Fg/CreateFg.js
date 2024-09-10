import React, { useState } from 'react';
import { Layout, Form, Input, Button } from 'antd';
import Sidebar from '../../component/Sidebar';
import HeaderComponent from '../../component/Header';
import FooterComponent from '../../component/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hook/useAuthContext';
import { Modal } from 'react-bootstrap';
import env from "react-dotenv";

const { Content } = Layout;

const CreateFg = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [Code_Fg, setCode_Fg] = useState('');
    const [Name_Fg, setName_Fg] = useState('');
    const [Model, setModel] = useState('');
    const [Part_No, setPart_No] = useState('');
    const [OE_Part_No, setOE_Part_No] = useState('');
    const [Code, setCode] = useState('');
    const [Chem_Grade, setChem_Grade] = useState('');
    const [Pcs_Per_Set, setPcs_Per_Set] = useState('');
    const [Box_No, setBox_No] = useState('');
    const [Weight_Box, setWeight_Box] = useState('');
    const [Box_Erp_No, setBox_Erp_No] = useState('');
    const [Rivet_No, setRivet_No] = useState('');
    const [Weight_Revit_Per_Set, setWeight_Revit_Per_Set] = useState('');
    const [Num_Revit_Per_Set, setNum_Revit_Per_Set] = useState('');
    const [Revit_Erp_No, setRevit_Erp_No] = useState('');
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

        const fg = { 
            Code_Fg, Name_Fg, Model, Part_No, OE_Part_No, Code, Chem_Grade, Pcs_Per_Set, Box_No, 
            Weight_Box, Box_Erp_No, Rivet_No, Weight_Revit_Per_Set, Num_Revit_Per_Set, Revit_Erp_No, Remark 
        };

        try {
            const response = await fetch(`${env.API_URL}/api/fg/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(fg),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || `HTTP error! Status: ${response.status}`);
            }

            setModalContent(data.msg);
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
                navigate('/fg');
            }, 2000);

        } catch (error) {
            setModalContent(error.message || 'Please check the details and try again.');
            setShowModal(true);
        } finally {
            setIsPending(false);
        }
    };
    const handleOnClick = () => {
        navigate('/bom');
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
                    <div>
                        <h2>Create New FG</h2>
                        <Form onSubmitCapture={handleSubmit} layout="vertical">
                            <div className='container-fluid'>
                                <div className='row'>
                                    <div className='col-xl-6 col-lg-6 col-md-12'>
                                        <Form.Item label="Code FG">
                                            <Input
                                                type="text"
                                                required
                                                value={Code_Fg}
                                                onChange={(e) => setCode_Fg(e.target.value)}
                                            />
                                        </Form.Item>
                                        <Form.Item label="Name FG">
                                            <Input
                                                type="text"
                                                required
                                                value={Name_Fg}
                                                onChange={(e) => setName_Fg(e.target.value)}
                                            />
                                        </Form.Item>
                                        <Form.Item label="Model">
                                            <Input
                                                type="text"
                                                required
                                                value={Model}
                                                onChange={(e) => setModel(e.target.value)}
                                            />
                                        </Form.Item>
                                        <Form.Item label="Part No">
                                            <Input
                                                type="text"
                                                required
                                                value={Part_No}
                                                onChange={(e) => setPart_No(e.target.value)}
                                            />
                                        </Form.Item>
                                        <Form.Item label="OE Part No">
                                            <Input
                                                type="text"
                                                required
                                                value={OE_Part_No}
                                                onChange={(e) => setOE_Part_No(e.target.value)}
                                            />
                                        </Form.Item>
                                        <Form.Item label="Code">
                                            <Input
                                                type="text"
                                                required
                                                value={Code}
                                                onChange={(e) => setCode(e.target.value)}
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
                                        <Form.Item label="Pcs Per Set">
                                            <Input
                                                type="text"
                                                required
                                                value={Pcs_Per_Set}
                                                onChange={(e) => setPcs_Per_Set(e.target.value)}
                                            />
                                        </Form.Item>
                                    </div>
                                    <div className='col-xl-6 col-lg-6 col-md-12'>
                                        <Form.Item label="Box No">
                                            <Input
                                                type="text"
                                                required
                                                value={Box_No}
                                                onChange={(e) => setBox_No(e.target.value)}
                                            />
                                        </Form.Item>
                                        <Form.Item label="Weight Box">
                                            <Input
                                                type="text"
                                                required
                                                value={Weight_Box}
                                                onChange={(e) => setWeight_Box(e.target.value)}
                                            />
                                        </Form.Item>
                                        <Form.Item label="Box Erp No">
                                            <Input
                                                type="text"
                                                required
                                                value={Box_Erp_No}
                                                onChange={(e) => setBox_Erp_No(e.target.value)}
                                            />
                                        </Form.Item>
                                        <Form.Item label="Rivet No">
                                            <Input
                                                type="text"
                                                required
                                                value={Rivet_No}
                                                onChange={(e) => setRivet_No(e.target.value)}
                                            />
                                        </Form.Item>
                                        <Form.Item label="Weight Rivet Per Set">
                                            <Input
                                                type="text"
                                                required
                                                value={Weight_Revit_Per_Set}
                                                onChange={(e) => setWeight_Revit_Per_Set(e.target.value)}
                                            />
                                        </Form.Item>
                                        <Form.Item label="Num Rivet Per Set">
                                            <Input
                                                type="text"
                                                required
                                                value={Num_Revit_Per_Set}
                                                onChange={(e) => setNum_Revit_Per_Set(e.target.value)}
                                            />
                                        </Form.Item>
                                        <Form.Item label="Rivet Erp No">
                                            <Input
                                                type="text"
                                                required
                                                value={Revit_Erp_No}
                                                onChange={(e) => setRevit_Erp_No(e.target.value)}
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
                </Content>
                <FooterComponent />
            </Layout>

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
        </Layout>
    );
};

export default CreateFg;
