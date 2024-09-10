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

const EditFg = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthContext();

    const [formData, setFormData] = useState({
        Code_Fg: '',
        Name_Fg: '',
        Model: '',
        Part_No: '',
        OE_Part_No: '',
        Code: '',
        Chem_Grade: '',
        Pcs_Per_Set: '',
        Box_No: '',
        Weight_Box: '',
        Box_Erp_No: '',
        Rivet_No: '',
        Weight_Revit_Per_Set: '',
        Num_Revit_Per_Set: '',
        Revit_Erp_No: '',
        Remark: ''
    });

    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    const fetchFgData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${env.API_URL}/api/fg/${id}`, {
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
                        Model: data.Model || '',
                        Part_No: data.Part_No || '',
                        OE_Part_No: data.OE_Part_No || '',
                        Code: data.Code || '',
                        Chem_Grade: data.Chem_Grade || '',
                        Pcs_Per_Set: data.Pcs_Per_Set || '',
                        Box_No: data.Box_No || '',
                        Weight_Box: data.Weight_Box || '',
                        Box_Erp_No: data.Box_Erp_No || '',
                        Rivet_No: data.Rivet_No || '',
                        Weight_Revit_Per_Set: data.Weight_Revit_Per_Set || '',
                        Num_Revit_Per_Set: data.Num_Revit_Per_Set || '',
                        Revit_Erp_No: data.Revit_Erp_No || '',
                        Remark: data.Remark || ''
                    });
                } else {
                    setModalTitle('No Data Found');
                    setModalMessage(json.msg);
                    setModalVisible(true);
                }
            } else {
                setModalTitle('Fetch Error');
                setModalMessage(`Failed to fetch FG data: ${json.msg}`);
                setModalVisible(true);
            }
        } catch (error) {
            setModalTitle('Fetch Error');
            setModalMessage(`Error fetching FG data: ${error.message}`);
            setModalVisible(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFgData();
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
            const response = await fetch(`${env.API_URL}/api/fg/update/${id}`, {
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
                    navigate('/fg');
                }, 1000);
            } else {
                setModalTitle('Update Error');
                setModalMessage(`Failed to update FG: ${json.msg}`);
                setModalVisible(true);
            }
        } catch (error) {
            setModalTitle('Update Error');
            setModalMessage(`Error updating FG: ${error.message}`);
            setModalVisible(true);
        } finally {
            setLoading(false);
        }
    };

    const handleOnClick = () => {
        navigate('/fg');
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
                        <h2>Edit FG</h2>
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

                                        <Form.Group controlId="Model">
                                            <Form.Label>Model</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Model"
                                                value={formData.Model}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Part_No">
                                            <Form.Label>Part No</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Part_No"
                                                value={formData.Part_No}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="OE_Part_No">
                                            <Form.Label>OE Part No</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="OE_Part_No"
                                                value={formData.OE_Part_No}
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

                                        <Form.Group controlId="Chem_Grade">
                                            <Form.Label>Chemical Grade</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Chem_Grade"
                                                value={formData.Chem_Grade}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group controlId="Pcs_Per_Set">
                                            <Form.Label>Pcs Per Set</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Pcs_Per_Set"
                                                value={formData.Pcs_Per_Set}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Box_No">
                                            <Form.Label>Box No</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Box_No"
                                                value={formData.Box_No}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Weight_Box">
                                            <Form.Label>Weight Box</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Weight_Box"
                                                value={formData.Weight_Box}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Box_Erp_No">
                                            <Form.Label>Box Erp No</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Box_Erp_No"
                                                value={formData.Box_Erp_No}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Rivet_No">
                                            <Form.Label>Rivet No</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Rivet_No"
                                                value={formData.Rivet_No}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Weight_Revit_Per_Set">
                                            <Form.Label>Weight Revit Per Set</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Weight_Revit_Per_Set"
                                                value={formData.Weight_Revit_Per_Set}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Num_Revit_Per_Set">
                                            <Form.Label>Num Revit Per Set</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Num_Revit_Per_Set"
                                                value={formData.Num_Revit_Per_Set}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Revit_Erp_No">
                                            <Form.Label>Revit Erp No</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Revit_Erp_No"
                                                value={formData.Revit_Erp_No}
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

                                <Button variant="primary" type="submit" disabled={loading}>
                                    {loading ? <Spinner animation="border" size="sm" /> : 'Update FG'}
                                </Button>
                                <Button variant="secondary" onClick={handleOnClick} className="ml-2">
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
                            <Button variant="primary" onClick={() => setModalVisible(false)}>
                                Close
                            </Button>
                        </BootstrapModal.Footer>
                    </BootstrapModal>
                </Content>
                <FooterComponent />
            </Layout>
        </Layout>
    );
};

export default EditFg;
