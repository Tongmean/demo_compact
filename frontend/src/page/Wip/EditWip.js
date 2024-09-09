import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../../component/Sidebar';
import HeaderComponent from '../../component/Header';
import FooterComponent from '../../component/Footer';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hook/useAuthContext';
import { Form, Button, Spinner, Row, Col, Modal as BootstrapModal } from 'react-bootstrap';

const { Content } = Layout;

const EditWip = () => {
    const [collapsed, setCollapsed] = useState(false);
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
            const response = await fetch(`http://localhost:3030/api/wip/${id}`, {
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
            const response = await fetch(`http://localhost:3030/api/wip/update/${id}`, {
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

                                        <Form.Group controlId="Code_Mold">
                                            <Form.Label>Code Mold</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Code_Mold"
                                                value={formData.Code_Mold}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Dimension">
                                            <Form.Label>Dimension</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Dimension"
                                                value={formData.Dimension}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Chem_Grade">
                                            <Form.Label>Chemical Grade</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Chem_Grade"
                                                value={formData.Chem_Grade}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Weight_Per_Pcs">
                                            <Form.Label>Weight Per Piece</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Weight_Per_Pcs"
                                                value={formData.Weight_Per_Pcs}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Pcs_Per_Mold">
                                            <Form.Label>Pieces Per Mold</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Pcs_Per_Mold"
                                                value={formData.Pcs_Per_Mold}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Pcs_Per_Set">
                                            <Form.Label>Pieces Per Set</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Pcs_Per_Set"
                                                value={formData.Pcs_Per_Set}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Type_Brake">
                                            <Form.Label>Type Brake</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Type_Brake"
                                                value={formData.Type_Brake}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group controlId="Type_Mold">
                                            <Form.Label>Type Mold</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Type_Mold"
                                                value={formData.Type_Mold}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Time_Per_Mold">
                                            <Form.Label>Time Per Mold</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Time_Per_Mold"
                                                value={formData.Time_Per_Mold}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Mold_Per_8_Hour">
                                            <Form.Label>Mold Per 8 Hour</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Mold_Per_8_Hour"
                                                value={formData.Mold_Per_8_Hour}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Remark">
                                            <Form.Label>Remark</Form.Label>
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
                </Content>
                <FooterComponent />
            </Layout>
        </Layout>
    );
};

export default EditWip;
