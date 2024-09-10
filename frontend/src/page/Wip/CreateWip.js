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

const CreateWip = () => {
    const [collapsed, setCollapsed] = useState(false);
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
                        <h2>Create New WIP</h2>
                        <Form onSubmitCapture={handleSubmit} layout="vertical">
                            <div className='container-fluid'>
                                <div className='row'>
                                    <div className='col-xl-6 col-lg-6 col-md-12'>
                                        <Form.Item label="Code Wip">
                                            <Input
                                                type="text"
                                                required
                                                value={Code_Wip}
                                                onChange={(e) => setCode_Wip(e.target.value)}
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
                                        <Form.Item label="Code Mold">
                                            <Input
                                                type="text"
                                                required
                                                value={Code_Mold}
                                                onChange={(e) => setCode_Mold(e.target.value)}
                                            />
                                        </Form.Item>
                                        <Form.Item label="Dimension">
                                            <Input
                                                type="text"
                                                required
                                                value={Dimension}
                                                onChange={(e) => setDimension(e.target.value)}
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
                                        <Form.Item label="Weight Per Pcs">
                                            <Input
                                                type="text"
                                                required
                                                value={Weight_Per_Pcs}
                                                onChange={(e) => setWeight_Per_Pcs(e.target.value)}
                                            />
                                        </Form.Item>
                                        <Form.Item label="Pcs Per Mold">
                                            <Input
                                                type="text"
                                                required
                                                value={Pcs_Per_Mold}
                                                onChange={(e) => setPcs_Per_Mold(e.target.value)}
                                            />
                                        </Form.Item>
                                    </div>
                                    <div className='col-xl-6 col-lg-6 col-md-12'>
                                        <Form.Item label="Pcs Per Set">
                                            <Input
                                                type="text"
                                                required
                                                value={Pcs_Per_Set}
                                                onChange={(e) => setPcs_Per_Set(e.target.value)}
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
                                        <Form.Item label="Type Mold">
                                            <Input
                                                type="text"
                                                required
                                                value={Type_Mold}
                                                onChange={(e) => setType_Mold(e.target.value)}
                                            />
                                        </Form.Item>
                                        <Form.Item label="Time Per Mold">
                                            <Input
                                                type="text"
                                                required
                                                value={Time_Per_Mold}
                                                onChange={(e) => setTime_Per_Mold(e.target.value)}
                                            />
                                        </Form.Item>
                                        <Form.Item label="Mold Per 8 Hour">
                                            <Input
                                                type="text"
                                                required
                                                value={Mold_Per_8_Hour}
                                                onChange={(e) => setMold_Per_8_Hour(e.target.value)}
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

export default CreateWip;
