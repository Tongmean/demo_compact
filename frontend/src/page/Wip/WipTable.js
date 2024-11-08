import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; 
import 'ag-grid-community/styles/ag-theme-alpine.css'; 
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { useAuthContext } from '../../hook/useAuthContext';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; 
import env from "react-dotenv";
import ModalComponent from './ModalComponent'
const WipTable = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString(); 
    const { user } = useAuthContext(); 
    const navigate = useNavigate(); 

    const columnDefs = [
        // {
        //     headerName: 'NO.',
        //     field: 'No',
        //     filter: 'agTextColumnFilter',
        //     checkboxSelection: true,
        //     headerCheckboxSelection: true,
        // },
        { headerName: 'Code_Wip', field: 'Code_Wip', filter: 'agTextColumnFilter' ,headerCheckboxSelection: true, checkboxSelection: true,},
        { headerName: 'Name_Wip', field: 'Name_Wip', filter: 'agTextColumnFilter' },
        { headerName: 'รหัสแม่พิมพ์', field: 'Code_Mold', filter: 'agTextColumnFilter' },
        { headerName: 'ขนาดผ้า', field: 'Dimension', filter: 'agTextColumnFilter' },
        { headerName: 'เกรดเคมี', field: 'Chem_Grade', filter: 'agTextColumnFilter' },
        { headerName: 'น้ำหนักต่อชิ้น', field: 'Weight_Per_Pcs', filter: 'agTextColumnFilter' },
        { headerName: 'ชิ้นต่อพิมพ์', field: 'Pcs_Per_Mold', filter: 'agTextColumnFilter' },
        { headerName: 'ชิ้นต่อชุด', field: 'Pcs_Per_Set', filter: 'agTextColumnFilter' },
        // { headerName: 'Type_Brake', field: 'Type_Brake', filter: 'agTextColumnFilter' },
        // { headerName: 'Type_Mold', field: 'Type_Mold', filter: 'agTextColumnFilter' },
        // { headerName: 'Time_Per_Mold', field: 'Time_Per_Mold', filter: 'agTextColumnFilter' },
        // { headerName: 'Mold_Per_8_Hour', field: 'Mold_Per_8_Hour', filter: 'agTextColumnFilter' },
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

    const [rowData, setRowData] = useState();
    const [loading, setLoading] = useState(false); 
    const [gridApi, setGridApi] = useState(null);
    const [showModal, setShowModal] = useState(false); 
    const [modalData, setModalData] = useState(null); 
    const [showDeleteModal, setShowDeleteModal] = useState(false); 
    const [deleteData, setDeleteData] = useState(null); 

    const [showSuccessAlert, setShowSuccessAlert] = useState(false); //Alert Dellete success
    const [successAlertMessage, setSuccessAlertMessage] = useState('');

    const fetchData = async () => {
        setLoading(true); 
        try {
            const response = await fetch(`${env.API_URL}/api/wip`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                }
            });
            if (response.ok) {
                const Data = await response.json();
                const apiData = Data.data;
                const mappedData = apiData.map(item => ({
                    No: item.id,
                    Code_Wip: item.Code_Wip,
                    Name_Wip: item.Name_Wip,
                    Code_Mold: item.Code_Mold,
                    Dimension: item.Dimension,
                    Chem_Grade: item.Chem_Grade,
                    Weight_Per_Pcs: item.Weight_Per_Pcs,
                    Pcs_Per_Mold: item.Pcs_Per_Mold,
                    Pcs_Per_Set: item.Pcs_Per_Set,
                    Type_Brake: item.Type_Brake,
                    Type_Mold: item.Type_Mold,
                    Time_Per_Mold: item.Time_Per_Mold,
                    Mold_Per_8_Hour: item.Mold_Per_8_Hour,
                    Remark: item.Remark,
                    CreateAt: item.CreateAt,
                    CreateBy: item.CreateBy,
                    UpdateAt: item.UpdateAt,
                }));
                setRowData(mappedData);
            } else {
                throw new Error((await response.json()).msg || `HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error(error.message);
            alert(error.message);
        } finally {
            setLoading(false); 
        }
    };

    const deleteWipData = async (id) => {
        try {
            const response = await fetch(`${env.API_URL}/api/wip/delete/${id}`, {
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
                throw new Error((await response.json()).msg || `HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error(error.message);
            alert(error.message);
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
                console.log(selectedRows)
                return;
            }
            
            const customHeaders = {
                Code_Wip: 'Code_Wip',
                Name_Wip: 'Name_Wip',
                Code_Mold: 'Code_Mold',
                Dimension: 'Dimension',
                Chem_Grade: 'Chem_Grade',
                Weight_Per_Pcs: 'Weight_Per_Pcs',
                Pcs_Per_Mold: 'Pcs_Per_Mold',
                Pcs_Per_Set: 'Pcs_Per_Set',
                Type_Brake: 'Type_Brake',
                Type_Mold: 'Type_Mold',
                Time_Per_Mold: 'Time_Per_Mold',
                Mold_Per_8_Hour: 'Mold_Per_8_Hour',
                Remark: 'Remark'
            };
            const mappedData = selectedRows.map(item => ({
                Code_Wip: item.Code_Wip,
                Name_Wip: item.Name_Wip,
                Code_Mold: item.Code_Mold,
                Dimension: item.Dimension,
                Chem_Grade: item.Chem_Grade,
                Weight_Per_Pcs: item.Weight_Per_Pcs,
                Pcs_Per_Mold: item.Pcs_Per_Mold,
                Pcs_Per_Set: item.Pcs_Per_Set,
                Type_Brake: item.Type_Brake,
                Type_Mold: item.Type_Mold,
                Time_Per_Mold: item.Time_Per_Mold,
                Mold_Per_8_Hour: item.Mold_Per_8_Hour,
                Remark: item.Remark,
            }));

            console.log('customHeaders',customHeaders);
            console.log('Object.values(customHeaders)', Object.values(customHeaders))
            console.log('Object.keys(customHeaders)', Object.keys(customHeaders))
            console.log('mappedData',mappedData)

            const worksheet = XLSX.utils.json_to_sheet(mappedData, { header: Object.values(customHeaders) });
            console.log('worksheet',worksheet)
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'SelectedData');
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(file, `${formattedDate}_Wip.xlsx`);
        } catch (error) {
            console.error("Error exporting data to Excel:", error);
        }
    };

    const handleShowDetails = (data) => {
        setModalData(data);
        setShowModal(true);
    };

    const handleShowEdit = (data) => {
        navigate(`/wip/${data.No}`);
    };

    const handleShowDelete = (data) => {
        setDeleteData(data);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (deleteData && deleteData.No) {
            deleteWipData(deleteData.No);

        }
        setShowDeleteModal(false);
    };

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
        
        const cleanedRows = selectedRows.map(({ No,CreateBy, CreateAt,UpdateAt, ...rest }) => rest);
        // Convert the rows to a tab-separated string
        const tsvData = cleanedRows.map(row => {
            // Object.values(row) extracts all values from the row object
            return Object.values(row).join('\t');
        }).join('\n');

        // console.log(tsvData)
        // Use the Clipboard API to copy the data
        // navigator.clipboard.writeText(tsvData)
        //     .then(() => {
        //         console.log('Copied to clipboard successfully.', );
        //         setShowSuccessAlert(true);
        //         setSuccessAlertMessage(`Copied to clipboard successfully.`);
        //         setTimeout(() => setShowSuccessAlert(false), 1000); // Hide alert after 1.5 seconds

        //     })
        //     .catch(err => {
        //         console.error('Failed to copy:', err);
        //     });
        //Alternative method for copy
        function copyToClipboard(text) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                console.log('Copied to clipboard successfully.');
                setShowSuccessAlert(true);
                setSuccessAlertMessage(`Copied to clipboard successfully.`);
                setTimeout(() => setShowSuccessAlert(false), 1000); // Hide alert after 1.5 seconds
            } catch (err) {
                console.error('Failed to copy:', err);
            }
            document.body.removeChild(textarea);
        }
        
        // Usage
        copyToClipboard(tsvData);
        
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
                <div>Loading...</div>
            ) : (
                <div className="ag-theme-alpine" style={{  height: 'calc(100vh - 100px)', width: '100%' }}>
                    <AgGridReact
                        columnDefs={columnDefs}
                        rowData={rowData}
                        rowSelection="multiple"
                        pagination={true}
                        paginationPageSize={20}
                        onSelectionChanged={onSelectionChanged}
                        onGridReady={onGridReady}
                        defaultColDef={{
                            resizable: true,
                            sortable: true,
                            filter: true,
                            editable: true,
                        }}
                    />
                </div>
            )}
            
            {/* <Modal show={showModal} onHide={() => setShowModal(false)} centered size='xl'>
                <Modal.Header closeButton>
                    <Modal.Title>Information Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalData && (
                        <div className="row">
                            {[
                                { label: 'Code_Wip:', value: modalData.Code_Wip },
                                { label: 'Name_Wip:', value: modalData.Name_Wip },
                                { label: 'Code_Mold:', value: modalData.Code_Mold },
                                { label: 'Dimension:', value: modalData.Dimension },
                                { label: 'Chem_Grade:', value: modalData.Chem_Grade },
                                { label: 'Weight_Per_Pcs:', value: modalData.Weight_Per_Pcs },
                                { label: 'Pcs_Per_Mold:', value: modalData.Pcs_Per_Mold },
                                { label: 'Pcs_Per_Set:', value: modalData.Pcs_Per_Set },
                                { label: 'Type_Brake:', value: modalData.Type_Brake },
                                { label: 'Type_Mold:', value: modalData.Type_Mold },
                                { label: 'Time_Per_Mold:', value: modalData.Time_Per_Mold },
                                { label: 'Mold_Per_8_Hour:', value: modalData.Mold_Per_8_Hour },
                                { label: 'Remark:', value: modalData.Remark },
                                { label: 'Create At:', value: convertToUTCPlus7(modalData.CreateAt) },
                                { label: 'Update At:', value: convertToUTCPlus7(modalData.UpdateAt) },
                            ].reduce((acc, field, index) => {
                                const rowIndex = Math.floor(index / 3);
                                if (!acc[rowIndex]) {
                                    acc[rowIndex] = [];
                                }
                                acc[rowIndex].push(field);
                                return acc;
                            }, []).map((rowFields, rowIndex) => (
                                <div key={rowIndex} className="row mb-3">
                                    {rowFields.map((field, fieldIndex) => (
                                        <div key={fieldIndex} className="col-md-4">
                                            <div className="p-2 border border-primary rounded bg-light">
                                                <h6 className="text-primary mb-1">{field.label}</h6>
                                                <p className="m-0">{field.value || '-'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal> */}
            {modalData && (
                <ModalComponent
                    showModal={showModal}
                    setShowModal={setShowModal}
                    modalData={modalData}
                    Api_URL={`${env.API_URL}/api/historylog/wip/${modalData.No}`}
                />
            )}


            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete <strong>{deleteData ? deleteData.Code_Wip  : ''}</strong>?</p>
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

export default WipTable;
