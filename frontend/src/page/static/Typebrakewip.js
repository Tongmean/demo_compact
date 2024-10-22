import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { useAuthContext } from '../../hook/useAuthContext';
import { Modal, Button, Alert } from 'react-bootstrap';
import env from "react-dotenv";

const Typebrakewip = () => {
    const { user } = useAuthContext();

    const columnDefs = [
        {
            headerName: 'NO.',
            field: 'No',
            filter: 'agTextColumnFilter',
            checkboxSelection: true,
            headerCheckboxSelection: true,
        },
        { headerName: 'Type_Brake', field: 'Type_Brake', filter: 'agTextColumnFilter' },
        {
            headerName: 'Actions',
            field: 'actions',
            cellRenderer: (params) => (
                <div>
                    {user.user.role === "admin" && (
                        <>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleShowDelete(params.data)}
                            >
                                Delete
                            </button>
                        </>
                    )}
                </div>
            ),
        }
    ];

    const [rowData, setRowData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteData, setDeleteData] = useState(null);

    const [showSuccessAlert, setShowSuccessAlert] = useState(false); //Alert Dellete success
    const [successAlertMessage, setSuccessAlertMessage] = useState('');
    
    const [newTypeBrake, setNewTypeBrake] = useState(''); // State for adding new record

    const fetchData = async () => {
        setLoading(true);
        setError(null); // Reset error state before fetching
        try {
            const response = await fetch(`${env.API_URL}/api/static/wip/typebrake`, {
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
            const mappedData = apiData.map(item => ({
                No: item.id,
                Type_Brake: item.Type_Brake,
            }));

            setRowData(mappedData);
        } catch (error) {
            setError(error.message);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const addNewRecord = async () => {
        try {
            const response = await fetch(`${env.API_URL}/api/static/wip/typebrake`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Type_Brake: newTypeBrake })
            });

            if (response.ok) {
                const newRecord = await response.json();
                setRowData(prevData => [...prevData, { No: newRecord.id, Type_Brake: newRecord.Type_Brake }]);
                setShowSuccessAlert(true);
                setSuccessAlertMessage('New Type Brake added successfully!');
                setTimeout(() => setShowSuccessAlert(false), 1500);
                setShowModal(false);
                setNewTypeBrake('');
            } else {
                throw new Error('Failed to add new record');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const deleteBomData = async (id) => {
        try {
            const response = await fetch(`${env.API_URL}/api/bom/deletebom/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                }
            });

            if (response.ok) {
                setRowData(prevData => prevData.filter(item => item.No !== id));
                setShowSuccessAlert(true);
                setSuccessAlertMessage(`BOM with ID: ${id} deleted successfully!`);
                setTimeout(() => setShowSuccessAlert(false), 1500); // Hide alert after 1.5 seconds
            } else {
                throw new Error('Failed to delete the data');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const handleShowDelete = (data) => {
        setDeleteData(data);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (deleteData && deleteData.No) {
            deleteBomData(deleteData.No);
        }
        setShowDeleteModal(false);
    };

    const onGridReady = params => {
        setGridApi(params.api);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <div>
                <Button onClick={() => setShowModal(true)} style={{ marginBottom: '10px' }} className='btn btn-secondary'>
                    เพิ่มรายการลักษณะผ้าพิมพ์ร้อน
                </Button>
            </div>

            {loading ? (
                <div>Loading data, please wait...</div>
            ) : error ? (
                <div style={{ color: 'red' }}>{error}</div>
            ) : (
                <div className="ag-theme-alpine" style={{ height: 'calc(50vh)', width: '100%' }}>
                    <AgGridReact
                        columnDefs={columnDefs}
                        rowData={rowData}
                        rowSelection="multiple"
                        onGridReady={onGridReady}
                        defaultColDef={{
                            resizable: true,
                            sortable: true,
                            filter: true,
                        }}
                    />
                </div>
            )}

            {/* Success Alert */}
            {showSuccessAlert && (
                <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
                    {successAlertMessage}
                </Alert>
            )}

            {/* Add New Record Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Type Brake</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input
                        type="text"
                        className="form-control"
                        value={newTypeBrake}
                        onChange={(e) => setNewTypeBrake(e.target.value)}
                        placeholder="Enter new Type Brake"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addNewRecord}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this Type Brake?
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
        </div>
    );
};

export default Typebrakewip;
