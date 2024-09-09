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

const WipTable = () => {
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
        { headerName: 'Code_Wip', field: 'Code_Wip', filter: 'agTextColumnFilter' },
        { headerName: 'Name_Wip', field: 'Name_Wip', filter: 'agTextColumnFilter' },
        { headerName: 'Code_Mold', field: 'Code_Mold', filter: 'agTextColumnFilter' },
        { headerName: 'Dimension', field: 'Dimension', filter: 'agTextColumnFilter' },
        { headerName: 'Chem_Grade', field: 'Chem_Grade', filter: 'agTextColumnFilter' },
        { headerName: 'Weight_Per_Pcs', field: 'Weight_Per_Pcs', filter: 'agTextColumnFilter' },
        { headerName: 'Pcs_Per_Mold', field: 'Pcs_Per_Mold', filter: 'agTextColumnFilter' },
        { headerName: 'Pcs_Per_Set', field: 'Pcs_Per_Set', filter: 'agTextColumnFilter' },
        // { headerName: 'Type_Brake', field: 'Type_Brake', filter: 'agTextColumnFilter' },
        // { headerName: 'Type_Mold', field: 'Type_Mold', filter: 'agTextColumnFilter' },
        // { headerName: 'Time_Per_Mold', field: 'Time_Per_Mold', filter: 'agTextColumnFilter' },
        // { headerName: 'Mold_Per_8_Hour', field: 'Mold_Per_8_Hour', filter: 'agTextColumnFilter' },
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
            const response = await fetch('http://localhost:3030/api/wip', {
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
            const response = await fetch(`http://localhost:3030/api/wip/delete/${id}`, {
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
            const worksheet = XLSX.utils.json_to_sheet(mappedData, { header: Object.values(customHeaders) });
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
                <div>Loading...</div>
            ) : (
                <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
                    <AgGridReact
                        columnDefs={columnDefs}
                        rowData={rowData}
                        rowSelection="multiple"
                        pagination={true}
                        paginationPageSize={20}
                        onGridReady={onGridReady}
                    />
                </div>
            )}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Wip Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalData && (
                        <div>
                            <p><strong>Code_Wip:</strong> {modalData.Code_Wip}</p>
                            <p><strong>Name_Wip:</strong> {modalData.Name_Wip}</p>
                            <p><strong>Code_Mold:</strong> {modalData.Code_Mold}</p>
                            <p><strong>Dimension:</strong> {modalData.Dimension}</p>
                            <p><strong>Chem_Grade:</strong> {modalData.Chem_Grade}</p>
                            <p><strong>Weight_Per_Pcs:</strong> {modalData.Weight_Per_Pcs}</p>
                            <p><strong>Pcs_Per_Mold:</strong> {modalData.Pcs_Per_Mold}</p>
                            <p><strong>Pcs_Per_Set:</strong> {modalData.Pcs_Per_Set}</p>
                            <p><strong>Type_Brake:</strong> {modalData.Type_Brake}</p>
                            <p><strong>Type_Mold:</strong> {modalData.Type_Mold}</p>
                            <p><strong>Time_Per_Mold:</strong> {modalData.Time_Per_Mold}</p>
                            <p><strong>Mold_Per_8_Hour:</strong> {modalData.Mold_Per_8_Hour}</p>
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
