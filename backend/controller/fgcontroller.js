// Connect DB
const dbconnect = require('../DbConnect');
const { logUpdate } = require('../utility/historylog');

// Get all fg
const getFgs = async (req, res) => {
    try {
        dbconnect.query(`SELECT * FROM "fg" WHERE "Status" IN ('Active', 'Update') ORDER BY "Code_Fg" ASC `, (err, result) => {
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
                    data: result.rows, // PostgreSQL returns results in 'rows'
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
const getSigleFg = async (req, res) => {
    const id = req.params.id;
    try {
        dbconnect.query('SELECT * FROM "fg" WHERE "id" = $1', [id], (err, result) => {
            if (err) {
                console.log("An Error Occurred", err);
                res.status(500).json({
                    success: false,
                    msg: "An unexpected error occurred.",
                });
            } else {
                res.status(200).json({
                    success: true,
                    msg:`Retrieve Code_Fg id: ${id} Successful`,
                    data: result.rows, // PostgreSQL uses 'rows' to return query results
                });
            }
        });
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
    const {
        Code_Fg, Name_Fg, Model, Part_No, OE_Part_No, Code, Chem_Grade, Pcs_Per_Set, Box_No, Weight_Box, 
        Box_Erp_No, Rivet_No, Weight_Revit_Per_Set, Num_Revit_Per_Set, Revit_Erp_No, Remark
    } = req.body;
    const Status = "Active";
    // Access the user email from requireAuth middleware
    const userEmail = req.user.email; // This email comes from requireAuth
    const CreateBy = userEmail;
    console.log('userEmail:', userEmail)
    try {
        // First, check if the Code_Fg already exists in the database
        const checkSqlCommand = 'SELECT * FROM "fg" WHERE "Code_Fg" = $1';
        
        dbconnect.query(checkSqlCommand, [Code_Fg], (err, result) => {
            if (err) {
                console.error("Error checking Code_Fg:", err);
                return res.status(500).json({
                    success: false,
                    msg: "Database error occurred while checking for Code_Fg"
                });
            }

            if (result.rows.length > 0) {
                // Code_Fg already exists, return an error response
                return res.status(400).json({
                    success: false,
                    msg: "Code_Fg already exists, cannot save duplicate value"
                });
            } else {
                // Proceed with inserting new record since Code_Fg does not exist
                const sqlCommand = `
                    INSERT INTO "fg" ("Code_Fg", "Name_Fg", "Model", "Part_No", "OE_Part_No", "Code", "Chem_Grade", "Pcs_Per_Set", "Box_No", "Weight_Box", 
                    "Box_Erp_No", "Rivet_No", "Weight_Revit_Per_Set", "Num_Revit_Per_Set", "Revit_Erp_No", "Remark", "Status", "CreateBy") 
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
                `;

                dbconnect.query(sqlCommand, [
                    Code_Fg, Name_Fg, Model, Part_No, OE_Part_No, Code, Chem_Grade, Pcs_Per_Set, Box_No, Weight_Box, 
                    Box_Erp_No, Rivet_No, Weight_Revit_Per_Set, Num_Revit_Per_Set, Revit_Erp_No, Remark, Status, CreateBy
                ], (err, result) => {
                    if (err) {
                        console.error("Error occurred:", err);
                        return res.status(500).json({
                            success: false,
                            msg: "Database error occurred while saving Fg"
                        });
                    }

                    res.status(200).json({
                        success: true,
                        data: result,
                        msg: `Code_Fg: ${Code_Fg} was created successfully.`
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
    // Access the user email from requireAuth middleware
    const userEmail = req.user.email; // This email comes from requireAuth
    const CreateBy = userEmail;

    console.log('userEmail:', userEmail)
    try {
        // Extract "Code_Fg" values from the data (assuming it's the first column)
        const codes = data.map(row => row[0]);

        // Query the database to check if these "Code_Fg" values already exist
        const checkQuery = `SELECT "Code_Fg" FROM "fg" WHERE "Code_Fg" = ANY($1)`;
        dbconnect.query(checkQuery, [codes], (err, result) => {
            if (err) {
                // Return an error response if the query fails
                return res.status(400).json({
                    success: false,
                    msg: "There was an error with checking Code_Fg for duplicates",
                    data: err
                });
            }

            // Extract the existing "Code_Fg" values from the query result
            const existingRows = result.rows;
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
                    Remark: row[15],
                    Status: "Active", // Add Status with default value 'Active'
                    CreateBy: CreateBy // Add CreateBy as the userEmail
                }));

                // Create a values array and a parameterized query for multiple inserts
                const values = [];
                const valuePlaceholders = [];

                newDataObjects.forEach((obj, index) => {
                    // Each row needs its own set of placeholders ($1, $2, ..., $18) but with index offset
                    const start = index * 18 + 1; // Adjust placeholder count to 18
                    const placeholders = Array.from({ length: 18 }, (_, i) => `$${start + i}`).join(", ");
                    valuePlaceholders.push(`(${placeholders})`);

                    // Add the row values to the values array
                    values.push(
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
                        obj.Remark,
                        obj.Status, // Include Status in the values array
                        obj.CreateBy // Include CreateBy in the values array
                    );
                });

                // Prepare the INSERT query with dynamic placeholders
                const sqlCommand = `
                    INSERT INTO "fg" 
                    ("Code_Fg", "Name_Fg", "Model", "Part_No", "OE_Part_No", "Code", "Chem_Grade", "Pcs_Per_Set", "Box_No", "Weight_Box", "Box_Erp_No", "Rivet_No", "Weight_Revit_Per_Set", "Num_Revit_Per_Set", "Revit_Erp_No", "Remark", "Status", "CreateBy") 
                    VALUES ${valuePlaceholders.join(", ")}
                `;

                dbconnect.query(sqlCommand, values, (err, result) => {
                    if (err) {
                        // Update error message to include the specific Code_Fg
                        const failedCode = newDataObjects.find(obj => obj.Code_Fg === err.detail)?.Code_Fg || "unknown";
                        return res.status(400).json({
                            success: false,
                            msg: `There was an error with inserting Code_Fg: ${failedCode}`,
                            data: err
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
            msg: "There was a problem with posting Excel data",
            data: error
        });
    }
};





//Update Fg
const updateFg = async (req, res) => {
    const userEmail = req.user.email; // This email comes from requireAuth
    console.log('userEmail:', userEmail);
    const UpdateBy = userEmail;
    const id = req.params.id;
    const Status = "Update";
    const {
        Code_Fg, Name_Fg, Model, Part_No, OE_Part_No, Code, Chem_Grade,
        Pcs_Per_Set, Box_No, Weight_Box, Box_Erp_No, Rivet_No, 
        Weight_Revit_Per_Set, Num_Revit_Per_Set, Revit_Erp_No, Remark
    } = req.body;

    const sqlCommand = `
        UPDATE "fg"
        SET "Code_Fg" = $1, "Name_Fg" = $2, "Model" = $3, "Part_No" = $4,
            "OE_Part_No" = $5, "Code" = $6, "Chem_Grade" = $7, "Pcs_Per_Set" = $8,
            "Box_No" = $9, "Weight_Box" = $10, "Box_Erp_No" = $11, "Rivet_No" = $12,
            "Weight_Revit_Per_Set" = $13, "Num_Revit_Per_Set" = $14, "Revit_Erp_No" = $15,
            "Remark" = $16, "Status" = $17
        WHERE "id" = $18
    `;
    const values = [
        Code_Fg, Name_Fg, Model, Part_No, OE_Part_No, Code, Chem_Grade,
        Pcs_Per_Set, Box_No, Weight_Box, Box_Erp_No, Rivet_No, 
        Weight_Revit_Per_Set, Num_Revit_Per_Set, Revit_Erp_No, Remark,Status , id
    ];

    try {
        //Query Current record before update
        const selectedQuery = `SELECT * FROM "fg" WHERE "id" = $1`;
        const selectedResult = await dbconnect.query(selectedQuery, [id]);

        //update status
        dbconnect.query(sqlCommand, values, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    msg: `There was a problem updating Code_Fg: ${Code_Fg}`,
                    data: err,
                    success: false
                });
            } else {
                if (selectedResult.rows.length > 0) {
                    const oldValues = selectedResult.rows[0];
                    
                    // Log changes
                    for (const column of ["Code_Fg", "Name_Fg", "Model", "Part_No", "OE_Part_No", "Code", "Chem_Grade", "Pcs_Per_Set", "Box_No", "Weight_Box", "Box_Erp_No", "Rivet_No", "Weight_Revit_Per_Set", "Num_Revit_Per_Set", "Revit_Erp_No", "Remark"]) {
                        const oldValue = oldValues[column];
                        const newValue = req.body[column];
                        console.log('oldValues', oldValue);
                        console.log('newValue', newValue)

                        if (oldValue !== newValue) {
                            logUpdate('fg', column, id , oldValue, newValue, UpdateBy);

                        }
                    }
                }
                res.status(200).json({
                    msg: `Code_Fg: ${Code_Fg} was updated successfully`,
                    data: result,
                    success: true
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            msg: "Connection interrupted by internet",
            data: error,
            success: false
        });
    }
};


//Delete Fg
const deleteFg = async (req, res) => {
    const id = req.params.id;
    const Status = "Delete";

    const userEmail = req.user.email; // This email comes from requireAuth
    console.log('userEmail:', userEmail);
    const UpdateBy = userEmail;
    try {
        //Query Current Record
        const selectedQuery = `SELECT * FROM "fg" WHERE "id" = $1`;
        const selectedResult = await dbconnect.query(selectedQuery, [id]);
        //Update Status
        dbconnect.query('UPDATE "fg" SET "Status" = $1 WHERE "id" = $2', [Status, id], (err, result) => {
            if (err) {
                console.log("Delete Error Occurred", err);
                res.status(500).json({
                    msg: 'An unexpected error occurred',
                    success: false,
                    data: result
                });
            } else {
                if (selectedResult.rows.length > 0) {
                    const oldValues = selectedResult.rows[0];
                    
                    // Log changes
                    for (const column of ["Status"]) {
                        const oldValue = oldValues[column];
                        const newValue = Status;
                        console.log('oldValues', oldValue);
                        console.log('newValue', newValue)

                        if (oldValue !== newValue) {
                            logUpdate('fg', column, id , oldValue, newValue, UpdateBy);

                        }
                    }
                }
                res.status(200).json({
                    success: true,
                    msg: `Record ${id} was deleted`,
                    data: result
                });
            }
        });
    } catch (error) {
        console.error('Error in deleteFg:', error);
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
