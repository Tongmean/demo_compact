import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { useAuthContext } from '../../hook/useAuthContext';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { convertToUTCPlus7 } from '../../utility/Moment-timezone';
import env from "react-dotenv";

const BomTable = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
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
        { headerName: 'Code_Fg', field: 'Code_Fg', filter: 'agTextColumnFilter' },
        { headerName: 'Name_Fg', field: 'Name_Fg', filter: 'agTextColumnFilter' },
        { headerName: 'Code_Dr', field: 'Code_Dr', filter: 'agTextColumnFilter' },
        { headerName: 'Name_Dr', field: 'Name_Dr', filter: 'agTextColumnFilter' },
        { headerName: 'Code_Wip', field: 'Code_Wip', filter: 'agTextColumnFilter' },
        { headerName: 'Name_Wip', field: 'Name_Wip', filter: 'agTextColumnFilter' },
        { headerName: 'Ra_Wip', field: 'R_Wip', filter: 'agTextColumnFilter' },
        { headerName: 'Ra_L', field: 'R_L', filter: 'agTextColumnFilter' },
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
                    {user.user.role === "admin" && (
                        <>
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
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteData, setDeleteData] = useState(null);

    const [showSuccessAlert, setShowSuccessAlert] = useState(false); //Alert Dellete success
    const [successAlertMessage, setSuccessAlertMessage] = useState('');
    //copy
    const [columnApi, setColumnApi] = useState(null);
    const fetchData = async () => {
        setLoading(true);
        setError(null); // Reset error state before fetching
        try {
            const response = await fetch(`${env.API_URL}/api/bom/`, {
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
                Code_Fg: item.Code_Fg,
                Name_Fg: item.Name_Fg,
                Code_Dr: item.Code_Dr,
                Name_Dr: item.Name_Dr,
                Code_Wip: item.Code_Wip,
                Name_Wip: item.Name_Wip,
                R_Wip: item.Ra_Wip,
                R_L: item.Ra_L,
                Remark: item.Remark,
                CreateAt: item.CreateAt,
                UpdateAt: item.UpdateAt,
            }));
            setRowData(mappedData);
        } catch (error) {
            setError(error.message);
            console.log("Error fetching data from API:", error.msg);
            alert(error.message)
        } finally {
            setLoading(false);
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
                console.log('Successfully deleted row with ID:', id);
                setShowSuccessAlert(true);
                setSuccessAlertMessage(`BOM with ID: ${id} deleted successfully!`);
                setTimeout(() => setShowSuccessAlert(false), 1500); // Hide alert after 1.5 seconds

            } else {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Failed to delete the data');
            }
        } catch (error) {
            console.log("Error deleting data from API:", error.message);
            alert(error.message)
        }
    };

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
                Code_Dr: 'Code_Dr',
                Name_Dr: 'Name_Dr',
                Code_Wip: 'Code_Wip',
                Name_Wip: 'Name_Wip',
                R_Wip: 'Ra_Wip',
                R_L: 'Ra_L',
                Remark: 'Remark'
            };
            const mappedData = selectedRows.map(row => ({
                'Code_Fg': row.Code_Fg,
                'Name_Fg': row.Name_Fg,
                'Code_Dr': row.Code_Dr,
                'Name_Dr': row.Name_Dr,
                'Code_Wip': row.Code_Wip,
                'Name_Wip': row.Name_Wip,
                'Ra_Wip': row.R_Wip,
                'Ra_L': row.R_L,
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

    const handleShowDetails = (data) => {
        setModalData(data);
        setShowModal(true);
    };

    const handleShowEdit = (data) => {
        navigate(`/bom/${data.No}`);
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
        setColumnApi(params.columnApi); // Add this line to set columnApi
        // params.api.sizeColumnsToFit(); // Auto-size columns to fit the grid container

    };

    const onSelectionChanged = () => {
        const selectedRows = gridApi.getSelectedRows();
        console.log('Selected rows:', selectedRows);
    
        // Call the function to copy the selected rows to the clipboard
        // copySelectedRowsToClipboard(selectedRows);
    };
    //copy
    const copySelectedRowsToClipboard = () => {
        
        const selectedRows = gridApi.getSelectedRows();
        console.log('rows selected to copy.', selectedRows);
        // Ensure rows is an array
        if (!Array.isArray(selectedRows) || selectedRows.length === 0) {
            console.log('No rows selected to copy.', selectedRows);
            return;
        }
        //destructuring No, CreateAt, UpdateAt 
        const cleanedRows = selectedRows.map(({ No, CreateAt,UpdateAt, ...rest }) => rest);
        // Convert the rows to a tab-separated string
        const tsvData = cleanedRows.map(row => {
            // Object.values(row) extracts all values from the row object
            return Object.values(row).join('\t');
        }).join('\n');

        // console.log(tsvData)
        // Use the Clipboard API to copy the data
        navigator.clipboard.writeText(tsvData)
            .then(() => {
                console.log('Copied to clipboard successfully.', );
                setShowSuccessAlert(true);
                setSuccessAlertMessage(`Copied to clipboard successfully.`);
                setTimeout(() => setShowSuccessAlert(false), 1000); // Hide alert after 1.5 seconds

            })
            .catch(err => {
                console.error('Failed to copy:', err);
            });
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
                {/* <button onClick={exportToExcel} style={{ marginBottom: '10px' }}>
                    Export Selected Rows to Excel
                </button> */}
                <button onClick={copySelectedRowsToClipboard} style={{ marginBottom: '10px', marginLeft: '10px' }}>
                    Copy Selected Rows to Clipboard
                </button>
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
                        enableRangeSelection={true}
                        suppressClipboardPaste={false} 
                        suppressMultiRangeSelection={false}
                        suppressCopySingleCellRanges={false} 
                        enableRangeHandle={true} 
                        onGridReady={onGridReady}
                        onSelectionChanged={onSelectionChanged}
                        pagination={true}
                        paginationPageSize={20}
                        defaultColDef={{
                            resizable: true,
                            sortable: true,
                            filter: true,
                            editable: true,
                        }}
                        
                    />
                </div>
            )}
    
            {/* Detail Modal */}
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
                            <p><strong>Code_Dr:</strong> {modalData.Code_Dr}</p>
                            <p><strong>Name_Dr:</strong> {modalData.Name_Dr}</p>
                            <p><strong>Code_Wip:</strong> {modalData.Code_Wip}</p>
                            <p><strong>Name_Wip:</strong> {modalData.Name_Wip}</p>
                            <p><strong>Ra_Wip:</strong> {modalData.R_Wip}</p>
                            <p><strong>Ra_L:</strong> {modalData.R_L}</p>
                            <p><strong>Remark:</strong> {modalData.Remark}</p>
                            <p><strong>Create At:</strong> {convertToUTCPlus7(modalData.CreateAt)}</p>
                            <p><strong>Update At:</strong> {convertToUTCPlus7(modalData.UpdateAt)}</p>
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
    
            {/* Delete Confirmation Modal */}
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
    
            {/* Success Alert Modal */}
            <Modal show={showSuccessAlert} onHide={() => setShowSuccessAlert(false)} size="md">
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {successAlertMessage}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
    
};

export default BomTable;
