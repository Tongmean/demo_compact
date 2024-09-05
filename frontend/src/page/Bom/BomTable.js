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

    const [rowData, setRowData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [gridApi, setGridApi] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteData, setDeleteData] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3030/api/bom/', {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                }
            });
            const apiData = await response.json();
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
            console.error("Error fetching data from API:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteBomData = async (id) => {
        try {
            const response = await fetch(`http://localhost:3030/api/bom/deletebom/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                }
            });

            if (response.ok) {
                setRowData(prevData => prevData.filter(item => item.No !== id));
                console.log('Successfully deleted row with ID:', id);
            } else {
                console.error('Failed to delete row with ID:', id);
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
                <button onClick={exportToExcel} style={{ marginBottom: '10px' }}>
                    Export Selected Rows to Excel
                </button>
            </div>
            {loading ? (
                <div>Loading data, please wait...</div>
            ) : (
                <div className="ag-theme-alpine" style={{ height: 'calc(100vh - 100px)', width: '100%' }}>
                    <AgGridReact
                        columnDefs={columnDefs}
                        rowData={rowData}
                        rowSelection="multiple"
                        enableRangeSelection={true}
                        suppressClipboardPaste={false}  // Allow paste, set false to ensure clipboard functionality
                        suppressMultiRangeSelection={false}  // Allow multi-range selection
                        suppressCopySingleCellRanges={false}  // Allow copying single cell ranges
                        enableRangeHandle={true}  // Enable range handles for easier selection
                        onGridReady={onGridReady}
                        onSelectionChanged={onSelectionChanged}
                        pagination={true}
                        paginationPageSize={20}
                        // Additional optional configurations
                        defaultColDef={{
                            resizable: true,
                            sortable: true,
                            filter: true
                        }}
                    />
                </div>
            )}

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

export default BomTable;
