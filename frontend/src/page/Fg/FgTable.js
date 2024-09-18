import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // AG Grid CSS
import 'ag-grid-community/styles/ag-theme-alpine.css'; // AG Grid theme
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { useAuthContext } from '../../hook/useAuthContext';
import { Modal, Button } from 'react-bootstrap'; // Import Bootstrap components
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { convertToUTCPlus7 } from '../../utility/Moment-timezone';
import env from "react-dotenv";

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
        // { headerName: 'Model', field: 'Model', filter: 'agTextColumnFilter' },
        // { headerName: 'Part_No', field: 'Part_No', filter: 'agTextColumnFilter' },
        { headerName: 'Code', field: 'Code', filter: 'agTextColumnFilter' },
        { headerName: 'Chem_Grade', field: 'Chem_Grade', filter: 'agTextColumnFilter' },
        { headerName: 'Pcs_Per_Set', field: 'Pcs_Per_Set', filter: 'agTextColumnFilter' },
        { headerName: 'Box_No', field: 'Box_No', filter: 'agTextColumnFilter' },
        { headerName: 'Rivet_No', field: 'Rivet_No', filter: 'agTextColumnFilter' },
        { headerName: 'Num_Revit_Per_Set', field: 'Num_Revit_Per_Set', filter: 'agTextColumnFilter' },
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

    // Define the initial row data (sample data)
    const [rowData, setRowData] = useState();
    const [loading, setLoading] = useState(false); // Loading state
    const [gridApi, setGridApi] = useState(null);
    const [showModal, setShowModal] = useState(false); // Detail modal state
    const [modalData, setModalData] = useState(null); // Data for the detail modal
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Delete modal state
    const [deleteData, setDeleteData] = useState(null); // Data for the delete modal

    const [showSuccessAlert, setShowSuccessAlert] = useState(false); //Alert Dellete success
    const [successAlertMessage, setSuccessAlertMessage] = useState('');
    // Fetch data from API
    const fetchData = async () => {
        setLoading(true); // Start loading
        try {
            const response = await fetch(`${env.API_URL}/api/fg`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                }
            });
            if(response.ok){
                const Data = await response.json();
                const apiData = Data.data;
                
                const mappedData = apiData.map(item => ({
                    No: item.id,
                    Code_Fg: item.Code_Fg,
                    Name_Fg: item.Name_Fg,
                    Model: item.Model,
                    Part_No: item.Part_No,
                    OE_Part_No: item.OE_Part_No,
                    Code: item.Code,
                    Chem_Grade: item.Chem_Grade,
                    Pcs_Per_Set: item.Pcs_Per_Set,
                    Box_No: item.Box_No,
                    Weight_Box: item.Weight_Box,
                    Box_Erp_No: item.Box_Erp_No,
                    Rivet_No: item.Rivet_No,
                    Weight_Revit_Per_Set: item.Weight_Revit_Per_Set,
                    Num_Revit_Per_Set: item.Num_Revit_Per_Set,
                    Revit_Erp_No: item.Revit_Erp_No,
                    Remark: item.Remark,
                    CreateAt: item.CreateAt,
                    UpdateAt: item.UpdateAt,
                }));
                setRowData(mappedData);
                // console.log('api', Data)
                // console.log('mapdata',mappedData)
            }else{
                throw new Error((await response.json()).msg || `HTTP error! Status: ${response.status}`);
            }
            
        } catch (error) {
            console.error(error.message);
            alert(error.message)
        } finally {
            setLoading(false); // End loading
        }
    };

    // Delete data from API
    const deleteBomData = async (id) => {
        try {
            const response = await fetch(`${env.API_URL}/api/fg/delete/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                }
            });

            if (response.ok) {
                // Successfully deleted, now update the rowData state to remove the deleted row
                setRowData(prevData => prevData.filter(item => item.No !== id));
                console.log('Successfully deleted row with ID:', id);
                setShowSuccessAlert(true);
                setSuccessAlertMessage(`BOM with ID: ${id} deleted successfully!`);
                setTimeout(() => setShowSuccessAlert(false), 1500); // Hide alert after 1.5 seconds
            } else {
                throw new Error((await response.json()).msg || `HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.log(error.message);
            alert(error.message)
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
                Model: 'Model',
                Part_No: 'Part_No',
                OE_Part_No: 'OE_Part_No',
                Code: 'Code',
                Chem_Grade: 'Chem_Grade',
                Pcs_Per_Set: 'Pcs_Per_Set',
                Box_No: 'Box_No',
                Weight_Box: 'Weight_Box',
                Box_Erp_No: 'Box_Erp_No',
                Rivet_No: 'Rivet_No',
                Weight_Revit_Per_Set:'Weight_Revit_Per_Set',
                Num_Revit_Per_Set: 'Num_Revit_Per_Set',
                Revit_Erp_No: 'Revit_Erp_No',
                Remark: 'Remark'
            };
            const mappedData = selectedRows.map(item => ({
                Code_Fg: item.Code_Fg,
                Name_Fg: item.Name_Fg,
                Model: item.Model,
                Part_No: item.Part_No,
                OE_Part_No: item.OE_Part_No,
                Code: item.Code,
                Chem_Grade: item.Chem_Grade,
                Pcs_Per_Set: item.Pcs_Per_Set,
                Box_No: item.Box_No,
                Weight_Box: item.Weight_Box,
                Box_Erp_No: item.Box_Erp_No,
                Rivet_No: item.Rivet_No,
                Weight_Revit_Per_Set:item.Weight_Revit_Per_Set,
                Num_Revit_Per_Set: item.Num_Revit_Per_Set,
                Revit_Erp_No: item.Revit_Erp_No,
                Remark: item.Remark,
            }));
            const worksheet = XLSX.utils.json_to_sheet(mappedData, { header: Object.values(customHeaders) });
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'SelectedData');
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(file, `${formattedDate}_Fg.xlsx`);
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
        navigate(`/fg/${data.No}`); 
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
                <button onClick={copySelectedRowsToClipboard} style={{ marginBottom: '10px', marginLeft: '10px' }}>
                    Copy Selected Rows to Clipboard
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
                        pagination={true}
                        onSelectionChanged={onSelectionChanged}
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
                            <p><strong>Model:</strong> {modalData.Model}</p>
                            <p><strong>Part_No:</strong> {modalData.Part_No}</p>
                            <p><strong>OE_Part_No:</strong> {modalData.OE_Part_No}</p>
                            <p><strong>Code:</strong> {modalData.Code}</p>
                            <p><strong>Chem_Grade:</strong> {modalData.Chem_Grade}</p>
                            <p><strong>Pcs_Per_Set:</strong> {modalData.Pcs_Per_Set}</p>
                            <p><strong>Box_No:</strong> {modalData.Box_No}</p>
                            <p><strong>Weight_Box:</strong> {modalData.Weight_Box}</p>
                            <p><strong>Box_Erp_No:</strong> {modalData.Box_Erp_No}</p>
                            <p><strong>Rivet_No:</strong> {modalData.Rivet_No}</p>

                            <p><strong>Weight_Revit_Per_Set:</strong> {modalData.Weight_Revit_Per_Set}</p>
                            <p><strong>Num_Rivet_Per_Set:</strong> {modalData.Num_Rivet_Per_Set}</p>
                            <p><strong>Revit_Erp_No:</strong> {modalData.Revit_Erp_No}</p>
                            <p><strong>Remark:</strong> {modalData.Remark}</p>
                            <p><strong>Create At:</strong> {convertToUTCPlus7(modalData.CreateAt)}</p>
                            <p><strong>Update At:</strong> {convertToUTCPlus7(modalData.UpdateAt)}</p>
          
                            
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

export default FgTable;
