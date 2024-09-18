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

const DrTable = () => {
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
        { headerName: 'Code_Dr', field: 'Code_Dr', filter: 'agTextColumnFilter' },
        { headerName: 'Name_Dr', field: 'Name_Dr', filter: 'agTextColumnFilter' },
        { headerName: 'Name_Wip', field: 'Name_Wip', filter: 'agTextColumnFilter' },
        { headerName: 'Name_Fg_1', field: 'Name_Fg_1', filter: 'agTextColumnFilter' },
        { headerName: 'Demension', field: 'Demension', filter: 'agTextColumnFilter' },
        { headerName: 'Type_Brake', field: 'Type_Brake', filter: 'agTextColumnFilter' },
        { headerName: 'Chem_Grade', field: 'Chem_Grade', filter: 'agTextColumnFilter' },
        { headerName: 'Status_Dr', field: 'Status_Dr', filter: 'agTextColumnFilter' },
        { headerName: 'No_Grind', field: 'No_Grind', filter: 'agTextColumnFilter' },
        { headerName: 'Num_Hole', field: 'Num_Hole', filter: 'agTextColumnFilter' },
        { headerName: 'No_Jig_Drill', field: 'No_Jig_Drill', filter: 'agTextColumnFilter' },
        { headerName: 'No_Drill', field: 'No_Drill', filter: 'agTextColumnFilter' },
        { headerName: 'No_Reamer', field: 'No_Reamer', filter: 'agTextColumnFilter' },
        { headerName: 'Code', field: 'Code', filter: 'agTextColumnFilter' },
        { headerName: 'Remark', field: 'Remark', filter: 'agTextColumnFilter' },
        { headerName: 'Color', field: 'Color', filter: 'agTextColumnFilter' },
        // { headerName: 'Color_Spray', field: 'Color_Spray', filter: 'agTextColumnFilter' },
        // { headerName: 'Grind_Back', field: 'Grind_Back', filter: 'agTextColumnFilter' },
        // { headerName: 'Grind_Front', field: 'Grind_Front', filter: 'agTextColumnFilter' },
        // { headerName: 'Grind_Detail', field: 'Grind_Detail', filter: 'agTextColumnFilter' },
        // { headerName: 'Drill', field: 'Drill', filter: 'agTextColumnFilter' },
        // { headerName: 'Baat', field: 'Baat', filter: 'agTextColumnFilter' },
        // { headerName: 'Ji_Hou', field: 'Ji_Hou', filter: 'agTextColumnFilter' },
        // { headerName: 'Fon_Hou', field: 'Fon_Hou', filter: 'agTextColumnFilter' },
        // { headerName: 'Tha_Khob', field: 'Tha_Khob', filter: 'agTextColumnFilter' },
        // { headerName: 'Cut', field: 'Cut', filter: 'agTextColumnFilter' },
        // { headerName: 'Form', field: 'Form', filter: 'agTextColumnFilter' },
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

    const [showSuccessAlert, setShowSuccessAlert] = useState(false); 
    const [successAlertMessage, setSuccessAlertMessage] = useState('');

    const fetchData = async () => {
        setLoading(true);
        setError(null); 
        try {
            const response = await fetch(`${env.API_URL}/api/dr/`, {
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
                Code_Dr: item.Code_Dr,
                Name_Dr: item.Name_Dr,
                Name_Wip: item.Name_Wip,
                Name_Fg_1: item.Name_Fg_1,
                Demension: item.Demension,
                Type_Brake: item.Type_Brake,
                Chem_Grade: item.Chem_Grade,
                Status_Dr: item.Status_Dr,
                No_Grind: item.No_Grind,
                Num_Hole: item.Num_Hole,
                No_Jig_Drill: item.No_Jig_Drill,
                No_Drill: item.No_Drill,
                No_Reamer: item.No_Reamer,
                Code: item.Code,
                Remark: item.Remark,
                Color: item.Color,
                Color_Spray: item.Color_Spray,
                Grind_Back: item.Grind_Back,
                Grind_Front: item.Grind_Front,
                Grind_Detail: item.Grind_Detail,
                Drill: item.Drill,
                Baat: item.Baat,
                Ji_Hou: item.Ji_Hou,
                Fon_Hou: item.Fon_Hou,
                Tha_Khob: item.Tha_Khob,
                Cut: item.Cut,
                Form: item.Form,
                CreateAt: item.CreateAt,
                UpdateAt: item.UpdateAt,
            }));
            setRowData(mappedData);
        } catch (error) {
            setError(error.message);
            console.error("Error fetching data from API:", error.msg);
            alert(error.message)
        } finally {
            setLoading(false);
        }
    };

    const deleteDrData = async (id) => {
        try {
            const response = await fetch(`${env.API_URL}/api/dr/delete/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                }
            });

            if (response.ok) {
                setRowData(prevData => prevData.filter(item => item.No !== id));
                console.log('Successfully deleted row with ID:', id);
                setShowSuccessAlert(true);
                setSuccessAlertMessage(`DR with ID: ${id} deleted successfully!`);
                setTimeout(() => setShowSuccessAlert(false), 1500);

            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete the data');
            }
        } catch (error) {
            console.error("Error deleting data from API:", error);
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
                Code_Dr: 'Code_Dr',
                Name_Dr: 'Name_Dr',
                Name_Wip: 'Name_Wip',
                Name_Fg_1: 'Name_Fg_1',
                Demension: 'Demension',
                Type_Brake: 'Type_Brake',
                Chem_Grade: 'Chem_Grade',
                Status_Dr: 'Status_Dr',
                No_Grind: 'No_Grind',
                Num_Hole: 'Num_Hole',
                No_Jig_Drill: 'No_Jig_Drill',
                No_Drill: 'No_Drill',
                No_Reamer: 'No_Reamer',
                Code: 'Code',
                Remark: 'Remark',
                Color: 'Color',
                Color_Spray: 'Color_Spray',
                Grind_Back: 'Grind_Back',
                Grind_Front: 'Grind_Front',
                Grind_Detail: 'Grind_Detail',
                Drill: 'Drill',
                Baat: 'Baat',
                Ji_Hou: 'Ji_Hou',
                Fon_Hou: 'Fon_Hou',
                Tha_Khob: 'Tha_Khob',
                Cut: 'Cut',
                Form: 'Form',
            };

            const worksheetData = selectedRows.map(row => ({
                Code_Dr: row.Code_Dr,
                Name_Dr: row.Name_Dr,
                Name_Wip: row.Name_Wip,
                Name_Fg_1: row.Name_Fg_1,
                Demension: row.Demension,
                Type_Brake: row.Type_Brake,
                Chem_Grade: row.Chem_Grade,
                Status_Dr: row.Status_Dr,
                No_Grind: row.No_Grind,
                Num_Hole: row.Num_Hole,
                No_Jig_Drill: row.No_Jig_Drill,
                No_Drill: row.No_Drill,
                No_Reamer: row.No_Reamer,
                Code: row.Code,
                Remark: row.Remark,
                Color: row.Color,
                Color_Spray: row.Color_Spray,
                Grind_Back: row.Grind_Back,
                Grind_Front: row.Grind_Front,
                Grind_Detail: row.Grind_Detail,
                Drill: row.Drill,
                Baat: row.Baat,
                Ji_Hou: row.Ji_Hou,
                Fon_Hou: row.Fon_Hou,
                Tha_Khob: row.Tha_Khob,
                Cut: row.Cut,
                Form: row.Form,
            }));

            const worksheet = XLSX.utils.json_to_sheet(worksheetData, { header: Object.values(customHeaders) });
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
            saveAs(blob, `DrTable_${formattedDate}.xlsx`);
        } catch (error) {
            console.error('Error exporting to Excel:', error);
        }
    };

    const onGridReady = (params) => {
        setGridApi(params.api);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleShowDetails = (data) => {
        setModalData(data);
        setShowModal(true);
    };

    const handleShowEdit = (data) => {
        navigate(`/dr/${data.No}`);
    };

    const handleShowDelete = (data) => {
        setDeleteData(data);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        if (deleteData) {
            deleteDrData(deleteData.No);
            setShowDeleteModal(false);
        }
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
        console.log('cleanedRows', cleanedRows)
        // Convert the rows to a tab-separated string

        const tsvData = cleanedRows.map(row => {
            // Remove newline characters from values
            return Object.values(row).map(value => value.replace(/\r?\n|\r/g, '')).join('\t');
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

    return (
        <div>
            {/* Export Button */}
            <div>
                <button onClick={exportToExcel} style={{ marginBottom: '10px' }}>
                    Export Selected to Excel
                </button>
                <button onClick={copySelectedRowsToClipboard} style={{ marginBottom: '10px', marginLeft: '10px' }}>
                    Copy Selected Rows to Clipboard
                </button>
            </div>
    
            {/* Loading or Error Handling */}
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
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Detail Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalData && (
                        <div className="row">
                            <div className="col-md-6">
                                <p><strong>Code_Dr:</strong> {modalData.Code_Dr}</p>
                                <p><strong>Name_Dr:</strong> {modalData.Name_Dr}</p>
                                <p><strong>Name_Wip:</strong> {modalData.Name_Wip}</p>
                                <p><strong>Name_Fg_1:</strong> {modalData.Name_Fg_1}</p>
                                <p><strong>Dimension:</strong> {modalData.Demension}</p>
                                <p><strong>Type_Brake:</strong> {modalData.Type_Brake}</p>
                                <p><strong>Chem_Grade:</strong> {modalData.Chem_Grade}</p>
                                <p><strong>Status_Dr:</strong> {modalData.Status_Dr}</p>
                                <p><strong>No_Grind:</strong> {modalData.No_Grind}</p>
                                <p><strong>Num_Hole:</strong> {modalData.Num_Hole}</p>
                                <p><strong>No_Jig_Drill:</strong> {modalData.No_Jig_Drill}</p>
                                <p><strong>No_Drill:</strong> {modalData.No_Drill}</p>
                                <p><strong>No_Reamer:</strong> {modalData.No_Reamer}</p>
                                <p><strong>Code:</strong> {modalData.Code}</p>
                                <p><strong>Remark:</strong> {modalData.Remark}</p>
                            </div>
                            <div className="col-md-6">
                              
                                <p><strong>Color:</strong> {modalData.Color}</p>
                                <p><strong>Color_Spray:</strong> {modalData.Color_Spray}</p>
                                <p><strong>Grind_Back:</strong> {modalData.Grind_Back}</p>
                                <p><strong>Grind_Front:</strong> {modalData.Grind_Front}</p>
                                <p><strong>Grind_Detail:</strong> {modalData.Grind_Detail}</p>
                                <p><strong>Drill:</strong> {modalData.Drill}</p>
                                <p><strong>Baat:</strong> {modalData.Baat}</p>
                                <p><strong>Ji_Hou:</strong> {modalData.Ji_Hou}</p>
                                <p><strong>Fon_Hou:</strong> {modalData.Fon_Hou}</p>
                                <p><strong>Tha_Khob:</strong> {modalData.Tha_Khob}</p>
                                <p><strong>Cut:</strong> {modalData.Cut}</p>
                                <p><strong>Form:</strong> {modalData.Form}</p>
                                <p><strong>Create At:</strong> {convertToUTCPlus7(modalData.CreateAt)}</p>
                                <p><strong>Update At:</strong> {convertToUTCPlus7(modalData.UpdateAt)}</p>
                            </div>
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
                    <p>Are you sure you want to delete <strong>{deleteData ? deleteData.Name_Dr : ''}</strong>?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>
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

export default DrTable;
