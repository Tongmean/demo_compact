import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // AG Grid CSS
import 'ag-grid-community/styles/ag-theme-alpine.css'; // AG Grid theme
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { useAuthContext } from '../../hook/useAuthContext';
import { Modal, Button } from 'react-bootstrap'; // Import Bootstrap components
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const FgTable = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString(); // Local date format
    const { user } = useAuthContext(); // Retrieve user context
    const navigate = useNavigate(); // Initialize useNavigate hook

    // Define column definitions with initial fields and search feature
    const columnDefs = [
        {
            headerName: 'NO.',
            field: 'No',
            filter: 'agTextColumnFilter',
            checkboxSelection: true,
            headerCheckboxSelection: true,
        },
        { headerName: 'Code_Fg', field: 'Code_Fg', filter: 'agTextColumnFilter' },
        { headerName: 'Name_Fg', field: 'Name_Fg', filter: 'agTextColumnFilter' },
        { headerName: 'Remark', field: 'Remark', filter: 'agTextColumnFilter' },
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
                </div>
            ),
        }
    ];

    // Define the initial row data (sample data)
    const [rowData, setRowData] = useState();
    const [loading, setLoading] = useState(false); // Loading state
    const [gridApi, setGridApi] = useState(null);
    const [showModal, setShowModal] = useState(false); // Detail modal state
    const [modalData, setModalData] = useState(null); // Data for the detail modal
    const [showEditModal, setShowEditModal] = useState(false); // Edit modal state
    const [editData, setEditData] = useState(null); // Data for the edit modal
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Delete modal state
    const [deleteData, setDeleteData] = useState(null); // Data for the delete modal

    // Fetch data from API
    const fetchData = async () => {
        setLoading(true); // Start loading
        try {
            const response = await fetch('http://localhost:3030/api/fg', {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                }
            });
            const apiData = (await response.json()).data;
            
            const mappedData = apiData.map(item => ({
                No: item.id,
                Code_Fg: item.Code_Fg,
                Name_Fg: item.Name_Fg,
                Remark: item.Remark,
            }));
            setRowData(mappedData);
        } catch (error) {
            console.error("Error fetching data from API:", error);
        } finally {
            setLoading(false); // End loading
        }
    };

    // Delete data from API
    const deleteBomData = async (id) => {
        try {
            const response = await fetch(`http://localhost:3030/api/bom/deletebom/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                }
            });

            if (response.ok) {
                // Successfully deleted, now update the rowData state to remove the deleted row
                setRowData(prevData => prevData.filter(item => item.No !== id));
                console.log('Successfully deleted row with ID:', id);
            } else {
                console.error('Failed to delete row with ID:', id);
            }
        } catch (error) {
            console.error("Error deleting data from API:", error);
        }
    };

    // Export selected rows to Excel file
    const exportToExcel = () => {
        try {
            if (!gridApi) {
                throw new Error("Grid API is not available.");
            }
            const selectedRows = gridApi.getSelectedRows();
            if (selectedRows.length === 0) {
                alert('No rows selected for export.');
                return;
            }
            const customHeaders = {
                Code_Fg: 'Code_Fg',
                Name_Fg: 'Name_Fg',

                Remark: 'Remark'
            };
            const mappedData = selectedRows.map(row => ({
                'Code_Fg': row.Code_Fg,
                'Name_Fg': row.Name_Fg,
    
                'Remark': row.Remark
            }));
            const worksheet = XLSX.utils.json_to_sheet(mappedData, { header: Object.values(customHeaders) });
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'SelectedData');
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(file, `${formattedDate}_Bom.xlsx`);
        } catch (error) {
            console.error("Error exporting data to Excel:", error);
        }
    };

    // Handle showing details in the modal
    const handleShowDetails = (data) => {
        setModalData(data);
        setShowModal(true);
    };

    // Handle showing edit modal
    const handleShowEdit = (data) => {
        navigate(`/bom/${data.No}`); 
    };

    // Handle showing delete confirmation modal
    const handleShowDelete = (data) => {
        setDeleteData(data);
        setShowDeleteModal(true);
    };

    // Handle delete confirmation
    const handleDelete = () => {
        if (deleteData && deleteData.No) {
            deleteBomData(deleteData.No);
        }
        setShowDeleteModal(false);
    };

    // Handle AG Grid ready event
    const onGridReady = params => {
        setGridApi(params.api);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <div>
                <button onClick={exportToExcel} style={{ marginBottom: '10px' }}>
                    Export Selected Rows to Excel
                </button>
            </div>
            {loading ? (
                <div>Loading data, please wait...</div>
            ) : (
                <div className="ag-theme-alpine" style={{  height: 'calc(100vh - 100px)', width: '100%' }}>
                    <AgGridReact
                        columnDefs={columnDefs}
                        rowData={rowData}
                        rowSelection="multiple"
                        onGridReady={onGridReady}
                        // onGridReady={params => {
                        //     onGridReady(params);
                        //     params.api.sizeColumnsToFit(); // Optional: to initially fit columns to grid width
                        //     const allColumnIds = [];
                        //     params.columnApi.getAllColumns().forEach(column => {
                        //         allColumnIds.push(column.getId());
                        //     });
                        //     params.columnApi.autoSizeColumns(allColumnIds);
                        // }}
                        // domLayout='autoHeight'
                        pagination={true}
                        paginationPageSize={20}
                    />
                </div>
            )}

            {/* Modal for showing row details */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Detail Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalData && (
                        <div>
                            <p><strong>No:</strong> {modalData.No}</p>
                            <p><strong>Code_Fg:</strong> {modalData.Code_Fg}</p>
                            <p><strong>Name_Fg:</strong> {modalData.Name_Fg}</p>
          
                            <p><strong>Remark:</strong> {modalData.Remark}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for confirming delete */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete <strong>{deleteData ? deleteData.Name_Fg : ''}</strong>?</p>
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

export default FgTable;
