import React, { useState } from 'react';
import { MDBContainer, MDBCol, MDBRow } from 'mdb-react-ui-kit';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import useLogin from '../hook/useLogin';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { error, isLoading, login } = useLogin();
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);

        if (!success) {
            setShowErrorModal(true);
        } else {
            navigate('/home');
        }
    };

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
    };

    return (
        <MDBContainer fluid className="p-3 my-5 h-custom">
            <MDBRow className="d-flex justify-content-center align-items-center h-100">
                <MDBCol col="12" md="6">
                    <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                        className="img-fluid"
                        alt="Login illustration"
                    />
                </MDBCol>
                <MDBCol col="12" md="6" className="d-flex justify-content-center">
                    <form onSubmit={handleSubmit} style={{ width: '80%', maxWidth: '400px' }}>
                        <label htmlFor="exampleInputEmail1">Email</label>
                        <input
                            className="form-control"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label htmlFor="exampleInputPassword1">Password</label>
                        <input
                            className="form-control"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <div className="text-center text-md-start mt-4 pt-2">
                            <Button className="mb-0 px-5" size="lg" type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                ) : (
                                    'Login'
                                )}
                            </Button>
                        </div>
                    </form>
                </MDBCol>
            </MDBRow>

            {/* Error Modal */}
            <Modal show={showErrorModal} onHide={handleCloseErrorModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>{error}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseErrorModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </MDBContainer>
    );
};

export default LoginPage;
