import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useAuthContext } from '../../hook/useAuthContext';
import env from "react-dotenv";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
//PDf gen
import ChildPDFComponent from './ChildPDFComponent';
import DrawingFetch from './DrawingFetch'
const DashTable = () => {
    const { user } = useAuthContext();
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const columnDefs = [
        // {
        //     headerName: 'NO.',
        //     field: 'No',
        //     filter: 'agTextColumnFilter',
        //     checkboxSelection: true,
        //     headerCheckboxSelection: true,
        // },
        { headerName: 'Code_Fg', field: 'Code_Fg', filter: 'agTextColumnFilter' ,headerCheckboxSelection: true, checkboxSelection: true,},
        { headerName: 'Name_Fg', field: 'Name_Fg', filter: 'agTextColumnFilter' },
        { headerName: 'Pcs_Per_Set', field: 'Pcs_Per_Set_FG', filter: 'agTextColumnFilter' },
        { headerName: 'Code_Dr', field: 'Code_Dr', filter: 'agTextColumnFilter' },
        { headerName: 'Name_Dr', field: 'Name_Dr', filter: 'agTextColumnFilter' },
        { headerName: 'Ra_Wip', field: 'R_Wip_Modify', filter: 'agTextColumnFilter' },
        { headerName: 'Code_Wip', field: 'Code_Wip', filter: 'agTextColumnFilter' },
        { headerName: 'Name_Wip', field: 'Name_Wip', filter: 'agTextColumnFilter' },
        { headerName: 'Ra_L', field: 'R_L_Modify', filter: 'agTextColumnFilter' },
        { headerName: 'Remark', field: 'Remark', filter: 'agTextColumnFilter' },
        {
            headerName: 'Actions',
            field: 'actions',
            cellRenderer: (params) => (
                <div>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handlePDFButtonClick([params.data])}
                        style={{ marginRight: '5px' }}
                    >
                        PDF
                    </button>
                    <DrawingFetch params = {params}/>
                    {/* <button
                        className="btn btn-secondary btn-sm"
                        // onClick={() => handleShowEdit(params.data)}
                        style={{ marginRight: '5px' }}
                    >
                        DRAWING 1
                    </button> */}
                        
                    
                </div>
            ),
        }
    ];

    const [rowData, setRowData] = useState([]);
    //set-map
    const [mappedData, setMappedData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    //selete row PDF
    const [rowPdf, setRowPdf] = useState(null);


    const fetchData = async () => {
        setLoading(true);
        setError(null); // Reset error state before fetching
        try {
            const response = await fetch(`${env.API_URL}/api/dash/jointabledash`, {
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
                //Bom
                No: item.id,
                Code_Fg: item.Code_Fg,
                Name_Fg_Bom: item.Name_Fg_Bom,
                Code_Dr: item.Code_Dr,
                Name_Dr_Bom: item.Name_Dr_Bom,
                Code_Wip: item.Code_Wip,
                Name_Wip_Bom: item.Name_Wip_Bom,
                Ra_Wip: item.Ra_Wip,
                Ra_L: item.Ra_L,
                R_Wip_Modify: item.Ra_Wip_Modify,
                R_L_Modify: item.Ra_L_Modify,
                Pcs_Per_Set_FG: item.Pcs_Per_Set_Fg,
                Remark_Bom: item.Remark_Bom,
                //Fg
                Code_Fg: item.Code_Fg,
                Name_Fg: item.Name_Fg,
                Model: item.Model,
                Part_No: item.Part_No,
                OE_Part_No: item.OE_Part_No,
                Code_fg: item.Code_fg,
                Chem_Grade: item.Chem_Grade,
                Pcs_Per_Set: item.Pcs_Per_Set,
                Box_No: item.Box_No,
                Weight_Box: item.Weight_Box,
                Box_Erp_No: item.Box_Erp_No,
                Rivet_No: item.Rivet_No,
                Weight_Revit_Per_Set: item.Weight_Revit_Per_Set,
                Num_Revit_Per_Set: item.Num_Revit_Per_Set,
                Revit_Erp_No: item.Revit_Erp_No,
                Remark_Fg: item.Remark_Fg,
                //dr
                Code_Dr: item.Code_Dr,
                Name_Dr: item.Name_Dr,
                Name_Wip: item.Name_Wip,
                Name_Fg_1: item.Name_Fg_1,
                Demension: item.Demension,
                Type_Brake_Dr: item.Type_Brake_Dr,
                Chem_Grade: item.Chem_Grade,
                Status_Dr: item.Status_Dr,
                No_Grind: item.No_Grind,
                Num_Hole: item.Num_Hole,
                No_Jig_Drill: item.No_Jig_Drill,
                No_Drill: item.No_Drill,
                No_Reamer: item.No_Reamer,
                Code_Drill: item.Code_Drill,
                Remark_Dr: item.Remark_Dr,
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
                //Wip
                Code_Wip: item.Code_Wip,
                Name_Wip: item.Name_Wip,
                Code_Mold: item.Code_Mold,
                Dimension: item.Dimension,
                Chem_Grade: item.Chem_Grade,
                Weight_Per_Pcs: item.Weight_Per_Pcs,
                Pcs_Per_Mold: item.Pcs_Per_Mold,
                Pcs_Per_Set_Wip: item.Pcs_Per_Set_Wip,
                Type_Brake: item.Type_Brake,
                Type_Mold: item.Type_Mold,
                Time_Per_Mold: item.Time_Per_Mold,
                Mold_Per_8_Hour: item.Mold_Per_8_Hour,
                Remark_Wip: item.Remark_Wip,

            }));
            setMappedData(mappedData);
            console.log('mappedData', mappedData)
            //Row data not Duplicate
            const rowData = apiData.map(item => ({
                No: item.id,
                Code_Fg: item.Code_Fg,
                Name_Fg: item.Name_Fg_Bom,
                Code_Dr: item.Code_Dr,
                Name_Dr: item.Name_Dr_Bom,
                Code_Wip: item.Code_Wip,
                Name_Wip: item.Name_Wip_Bom,
                R_Wip: item.Ra_Wip,
                R_L: item.Ra_L,
                R_Wip_Modify: item.Ra_Wip_Modify,
                R_L_Modify: item.Ra_L_Modify,
                Pcs_Per_Set_FG: item.Pcs_Per_Set_Fg,
                Remark: item.Remark_Bom,
            }));
            console.log('rowData',rowData)
            //Record remove Duplicate
            function removeDuplicates(data) {
                const seen = new Set();
                return data.filter(item => {
                    const key = JSON.stringify(item);
                    return seen.has(key) ? false : seen.add(key);
                });
            }

            // Remove duplicates from each mappedData array
            const rowDataRemoveDuplicate = removeDuplicates(rowData);

            setRowData(rowDataRemoveDuplicate);

        } catch (error) {
            setError(error.message);
            console.log("Error fetching data from API:", error.msg);
            alert(error.message)
        } finally {
            setLoading(false);
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
            //Bom
            const customHeadersBom = {
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
            const mappedDataBom = selectedRows.map(row => ({
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
            //Fg
            const customHeadersFg ={
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
            }
            //Filter
            // Create a Set of Code_Fg values for quick lookup
            const codeFgSet = new Set(selectedRows.map(row => row.Code_Fg));
            console.log('codeFgSet', codeFgSet)
            // Filter mappedData to include only items where code_Fg is in the Set
            const filteredDataFg = mappedData.filter(data => codeFgSet.has(data.Code_Fg));
            console.log('filteredDataFg', filteredDataFg)

            const mappedDataFg = filteredDataFg.map(item =>({
                Code_Fg: item.Code_Fg,
                Name_Fg: item.Name_Fg,
                Model: item.Model,
                Part_No: item.Part_No,
                OE_Part_No: item.OE_Part_No,
                Code: item.Code_fg,
                Chem_Grade: item.Chem_Grade,
                Pcs_Per_Set: item.Pcs_Per_Set_FG,
                Box_No: item.Box_No,
                Weight_Box: item.Weight_Box,
                Box_Erp_No: item.Box_Erp_No,
                Rivet_No: item.Rivet_No,
                Weight_Revit_Per_Set:item.Weight_Revit_Per_Set,
                Num_Revit_Per_Set: item.Num_Revit_Per_Set,
                Revit_Erp_No: item.Revit_Erp_No,
                Remark: item.Remark_Fg,
            }))
            //Dr
            const customHeadersDr = {
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

            //Filter
            // Create a Set of Code_Fg values for quick lookup
            const codeDrSet = new Set(selectedRows.map(row => row.Code_Dr));
            console.log('codeFgSet', codeDrSet)
            // Filter mappedData to include only items where code_Fg is in the Set
            const filteredDataDr = mappedData.filter(data => codeDrSet.has(data.Code_Dr));
            console.log('filteredDataDr', filteredDataDr)

            const mappedDataDr = filteredDataDr.map(row => ({
                Code_Dr: row.Code_Dr,
                Name_Dr: row.Name_Dr,
                Name_Wip: row.Name_Wip,
                Name_Fg_1: row.Name_Fg_1,
                Demension: row.Demension,
                Type_Brake: row.Type_Brake_Dr,
                Chem_Grade: row.Chem_Grade,
                Status_Dr: row.Status_Dr,
                No_Grind: row.No_Grind,
                Num_Hole: row.Num_Hole,
                No_Jig_Drill: row.No_Jig_Drill,
                No_Drill: row.No_Drill,
                No_Reamer: row.No_Reamer,
                Code: row.Code_Drill,
                // Code: row.Code_fg,
                Remark: row.Remark_Dr,
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
            //Wip
            const customHeadersWip = {
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

            //Filter
            // Create a Set of Code_Fg values for quick lookup
            const codeWipSet = new Set(selectedRows.map(row => row.Code_Wip));
            console.log('codeWipSet', codeWipSet)
            // Filter mappedData to include only items where code_Fg is in the Set
            const filteredDataWip = mappedData.filter(data => codeWipSet.has(data.Code_Wip));
            console.log('filteredDataWip', filteredDataWip)


            const mappedDataWip = filteredDataWip.map(item => ({
                Code_Wip: item.Code_Wip,
                Name_Wip: item.Name_Wip,
                Code_Mold: item.Code_Mold,
                Dimension: item.Dimension,
                Chem_Grade: item.Chem_Grade,
                Weight_Per_Pcs: item.Weight_Per_Pcs,
                Pcs_Per_Mold: item.Pcs_Per_Mold,
                Pcs_Per_Set: item.Pcs_Per_Set_Wip,
                Type_Brake: item.Type_Brake,
                Type_Mold: item.Type_Mold,
                Time_Per_Mold: item.Time_Per_Mold,
                Mold_Per_8_Hour: item.Mold_Per_8_Hour,
                Remark: item.Remark_Wip,
            }));

            // console.log("Dr",mappedDataDr)
            // console.log("Wip",mappedDataWip)
            // console.log("fg",mappedDataFg)
            // console.log("bom",mappedDataBom)

            // Function to remove duplicate objects from an array
            function removeDuplicates(data) {
                const seen = new Set();
                return data.filter(item => {
                    const key = JSON.stringify(item);
                    return seen.has(key) ? false : seen.add(key);
                });
            }

            // Remove duplicates from each mappedData array
            const uniqueDataBom = removeDuplicates(mappedDataBom);
            const uniqueDataFg = removeDuplicates(mappedDataFg);
            const uniqueDataDr = removeDuplicates(mappedDataDr);
            const uniqueDataWip = removeDuplicates(mappedDataWip);

            
            // console.log("uniqueDataBom",uniqueDataBom)
            // console.log("uniqueDataFg",uniqueDataFg)
            // console.log("uniqueDataDr",uniqueDataDr)
            // console.log("uniqueDataWip",uniqueDataWip)

            // Create worksheets with unique data
            const worksheetBom = XLSX.utils.json_to_sheet(uniqueDataBom, { header: Object.values(customHeadersBom) });
            const worksheetFg = XLSX.utils.json_to_sheet(uniqueDataFg, { header: Object.values(customHeadersFg) });
            const worksheetDr = XLSX.utils.json_to_sheet(uniqueDataDr, { header: Object.values(customHeadersDr) });
            const worksheetWip = XLSX.utils.json_to_sheet(uniqueDataWip, { header: Object.values(customHeadersWip) });

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheetBom, 'Bom');
            XLSX.utils.book_append_sheet(workbook, worksheetFg, 'Fg');
            XLSX.utils.book_append_sheet(workbook, worksheetDr, 'Dr');
            XLSX.utils.book_append_sheet(workbook, worksheetWip, 'Wip');


            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(file, `${formattedDate}_Product_data.xlsx`);
        } catch (error) {
            console.error("Error exporting data to Excel:", error);
        }
    };

    //pass to pdf gen 
    const handlePDFButtonClick = (row) => {
        // Create a Set of Code_Fg values for quick lookup
        const codeFgSet = new Set(row.map(rows => rows.Code_Fg));
        console.log('codeFgSet', codeFgSet); // Debug: Log the Set of Code_Fg values
    
        // Filter mappedData to include only items where Code_Fg is in the Set
        const filteredDataFg = mappedData.filter(data => codeFgSet.has(data.Code_Fg));
        console.log('filteredDataFg', filteredDataFg); // Debug: Log the filtered data
        const mappedDataFg = filteredDataFg.map(item =>({
            Code_Fg: item.Code_Fg,
            Name_Fg: item.Name_Fg,
            Model: item.Model,
            Part_No: item.Part_No,
            OE_Part_No: item.OE_Part_No,
            Code: item.Code_fg,
            Chem_Grade: item.Chem_Grade,
            Pcs_Per_Set: item.Pcs_Per_Set_FG,
            Box_No: item.Box_No,
            Weight_Box: item.Weight_Box,
            Box_Erp_No: item.Box_Erp_No,
            Rivet_No: item.Rivet_No,
            Weight_Revit_Per_Set:item.Weight_Revit_Per_Set,
            Num_Revit_Per_Set: item.Num_Revit_Per_Set,
            Revit_Erp_No: item.Revit_Erp_No,
            Remark: item.Remark_Fg,
            //Dr
            Status_Dr:item.Status_Dr,
            Num_Hole:item.Num_Hole,
            Type_Brake_Dr:item.Type_Brake_Dr,
            Dimension: item.Dimension,

        }))
        // Function to remove duplicate objects from an array
        function removeDuplicates(data) {
            const seen = new Set(); // Create a Set to keep track of seen items
            return data.filter(item => {
                // Create a unique key by stringifying the item
                const key = JSON.stringify(item);
                // Check if the item has been seen before
                return seen.has(key) ? false : seen.add(key); // Add to seen Set if not seen
            });
        }
    
        // Remove duplicates from the filtered data
        const uniqueDataFg = removeDuplicates(mappedDataFg);
    
        // Update state with unique data for PDF generation
        setRowPdf(uniqueDataFg);
    };
    
    console.log("rowPdf", rowPdf)

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
                <button onClick={exportToExcel}  style={{ marginBottom: '10px' }}>
                    Export Selected Rows to Excel
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
                    <div>

                    {rowPdf ? (
                        <ChildPDFComponent rowPdf={rowPdf} />
                        ) : (
                            <div style={{ display: 'none' }}>Loading...</div> // Optional: show a loading indicator
                        )}
                    </div>
                </div>
            )}
    


        </div>
    );
    
};

export default DashTable;
