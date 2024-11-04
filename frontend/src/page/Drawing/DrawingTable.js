import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useAuthContext } from '../../hook/useAuthContext';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import env from "react-dotenv";

const DrawingTable = () => {
    // const currentDate = new Date();
    // const formattedDate = currentDate.toLocaleDateString();
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
        { headerName: 'Part_No', field: 'Part_No', filter: 'agTextColumnFilter' },
        { headerName: 'Filename', field: 'filename', filter: 'agTextColumnFilter' },
        // { headerName: 'Filepath', field: 'filepath', filter: 'agTextColumnFilter' },
        { headerName: 'Created At', field: 'CreatedAt', filter: 'agDateColumnFilter' },
        { headerName: 'Created By', field: 'CreatedBy', filter: 'agTextColumnFilter' },
        {
            headerName: 'Actions',
            field: 'actions',
            cellRenderer: (params) => (
                <div>
                    {user.user.role === "admin" && (
                        <>
                           
                            <a
                                href={`${env.API_URL}/Assets/Drawing/${encodeURIComponent(params.data.filename)}`} // Use drawingPath as the link
                                target="_blank" // Open link in new tab
                                rel="noopener noreferrer" // Security best practice
                                >
                                <button
                                    className="btn btn-info btn-sm"
                                    style={{ marginRight: '5px' }}
                                >
                                    D
                                </button>
                            </a>
                           
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleShowEdit(params.data)}
                                style={{ marginRight: '5px' }}
                            >
                                Edit
                            </button>
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
    const [columnApi, setColumnApi] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteData, setDeleteData] = useState(null);

    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successAlertMessage, setSuccessAlertMessage] = useState('');

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${env.API_URL}/api/drawing/`, {
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
                Part_No: item.Part_No,
                filename: item.filename,
                filepath: item.filepath,
                CreatedAt: item.CreatedAt,
                CreatedBy: item.CreatedBy,
                // Add other fields if necessary
            }));
            setRowData(mappedData);
        } catch (error) {
            setError(error.message);
            console.error("Error fetching data from API:", error.message);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteDrawingData = async (id) => {
        try {
            const response = await fetch(`${env.API_URL}/api/drawing/delete/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                }
            });

            if (response.ok) {
                setRowData(prevData => prevData.filter(item => item.No !== id));
                console.log('Successfully deleted row with ID:', id);
                setShowSuccessAlert(true);
                setSuccessAlertMessage(`Drawing with ID: ${id} deleted successfully!`);
                setTimeout(() => setShowSuccessAlert(false), 1500);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Failed to delete the data');
            }
        } catch (error) {
            console.error("Error deleting data from API:", error.message);
            alert(error.message);
        }
    };


    const handleShowEdit = (data) => {
        navigate(`/drawing/${data.No}`);
    };

    const handleShowDelete = (data) => {
        setDeleteData(data);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (deleteData && deleteData.No) {
            deleteDrawingData(deleteData.No);
        }
        setShowDeleteModal(false);
    };

    const onGridReady = params => {
        setGridApi(params.api);
        setColumnApi(params.columnApi);
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
                {/* <button onClick={exportToExcel} style={{ marginBottom: '10px' }}>
                    Export Selected Rows to Excel
                </button>
                <button onClick={copySelectedRowsToClipboard} style={{ marginBottom: '10px', marginLeft: '10px' }}>
                    Copy Selected Rows to Clipboard
                </button> */}
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
                            editable: false, // Assuming drawings are not editable directly in the grid
                        }}
                    />
                </div>
            )}


            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete <strong>{deleteData ? deleteData.filename : ''}</strong>?</p>
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

            {/* Success Alert Modal */}
            <Modal show={showSuccessAlert} onHide={() => setShowSuccessAlert(false)} size="md">
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {successAlertMessage}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSuccessAlert(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default DrawingTable;
