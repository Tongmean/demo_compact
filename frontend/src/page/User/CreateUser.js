import React, { useState } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hook/useAuthContext';
import { Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import env from "react-dotenv";

const { Option } = Select;

const CreateUser = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [isPending, setIsPending] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuthContext(); // Retrieve user context

    const handleCloseModal = () => setShowModal(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsPending(true);

        const newUser = { email, password, role };

        try {
            const response = await fetch(`${env.API_URL}/api/user/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            const data = await response.json();
            // If client status != 200, then throw Error message (data.msg got from server-side)
            if (!response.ok) {
                throw new Error(data.msg || `HTTP error! Status: ${response.status}`);
            }

            // Success modal message from the server
            setModalContent(data.msg); // Use message from server-side
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
                navigate('/user');
            }, 2000); // Redirect after 2 seconds

        } catch (error) {
            // Error modal message from the server
            setModalContent(error.message || 'Please check the details and try again.');
            setShowModal(true);
        } finally {
            setIsPending(false);
        }
    };

    const handleOnClick = () => {
        navigate('/user');
    };

    return (

        <div>
            <div>
                <h2>Create New User</h2>
                <Form onSubmitCapture={handleSubmit} layout="vertical">
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className='col-xl-6 col-lg-6 col-md-12'>
                                <Form.Item label="Email">
                                    <Input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="Password">
                                    <Input
                                        type="text"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item label="Role">
                                    <Select
                                        required
                                        value={role}
                                        onChange={(value) => setRole(value)}
                                    >
                                        <Option value="admin">Admin</Option>
                                        <Option value="user">User</Option>
                                        {/* <Option value="creator">Creator</Option> */}
                                    </Select>
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
                                        {isPending ? 'Saving...' : 'Save User'}
                                    </Button>
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                </Form>
            </div>

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
        </div>
    );
};

export default CreateUser;
