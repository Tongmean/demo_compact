import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useAuthContext } from '../../hook/useAuthContext';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import env from "react-dotenv";

const UserTable = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();

    const columnDefs = [
        {
            headerName: 'NO.',
            field: 'No',
            filter: 'agTextColumnFilter',
            checkboxSelection: true,
            headerCheckboxSelection: true,
        },
        { headerName: 'Email', field: 'email', filter: 'agTextColumnFilter' },
        { headerName: 'password', field: 'password', filter: 'agTextColumnFilter' },
        { headerName: 'Role', field: 'role', filter: 'agTextColumnFilter' },
        {
            headerName: 'Actions',
            field: 'actions',
            cellRenderer: (params) => (
                <div>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleShowDetails(params.data)}
                        style={{ marginRight: '5px' }}
                    >
                        Detail
                    </button>
                    {/* <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleShowEdit(params.data)}
                        style={{ marginRight: '5px' }}
                    >
                        Edit
                    </button> */}
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleShowDelete(params.data)}
                    >
                        Delete
                    </button>
                </div>
            ),
        }
    ];

    const [rowData, setRowData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteData, setDeleteData] = useState(null);
    // const [showEditModal, setShowEditModal] = useState(false);
    // const [editData, setEditData] = useState(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackType, setFeedbackType] = useState('success');

    const fetchData = async () => {
        setLoading(true);
        setError(null); // Reset error state before fetching
        try {
            const response = await fetch(`${env.API_URL}/api/user`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                }
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'An unknown error occurred');
            }
    
            const apiData = (await response.json()).data;
            console.log('apiData', apiData); // Log the full response
    
            const mappedData = apiData.map(item => ({
                No: item.id,
                email: item.email,
                password: item.password,
                role: item.role,
                CreateAt: item.CreateAt,
                UpdateAt: item.Update_At,
            }));
            
            setRowData(mappedData);
            console.log(rowData)
        } catch (error) {
            setError(error.message);
            console.log("Error fetching data from API:", error.message);
            showFeedback('error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteUserData = async (id) => {
        try {
            const response = await fetch(`${env.API_URL}/api/user/delete/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                }
            });

            if (response.ok) {
                setRowData(prevData => prevData.filter(item => item.No !== id));
                console.log('Successfully deleted row with ID:', id);
                showFeedback('success', `User with ID: ${id} deleted successfully!`);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Failed to delete the data');
            }
        } catch (error) {
            console.log("Error deleting data from API:", error.message);
            showFeedback('error', error.message);
        }
    };

    const updateUserData = async (id, updatedData) => {
        try {
            const response = await fetch(`${env.API_URL}/api/users/update/${id}`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setRowData(prevData =>
                    prevData.map(item =>
                        item.No === id ? updatedUser.data : item
                    )
                );
                console.log('Successfully updated user with ID:', id);
                showFeedback('success', `User with ID: ${id} updated successfully!`);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Failed to update the data');
            }
        } catch (error) {
            console.log("Error updating data from API:", error.message);
            showFeedback('error', error.message);
        }
    };

    const handleShowDetails = (data) => {
        setModalData(data);
        setShowModal(true);
    };


    const handleShowDelete = (data) => {
        setDeleteData(data);
        setShowDeleteModal(true);
    };



    const handleDelete = () => {
        if (deleteData && deleteData.No) {
            deleteUserData(deleteData.No);
        }
        setShowDeleteModal(false);
    };

    const showFeedback = (type, message) => {
        setFeedbackType(type);
        setFeedbackMessage(message);
        setShowFeedbackModal(true);
        setTimeout(() => setShowFeedbackModal(false), 2000); // Hide feedback modal after 3 seconds
    };

    const onGridReady = params => {
        setGridApi(params.api);
    };

    const onSelectionChanged = () => {
        const selectedRows = gridApi.getSelectedRows();
        console.log('Selected rows:', selectedRows);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <div>
            </div>
            {loading ? (
                <div>Loading data, please wait...</div>
            ) : error ? (
                <div style={{ color: 'red' }}>{error}</div>
            ) : (
                <div className="ag-theme-alpine" style={{ height: 'calc(100vh - 100px)', width: '100%' }}>
                    <AgGridReact
                        columnDefs={columnDefs}
                        rowData={rowData}
                        rowSelection="multiple"
                        suppressClipboardPaste={false}
                        suppressMultiRangeSelection={false}
                        suppressCopySingleCellRanges={false}
                  
                        onGridReady={onGridReady}
                        onSelectionChanged={onSelectionChanged}
                        pagination={true}
                        paginationPageSize={20}
                        defaultColDef={{
                            resizable: true,
                            sortable: true,
                            filter: true,
                        }}
                    />
                </div>
            )}

            {/* Detail Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>User Detail</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalData && (
                        <div>
                            <p><strong>No:</strong> {modalData.No}</p>
                            <p><strong>Email:</strong> {modalData.email}</p>
                            <p><strong>Role:</strong> {modalData.role}</p>
                            <p><strong>Create At:</strong> {modalData.CreateAt}</p>
                            <p><strong>Update At:</strong> {modalData.UpdateAt}</p>
                            {/* Add more fields as needed */}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Modal */}
            {/* <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editData && (
                        <Form>
                            <Form.Group controlId="formEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={editData.email}
                                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formRole">
                                <Form.Label>Role</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={editData.role}
                                    onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                                >
                                    <option selected value="-">--</option>
                                    <option value="creator">Creator</option>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleEditSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal> */}

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this user?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Feedback Modal */}
            <Modal show={showFeedbackModal} onHide={() => setShowFeedbackModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Message</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={`alert alert-${feedbackType}`}>
                        {feedbackMessage}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowFeedbackModal(false)}>
                        Cancel
                    </Button>
                </Modal.Footer>
          
            </Modal>
        </div>
    );
};

export default UserTable;
