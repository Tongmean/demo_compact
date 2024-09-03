import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import Sidebar from '../../component/Sidebar';
import HeaderComponent from '../../component/Header';
import FooterComponent from '../../component/Footer';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hook/useAuthContext';
import { Form, Button, Spinner, Row, Col } from 'react-bootstrap'; // Import Row and Col
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

    const fetchBomData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3030/api/bom/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                }
            });

            if (response.ok) {
                const result = await response.json();
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
                console.error('Failed to fetch data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching BOM data:', error);
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
            const response = await fetch(`http://localhost:3030/api/bom/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('BOM updated successfully!');
                navigate('/bom');
            } else {
                alert('Failed to update BOM.');
            }
        } catch (error) {
            console.error('Error updating BOM:', error);
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
        </Layout>
    );
};

export default EditBom;
