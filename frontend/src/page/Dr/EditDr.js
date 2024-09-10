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

const EditDr = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthContext();

    const [formData, setFormData] = useState({
        Code_Dr: '',
        Name_Dr: '',
        Name_Wip: '',
        Name_Fg_1: '',
        Demension: '',
        Type_Brake: '',
        Chem_Grade: '',
        Status_Dr: '',
        No_Grind: '',
        Num_Hole: '',
        No_Jig_Drill: '',
        No_Drill: '',
        No_Reamer: '',
        Code: '',
        Remark: '',
        Color: '',
        Color_Spray: '',
        Grind_Back: '',
        Grind_Front: '',
        Grind_Detail: '',
        Drill: '',
        Baat: '',
        Ji_Hou: '',
        Fon_Hou: '',
        Tha_Khob: '',
        Cut: '',
        Form: '',
    });

    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    const fetchDrData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${env.API_URL}/api/dr/${id}`, {
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
                        Code_Dr: data.Code_Dr || '',
                        Name_Dr: data.Name_Dr || '',
                        Name_Wip: data.Name_Wip || '',
                        Name_Fg_1: data.Name_Fg_1 || '',
                        Demension: data.Demension || '',
                        Type_Brake: data.Type_Brake || '',
                        Chem_Grade: data.Chem_Grade || '',
                        Status_Dr: data.Status_Dr || '',
                        No_Grind: data.No_Grind || '',
                        Num_Hole: data.Num_Hole || '',
                        No_Jig_Drill: data.No_Jig_Drill || '',
                        No_Drill: data.No_Drill || '',
                        No_Reamer: data.No_Reamer || '',
                        Code: data.Code || '',
                        Remark: data.Remark || '',
                        Color: data.Color || '',
                        Color_Spray: data.Color_Spray || '',
                        Grind_Back: data.Grind_Back || '',
                        Grind_Front: data.Grind_Front || '',
                        Grind_Detail: data.Grind_Detail || '',
                        Drill: data.Drill || '',
                        Baat: data.Baat || '',
                        Ji_Hou: data.Ji_Hou || '',
                        Fon_Hou: data.Fon_Hou || '',
                        Tha_Khob: data.Tha_Khob || '',
                        Cut: data.Cut || '',
                        Form: data.Form || '',
                    });
                } else {
                    setModalTitle('No Data Found');
                    setModalMessage(json.msg);
                    setModalVisible(true);
                }
            } else {
                setModalTitle('Fetch Error');
                setModalMessage(`Failed to fetch DR data: ${json.msg}`);
                setModalVisible(true);
            }
        } catch (error) {
            setModalTitle('Fetch Error');
            setModalMessage(`Error fetching DR data: ${error.message}`);
            setModalVisible(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrData();
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
            const response = await fetch(`${env.API_URL}/api/dr/update/${id}`, {
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
                    navigate('/dr');
                }, 1000);

            } else {
                setModalTitle('Update Error');
                setModalMessage(`Failed to update DR: ${json.msg}`);
                setModalVisible(true);
            }
        } catch (error) {
            setModalTitle('Update Error');
            setModalMessage(`Error updating DR: ${error.message}`);
            setModalVisible(true);
        } finally {
            setLoading(false);
        }
    };

    const handleOnClick = () => {
        navigate('/dr');
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
                        <h2>Edit DR</h2>
                        {loading ? (
                            <Spinner animation="border" variant="primary" />
                        ) : (
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group controlId="Code_Dr">
                                            <Form.Label>Code Dr</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Code_Dr"
                                                value={formData.Code_Dr}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Name_Dr">
                                            <Form.Label>Name Dr</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Name_Dr"
                                                value={formData.Name_Dr}
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
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Name_Fg_1">
                                            <Form.Label>Name Fg 1</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Name_Fg_1"
                                                value={formData.Name_Fg_1}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Demension">
                                            <Form.Label>Demension</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Demension"
                                                value={formData.Demension}
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

                                        <Form.Group controlId="Chem_Grade">
                                            <Form.Label>Chem Grade</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Chem_Grade"
                                                value={formData.Chem_Grade}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="Status_Dr">
                                            <Form.Label>Status Dr</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Status_Dr"
                                                value={formData.Status_Dr}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="No_Grind">
                                            <Form.Label>No Grind</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="No_Grind"
                                                value={formData.No_Grind}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Num_Hole">
                                            <Form.Label>Num Hole</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Num_Hole"
                                                value={formData.Num_Hole}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="No_Jig_Drill">
                                            <Form.Label>No Jig Drill</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="No_Jig_Drill"
                                                value={formData.No_Jig_Drill}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="No_Drill">
                                            <Form.Label>No Drill</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="No_Drill"
                                                value={formData.No_Drill}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="No_Reamer">
                                            <Form.Label>No Reamer</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="No_Reamer"
                                                value={formData.No_Reamer}
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

                                    <Col md={6}>


                                        <Form.Group controlId="Color">
                                            <Form.Label>Color</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Color"
                                                value={formData.Color}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Color_Spray">
                                            <Form.Label>Color Spray</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Color_Spray"
                                                value={formData.Color_Spray}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Grind_Back">
                                            <Form.Label>Grind Back</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Grind_Back"
                                                value={formData.Grind_Back}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Grind_Front">
                                            <Form.Label>Grind Front</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Grind_Front"
                                                value={formData.Grind_Front}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Grind_Detail">
                                            <Form.Label>Grind Detail</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Grind_Detail"
                                                value={formData.Grind_Detail}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Drill">
                                            <Form.Label>Drill</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Drill"
                                                value={formData.Drill}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Baat">
                                            <Form.Label>Baat</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Baat"
                                                value={formData.Baat}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Ji_Hou">
                                            <Form.Label>Ji Hou</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Ji_Hou"
                                                value={formData.Ji_Hou}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Fon_Hou">
                                            <Form.Label>Fon Hou</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Fon_Hou"
                                                value={formData.Fon_Hou}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Tha_Khob">
                                            <Form.Label>Tha Khob</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Tha_Khob"
                                                value={formData.Tha_Khob}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Cut">
                                            <Form.Label>Cut</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Cut"
                                                value={formData.Cut}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="Form">
                                            <Form.Label>Form</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Form"
                                                value={formData.Form}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Button variant="primary" type="submit" className="mt-3">
                                    Update
                                </Button>
                                <Button variant="secondary" onClick={handleOnClick} className="mt-3 ms-2">
                                    Cancel
                                </Button>
                            </Form>
                        )}
                    </div>
                </Content>
                <FooterComponent />
            </Layout>

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

export default EditDr;
