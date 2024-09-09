import React, { useState } from 'react';
import { Layout, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hook/useAuthContext';
import { Modal } from 'react-bootstrap';
import Sidebar from '../../component/Sidebar';
import HeaderComponent from '../../component/Header';
import FooterComponent from '../../component/Footer';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

const { Content } = Layout;

const CreateDr = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [form, setForm] = useState({
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
    const [isPending, setIsPending] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuthContext();

    const handleCloseModal = () => setShowModal(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsPending(true);

        try {
            const response = await fetch('http://localhost:3030/api/dr/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || `HTTP error! Status: ${response.status}`);
            }

            setModalContent(data.msg);
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
                navigate('/dr');
            }, 2000);

        } catch (error) {
            setModalContent(error.message || 'Please check the details and try again.');
            setShowModal(true);
        } finally {
            setIsPending(false);
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
                        margin: '24px 16px 0',
                        padding: '24px',
                        background: '#ffffff',
                        borderRadius: '4px',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <div>
                        <h2>Create New DR</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="Code_Dr" className="form-label">Code DR</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Code_Dr"
                                                name="Code_Dr"
                                                value={form.Code_Dr}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="Name_Dr" className="form-label">Name DR</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Name_Dr"
                                                name="Name_Dr"
                                                value={form.Name_Dr}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="Name_Wip" className="form-label">Name WIP</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Name_Wip"
                                                name="Name_Wip"
                                                value={form.Name_Wip}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="Name_Fg_1" className="form-label">Name FG 1</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Name_Fg_1"
                                                name="Name_Fg_1"
                                                value={form.Name_Fg_1}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="Demension" className="form-label">Demension</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Demension"
                                                name="Demension"
                                                value={form.Demension}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="Type_Brake" className="form-label">Type Brake</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Type_Brake"
                                                name="Type_Brake"
                                                value={form.Type_Brake}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="Chem_Grade" className="form-label">Chemical Grade</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Chem_Grade"
                                                name="Chem_Grade"
                                                value={form.Chem_Grade}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="Status_Dr" className="form-label">Status DR</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Status_Dr"
                                                name="Status_Dr"
                                                value={form.Status_Dr}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="No_Grind" className="form-label">No Grind</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="No_Grind"
                                                name="No_Grind"
                                                value={form.No_Grind}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="Num_Hole" className="form-label">Num Hole</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Num_Hole"
                                                name="Num_Hole"
                                                value={form.Num_Hole}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="No_Jig_Drill" className="form-label">No Jig Drill</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="No_Jig_Drill"
                                                name="No_Jig_Drill"
                                                value={form.No_Jig_Drill}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="No_Drill" className="form-label">No Drill</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="No_Drill"
                                                name="No_Drill"
                                                value={form.No_Drill}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="No_Reamer" className="form-label">No Reamer</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="No_Reamer"
                                                name="No_Reamer"
                                                value={form.No_Reamer}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="Code" className="form-label">Code</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Code"
                                                name="Code"
                                                value={form.Code}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="Remark" className="form-label">Remark</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Remark"
                                                name="Remark"
                                                value={form.Remark}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="Color" className="form-label">Color</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Color"
                                                name="Color"
                                                value={form.Color}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="Color_Spray" className="form-label">Color Spray</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Color_Spray"
                                                name="Color_Spray"
                                                value={form.Color_Spray}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="Grind_Back" className="form-label">Grind Back</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Grind_Back"
                                                name="Grind_Back"
                                                value={form.Grind_Back}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="Grind_Front" className="form-label">Grind Front</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Grind_Front"
                                                name="Grind_Front"
                                                value={form.Grind_Front}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="Grind_Detail" className="form-label">Grind Detail</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Grind_Detail"
                                                name="Grind_Detail"
                                                value={form.Grind_Detail}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="Drill" className="form-label">Drill</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Drill"
                                                name="Drill"
                                                value={form.Drill}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="Baat" className="form-label">Baat</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Baat"
                                                name="Baat"
                                                value={form.Baat}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="Ji_Hou" className="form-label">Ji Hou</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Ji_Hou"
                                                name="Ji_Hou"
                                                value={form.Ji_Hou}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="Fon_Hou" className="form-label">Fon Hou</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Fon_Hou"
                                                name="Fon_Hou"
                                                value={form.Fon_Hou}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="Tha_Khob" className="form-label">Tha Khob</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Tha_Khob"
                                                name="Tha_Khob"
                                                value={form.Tha_Khob}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="Cut" className="form-label">Cut</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Cut"
                                                name="Cut"
                                                value={form.Cut}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="Form" className="form-label">Form</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Form"
                                                name="Form"
                                                value={form.Form}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3">
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? 'Submitting...' : 'Submit'}
                                </Button>
                                <Button type="button" onClick={handleOnClick} className="ms-3">
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </Content>
            </Layout>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Notification</Modal.Title>
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

export default CreateDr;
