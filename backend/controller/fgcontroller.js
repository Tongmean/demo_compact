// Connect DB
const dbconnect = require('../DbConnect');

// Get all fg
const getFgs = async (req, res) => {
    try {
        dbconnect.query("SELECT * FROM Fg", (err, result) => {
            if (err) {
                console.error("Database query error:", err);
                res.status(500).json({
                    success: false,
                    msg: "Failed to retrieve data from the database.",
                    data: err
                });
            } else {
                res.status(200).json({
                    success: true,
                    data: result,
                    msg: "Retrieve data from the database successful"
                });
            }
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({
            success: false,
            msg: "An unexpected error occurred.",
            data: error
        });
    }
};
//Get single Fg
const getSigleFg = async (req, res) =>{
    const id = req.params.id;
    try {
        dbconnect.query("SELECT * FROM FG WHERE id = ?", id,(err, result)=>{
            if(err){
                console.log("An Error Accur",err)
                res.status(500).json({
                    success: false,
                    msg:"An unexpected error occurred.",
                })
            }else{
                res.status(200).json({
                    success: true,
                    data: result
                })
            }
        })
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({
            success: false,
            msg: "An unexpected error occurred.",
        });
    }
}
//create fg
const postFg = async (req, res) => {
    const {Code_Fg, Name_Fg, Model, Part_No, OE_Part_No, Code, Chem_Grade, Pcs_Per_Set, Box_No, Weight_Box, 
        Box_Erp_No, Rivet_No, Weight_Revit_Per_Set, Num_Revit_Per_Set, Revit_Erp_No, Remark} = req.body;

    try {
        // First, check if the Code_Fg already exists in the database
        const checkSqlCommand = "SELECT * FROM Fg WHERE Code_Fg = ?";
        
        dbconnect.query(checkSqlCommand, [Code_Fg], (err, result) => {
            if (err) {
                console.error("Error checking Code_Fg:", err);
                return res.status(500).json({
                    success: false,
                    msg: "Database error occurred while checking for Code_Fg"
                });
            }

            if (result.length > 0) {
                // Code_Fg already exists, return an error response
                return res.status(400).json({
                    success: false,
                    msg: "Code_Fg already exists, cannot save duplicate value"
                });
            } else {
                // Proceed with inserting new record since Code_Fg does not exist
                const sqlCommand = "INSERT INTO Fg (Code_Fg, Name_Fg, Model, Part_No, OE_Part_No, Code, Chem_Grade, Pcs_Per_Set, Box_No, Weight_Box, Box_Erp_No, Rivet_No, Weight_Revit_Per_Set, Num_Revit_Per_Set, Revit_Erp_No, Remark) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                dbconnect.query(sqlCommand, [Code_Fg, Name_Fg, Model, Part_No, OE_Part_No, Code, Chem_Grade, Pcs_Per_Set, Box_No, Weight_Box, Box_Erp_No, Rivet_No, Weight_Revit_Per_Set, Num_Revit_Per_Set, Revit_Erp_No, Remark], (err, result) => {
                    if (err) {
                        console.log("Error occurred:", err);
                        return res.status(500).json({
                            success: false,
                            msg: "Database error occurred while saving Fg"
                        });
                    }

                    res.status(200).json({
                        success: true,
                        data: result,
                        msg: `Code_Fg: ${Code_Fg} was created Successful.`
                    });
                });
            }
        });
    } catch (error) {
        console.error('Error in postFg:', error);
        res.status(500).json({ 
            msg: 'An unexpected error occurred',
            success: false
        });
    }
};

//postfgexcel
const postfgexcel = async (req, res) => {
    // Retrieve data from the request body
    let data = req.body;

    // Ensure no fields are empty; replace empty or null values with "-"
    data = data.map(row => row.map(value => value === "" || value === null ? "-" : value));

    try {
        // Extract Code_Fg values from the data (assuming it's the first column)
        const codes = data.map(row => row[0]);

        // Query the database to check if these Code_Fg values already exist
        const checkQuery = `SELECT Code_Fg FROM Fg WHERE Code_Fg IN (?)`;
        dbconnect.query(checkQuery, [codes], (err, existingRows) => {
            if (err) {
                // Return an error response if the query fails
                return res.status(400).json({
                    success: false,
                    msg: "There error with check Code_Fg duplicate",
                    data: err

                });
            }
            
            // Extract the existing Code_Fg values from the query result
            const existingCodes = existingRows.map(row => row.Code_Fg);

            // Separate the data into new records (not in the existingCodes) and existing records
            const newData = data.filter(row => !existingCodes.includes(row[0]));
            const existingData = data.filter(row => existingCodes.includes(row[0]));
            
            if (newData.length > 0) {
                // Convert newData into an array of objects with named keys for SQL insertion
                const newDataObjects = newData.map(row => ({
                    Code_Fg: row[0],
                    Name_Fg: row[1],
                    Model: row[2],
                    Part_No: row[3],
                    OE_Part_No: row[4],
                    Code: row[5],
                    Chem_Grade: row[6],
                    Pcs_Per_Set: row[7],
                    Box_No: row[8],
                    Weight_Box: row[9],
                    Box_Erp_No: row[10],
                    Rivet_No: row[11],
                    Weight_Revit_Per_Set: row[12],
                    Num_Revit_Per_Set: row[13],
                    Revit_Erp_No: row[14],
                    Remark: row[15]
                }));

                // Prepare the values for insertion by mapping each object to an array of values
                const values = newDataObjects.map(obj => [
                    obj.Code_Fg,
                    obj.Name_Fg,
                    obj.Model,
                    obj.Part_No,
                    obj.OE_Part_No,
                    obj.Code,
                    obj.Chem_Grade,
                    obj.Pcs_Per_Set,
                    obj.Box_No,
                    obj.Weight_Box,
                    obj.Box_Erp_No,
                    obj.Rivet_No,
                    obj.Weight_Revit_Per_Set,
                    obj.Num_Revit_Per_Set,
                    obj.Revit_Erp_No,
                    obj.Remark
                ]);

                // Insert new records into the database
                const sqlCommand = `INSERT INTO Fg (Code_Fg, Name_Fg, Model, Part_No, OE_Part_No, Code, Chem_Grade, Pcs_Per_Set, Box_No, Weight_Box, Box_Erp_No, Rivet_No, Weight_Revit_Per_Set, Num_Revit_Per_Set, Revit_Erp_No, Remark) VALUES ?`;
                dbconnect.query(sqlCommand, [values], (err, result) => {
                    if (err) {
                        // Return an error response if the insertion fails
                        return res.status(400).json({
                            success: false,
                            msg: `There error with Insert Code_Fg: ${Code_Fg}`,
                            data: result
                        });
                    }

                    // Return a success response with the count of inserted and skipped records
                    res.status(200).json({
                        success: true,
                        msg: `Insert data successful. Inserted ${newData.length} records. ${existingData.length} records were skipped as they already exist.`,
                        data: result
                    });
                });
            } else {
                // Return a response if all records already exist
                res.status(200).json({
                    success: true,
                    msg: `All records already exist. Skipped ${existingData.length} records.`,
                    data: existingData
                });
            }
        });
    } catch (error) {
        // Return a response if there is an exception during processing
        res.status(400).json({
            success: false,
            msg:"There Got Problem with Post Excel",
            data: error
        });
    }
};
//Update Fg
const updateFg = async(req, res) =>{
    const id = req.params.id;
    const {Code_Fg, Name_Fg, Model, Part_No, OE_Part_No, Code, Chem_Grade, Pcs_Per_Set, Box_No, Weight_Box, Box_Erp_No, Rivet_No, Weight_Revit_Per_Set, Num_Revit_Per_Set, Revit_Erp_No, Remark} = req.body;
    const sqlCommand = "UPDATE fg SET Code_Fg = ?, Name_Fg = ?, Model =?, Part_No=?, OE_Part_No=?, Code=?, Chem_Grade=?, Pcs_Per_Set=?, Box_No=?, Weight_Box=?, Box_Erp_No =?, Rivet_No=?, Weight_Revit_Per_Set=?, Num_Revit_Per_Set=?, Revit_Erp_No=?, Remark=? WHERE id = ? ";
    const value = [Code_Fg, Name_Fg, Model, Part_No, OE_Part_No, Code, Chem_Grade, Pcs_Per_Set, Box_No, Weight_Box, Box_Erp_No, Rivet_No, Weight_Revit_Per_Set, Num_Revit_Per_Set, Revit_Erp_No, Remark, id];

    try {
        dbconnect.query(sqlCommand, value, (err, result)=>{
            if(err){
                console.log(err)
                res.status(500).json({
                    msg: `There was problems while update Code_Fg: ${Code_Fg}`,
                    data: err,
                    success: false
                })
            }else{
                res.status(200).json({
                    msg: `Code_Fg: ${Code_Fg} was update successful`,
                    data: result
                })
            }
        })
    } catch (error) {
        res.status(500).json({
            msg: "Connection Interupt by internet",
            data: err,
            success: false
        })
    }

}

//Delete Fg
const deleteFg = async (req, res) =>{
    const id = req.params.id;
    try {
        dbconnect.query("DELETE FROM Fg WHERE id = ?", id, (err, result)=>{
            if(err){
                console.log("Delete Error Accur", err);
                res.status(500).json({
                    msg: 'An unexpected error occurred',
                    success: false,
                    data: result
                })
            }else{
                res.status(200).json({
                    success: true,
                    msg: `Record ${id} was deleted`,
                    data: result
                })
            }
        })
    } catch (error) {
        console.error('Error in postFg:', error);
        res.status(500).json({ 
            msg: 'An unexpected error occurred',
            success: false
        });
    }
}
module.exports = {
    getFgs,
    getSigleFg,
    postFg,
    postfgexcel,
    deleteFg,
    updateFg
};
