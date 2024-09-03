import React, { useState } from 'react';
import { Layout, Form, Input, Button, Alert } from 'antd';
import Sidebar from '../../component/Sidebar';
import HeaderComponent from '../../component/Header';
import FooterComponent from '../../component/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hook/useAuthContext';

const { Content } = Layout;

const CreateBom = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [Code_Fg, setCode_Fg] = useState('');
    const [Name_Fg, setName_Fg] = useState('');
    const [Code_Dr, setCode_Dr] = useState('');
    const [Name_Dr, setName_Dr] = useState('');
    const [Code_Wip, setCode_Wip] = useState('');
    const [Name_Wip, setName_Wip] = useState('');
    const [Ra_Wip, setRa_Wip] = useState('');
    const [Ra_L, setRa_L] = useState('');
    const [Remark, setRemark] = useState('');
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user } = useAuthContext(); // Retrieve user context

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsPending(true);

        const bom = { Code_Fg, Name_Fg, Code_Dr, Name_Dr, Code_Wip, Name_Wip, Ra_Wip, Ra_L, Remark };

        // console.log('Submitting BOM:', bom); // Debugging line

        try {
            const response = await fetch('http://localhost:3030/api/bom/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json' // Ensure correct content type
                },
                body: JSON.stringify(bom),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('New BOM Created:', data);
            alert('New BOM Created');
            navigate('/bom');

        } catch (error) {
            // console.error('Error:', error);
            setError('Please check the details and try again.');
        } finally {
            setIsPending(false);
        }
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
                        <h2>Create New BOM</h2>
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
                                        <Form.Item label="Code Dr">
                                            <Input
                                                type="text"
                                                required
                                                value={Code_Dr}
                                                onChange={(e) => setCode_Dr(e.target.value)}
                                            />
                                        </Form.Item>
                                        <Form.Item label="Name Dr">
                                            <Input
                                                type="text"
                                                required
                                                value={Name_Dr}
                                                onChange={(e) => setName_Dr(e.target.value)}
                                            />
                                        </Form.Item>
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
                                    </div>
                                    <div className='col-xl-6 col-lg-6 col-md-12'>
                                        <Form.Item label="Ra Wip">
                                            <Input
                                                type="text"
                                                required
                                                value={Ra_Wip}
                                                onChange={(e) => setRa_Wip(e.target.value)}
                                            />
                                        </Form.Item>
                                        <Form.Item label="Ra L">
                                            <Input
                                                type="text"
                                                required
                                                value={Ra_L}
                                                onChange={(e) => setRa_L(e.target.value)}
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
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                disabled={isPending}
                                            >
                                                {isPending ? 'Saving...' : 'Save Data'}
                                            </Button>
                                        </Form.Item>
                                        {error && <Alert message={error} type="error" />}
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </div>
                </Content>
                <FooterComponent />
            </Layout>
        </Layout>
    );
};

export default CreateBom;
