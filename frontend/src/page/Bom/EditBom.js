import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../../component/Sidebar';
import HeaderComponent from '../../component/Header';
import FooterComponent from '../../component/Footer';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hook/useAuthContext';
import { Form, Button, Spinner, Row, Col, Modal as BootstrapModal } from 'react-bootstrap';
import env from "react-dotenv";

const { Content } = Layout;

const EditBom = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthContext();

    const [formData, setFormData] = useState({
        Code_Fg: '',
        Name_Fg: '',
        Code_Dr: '',
        Name_Dr: '',
        Code_Wip: '',
        Name_Wip: '',
        Ra_Wip: '',
        Ra_L: '',
        Remark: '',
        CreateAt: ''
    });

    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    const fetchBomData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${env.API_URL}/api/bom/${id}`, {
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
                        Code_Fg: data.Code_Fg || '',
                        Name_Fg: data.Name_Fg || '',
                        Code_Dr: data.Code_Dr || '',
                        Name_Dr: data.Name_Dr || '',
                        Code_Wip: data.Code_Wip || '',
                        Name_Wip: data.Name_Wip || '',
                        Ra_Wip: data.Ra_Wip || '',
                        Ra_L: data.Ra_L || '',
                        Remark: data.Remark || '',
                        CreateAt: data.CreateAt || ''
                    });
                } else {
                    setModalTitle('No Data Found');
                    setModalMessage(json.msg);
                    setModalVisible(true);
                }
            } else {
                setModalTitle('Fetch Error');
                setModalMessage(`Failed to fetch BOM data: ${json.msg}`);
                setModalVisible(true);
            }
        } catch (error) {
            setModalTitle('Fetch Error');
            setModalMessage(`Error fetching BOM data: ${error.message}`);
            setModalVisible(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBomData();
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
            const response = await fetch(`${env.API_URL}/api/bom/update/${id}`, {
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
                    navigate('/bom');
                }, 1000);
            } else {
                throw new Error(json.msg || `HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            setModalTitle('Update Error');
            setModalMessage(`Error updating BOM: ${error.message}`);
            setModalVisible(true);
            console.log(error.message)
        } finally {
            setLoading(false);
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
                        margin: '24px 16px',
                        padding: '24px',
                        background: '#ffffff',
                        borderRadius: '4px',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <div>
                        <h2>Edit BOM</h2>
                        {loading ? (
                            <Spinner animation="border" variant="primary" />
                        ) : (
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group controlId="Code_Fg">
                                            <Form.Label>Code Fg</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Code_Fg"
                                                value={formData.Code_Fg}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Name_Fg">
                                            <Form.Label>Name Fg</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Name_Fg"
                                                value={formData.Name_Fg}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Code_Dr">
                                            <Form.Label>Code Dr</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Code_Dr"
                                                value={formData.Code_Dr}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Name_Dr">
                                            <Form.Label>Name Dr</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Name_Dr"
                                                value={formData.Name_Dr}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Code_Wip">
                                            <Form.Label>Code Wip</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Code_Wip"
                                                value={formData.Code_Wip}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Ra_Wip">
                                            <Form.Label>R Wip</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Ra_Wip"
                                                value={formData.Ra_Wip}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group controlId="Name_Wip">
                                            <Form.Label>Name Wip</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Name_Wip"
                                                value={formData.Name_Wip}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Ra_L">
                                            <Form.Label>R L</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Ra_L"
                                                value={formData.Ra_L}
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
                    </div>
                </Content>
                <FooterComponent />
            </Layout>

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
        </Layout>
    );
};

export default EditBom;
