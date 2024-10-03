const dbconnect = require('../DbConnect');
const { logUpdate } = require('../utility/historylog')
//Get all Wip
const getWip = async (req, res) => {
    try {
        dbconnect.query(`SELECT * FROM "wip" WHERE "Status" IN ('Active', 'Update') ORDER BY "Code_Wip" ASC`, (err, result) => {
            if (err) {
                console.log(err)
                res.status(400).json({
                    success: false,
                    msg: "There sth Error with Retrieve Wip Database.",
                    data: err
                });
            } else {
                res.status(200).json({
                    success: true,
                    msg: "Query wip successful",
                    data: result.rows, // PostgreSQL stores result data in 'rows'
                    count: result.rows.length // PostgreSQL stores result data in 'rows'
                });
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: "There sth Error with Retrieve Wip Database.",
            data: error
        });
    }
};

//get single wip
const getSingleWip = async (req, res) => {
    const id = req.params.id;
    try {
        const query = 'SELECT * FROM "wip" WHERE "id" = $1';  // Use parameterized query for PostgreSQL
        dbconnect.query(query, [id], (err, result) => {
            if (err) {
                res.status(400).json({
                    success: false,
                    msg: "There is an error with retrieving the Wip data from the database.",
                    data: err
                });
            } else {
                res.status(200).json({
                    success: true,
                    msg: `Query wip id: ${id} successful`,
                    data: result.rows  // PostgreSQL returns rows in result.rows
                });
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: "There is an error with retrieving the Wip data from the database.",
            data: error
        });
    }
};


//post wip
const postWip = async (req, res) => {
    const { Code_Wip, Name_Wip, Code_Mold, Dimension, Chem_Grade, Weight_Per_Pcs, Pcs_Per_Mold, Pcs_Per_Set, Type_Brake, Type_Mold, Time_Per_Mold, Mold_Per_8_Hour, Remark } = req.body;
    const Status = "Active";
    // Access the user email from requireAuth middleware
    const userEmail = req.user.email; // This email comes from requireAuth
    console.log('userEmail:', userEmail)
    const CreateBy = userEmail;
    // Define the query to check for duplicates
    const checkSqlCommand = `
        SELECT * FROM "wip"
        WHERE "Code_Wip" = $1 
          AND "Name_Wip" = $2 
          AND "Code_Mold" = $3 
          AND "Dimension" = $4 
          AND "Chem_Grade" = $5 
          AND "Weight_Per_Pcs" = $6 
          AND "Pcs_Per_Mold" = $7 
          AND "Pcs_Per_Set" = $8 
          AND "Type_Brake" = $9 
          AND "Type_Mold" = $10 
          AND "Time_Per_Mold" = $11 
          AND "Mold_Per_8_Hour" = $12 
          AND "Remark" = $13
    `;

    try {
        // Check for duplicates
        dbconnect.query(checkSqlCommand, [Code_Wip, Name_Wip, Code_Mold, Dimension, Chem_Grade, Weight_Per_Pcs, Pcs_Per_Mold, Pcs_Per_Set, Type_Brake, Type_Mold, Time_Per_Mold, Mold_Per_8_Hour, Remark], (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    msg: "Error checking for duplicates.",
                    data: err
                });
            }

            if (result.rows.length > 0) {
                // Record already exists
                return res.status(400).json({
                    success: false,
                    msg: "Record with these values already exists.",
                    data: result.rows
                });
            }

            // Record doesn't exist, proceed with insertion
            const insertSqlCommand = `
                INSERT INTO "wip" 
                ("Code_Wip", "Name_Wip", "Code_Mold", "Dimension", "Chem_Grade", "Weight_Per_Pcs", "Pcs_Per_Mold", "Pcs_Per_Set", "Type_Brake", "Type_Mold", "Time_Per_Mold", "Mold_Per_8_Hour", "Remark", "Status", "CreateBy") 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            `;
            dbconnect.query(insertSqlCommand, [Code_Wip, Name_Wip, Code_Mold, Dimension, Chem_Grade, Weight_Per_Pcs, Pcs_Per_Mold, Pcs_Per_Set, Type_Brake, Type_Mold, Time_Per_Mold, Mold_Per_8_Hour, Remark, Status, CreateBy], (insertErr, insertResult) => {
                if (insertErr) {
                    return res.status(500).json({
                        success: false,
                        msg: "Error saving Wip record.",
                        data: insertErr
                    });
                }

                return res.status(200).json({
                    success: true,
                    msg: `Wip: ${Code_Wip} record saved successfully.`,
                    data: insertResult
                });
            });
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: "An error occurred.",
            data: error
        });
    }
};





const postWipExcel = async (req, res) => {
    try {
        // Get value from request (Http)
        let data = req.body;  // Array of objects

        // Replace blank or null values with "-"
        data = data.map(row => row.map(value => value === "" || value === null ? "-" : value));

        // Access the user email from requireAuth middleware
        const userEmail = req.user.email; // This email comes from requireAuth
        console.log('userEmail:', userEmail)
        const CreateBy = userEmail;
        let duplicateCount = 0;
        let insertedCount = 0;
        const nonDuplicateData = [];

        // Function to check if a record already exists in the database
        const checkDuplicate = async (row) => {
            const [Code_Wip, Name_Wip, Code_Mold, Dimension, Chem_Grade, Weight_Per_Pcs, Pcs_Per_Mold, Pcs_Per_Set, Type_Brake, Type_Mold, Time_Per_Mold, Mold_Per_8_Hour, Remark] = row;

            const checkDuplicateSql = `
                SELECT COUNT(*) AS count
                FROM "wip"
                WHERE "Code_Wip" = $1
                  AND "Name_Wip" = $2
                  AND "Code_Mold" = $3
                  AND "Dimension" = $4
                  AND "Chem_Grade" = $5
                  AND "Weight_Per_Pcs" = $6
                  AND "Pcs_Per_Mold" = $7
                  AND "Pcs_Per_Set" = $8
                  AND "Type_Brake" = $9
                  AND "Type_Mold" = $10
                  AND "Time_Per_Mold" = $11
                  AND "Mold_Per_8_Hour" = $12
                  AND "Remark" = $13
            `;

            try {
                const result = await dbconnect.query(checkDuplicateSql, [
                    Code_Wip, Name_Wip, Code_Mold, Dimension, Chem_Grade, Weight_Per_Pcs,
                    Pcs_Per_Mold, Pcs_Per_Set, Type_Brake, Type_Mold, Time_Per_Mold, Mold_Per_8_Hour, Remark
                ]);

                if (result.rows[0].count === '0') {
                    nonDuplicateData.push(row);  // Only push if no duplicate found
                } else {
                    duplicateCount++;  // Increment duplicate count
                }
            } catch (err) {
                throw new Error(`Error while checking duplicates: ${err.message}`);
            }
        };

        // Function to insert non-duplicate records into the database with 'Status' field as 'Active' and 'CreateBy' field as the userEmail
        const insertNonDuplicateRecords = async () => {
            if (nonDuplicateData.length === 0) {
                return res.status(200).json({
                    success: true,
                    insertedCount: insertedCount,
                    duplicateCount: duplicateCount,
                    msg: `0 records were inserted successfully. ${duplicateCount} records were duplicates.`
                });
            }

            // Include 'Status' field as 'Active' and 'CreateBy' field with the user email when inserting records
            const sqlCommand = `
                INSERT INTO "wip"("Code_Wip", "Name_Wip", "Code_Mold", "Dimension", "Chem_Grade", "Weight_Per_Pcs", "Pcs_Per_Mold", "Pcs_Per_Set", "Type_Brake", "Type_Mold", "Time_Per_Mold", "Mold_Per_8_Hour", "Remark", "Status", "CreateBy") 
                VALUES ${nonDuplicateData.map(row => `(${row.map(value => value === null ? 'NULL' : `'${value}'`).join(", ")}, 'Active', '${CreateBy}')`).join(", ")}
            `;

            try {
                const result = await dbconnect.query(sqlCommand);
                insertedCount = nonDuplicateData.length;  // Update inserted count
                return res.status(200).json({
                    success: true,
                    insertedCount: insertedCount,
                    duplicateCount: duplicateCount,
                    msg: `${insertedCount} records were inserted successfully. ${duplicateCount} records were duplicates.`,
                    data: result
                });
            } catch (err) {
                return res.status(400).json({
                    success: false,
                    msg: "There was an error posting WIP data to the database.",
                    data: err
                });
            }
        };

        // Check duplicates and then insert non-duplicate records
        for (const row of data) {
            await checkDuplicate(row);
        }

        await insertNonDuplicateRecords();

    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: "An unexpected error occurred.",
            data: err.message
        });
    }
};












const updateWip = async (req, res) => {
    // Access the user email from requireAuth middleware
    const userEmail = req.user.email; // This email comes from requireAuth
    console.log('userEmail:', userEmail);
    const UpdateBy = userEmail;
    const id = req.params.id;
    const Status = "Update";
    const { Code_Wip, Name_Wip, Code_Mold, Dimension, Chem_Grade, Weight_Per_Pcs, Pcs_Per_Mold, Pcs_Per_Set, Type_Brake, Type_Mold, Time_Per_Mold, Mold_Per_8_Hour, Remark } = req.body;

    // Using double quotes for PostgreSQL field names
    const sqlCommand = `UPDATE "wip" 
                        SET "Code_Wip" = $1, "Name_Wip" = $2, "Code_Mold" = $3, "Dimension" = $4, "Chem_Grade" = $5, "Weight_Per_Pcs" = $6, 
                            "Pcs_Per_Mold" = $7, "Pcs_Per_Set" = $8, "Type_Brake" = $9, "Type_Mold" = $10, "Time_Per_Mold" = $11, 
                            "Mold_Per_8_Hour" = $12, "Remark" = $13, "Status" = $14 
                        WHERE "id" = $15`;

    const values = [Code_Wip, Name_Wip, Code_Mold, Dimension, Chem_Grade, Weight_Per_Pcs, Pcs_Per_Mold, Pcs_Per_Set, Type_Brake, Type_Mold, Time_Per_Mold, Mold_Per_8_Hour, Remark, Status, id];

    try {
        //Check Oldvalue before update
        // Update was successful, now fetch the old values
        const selectedQuery = `SELECT * FROM "wip" WHERE "id" = $1`;
        const selectedResult = await dbconnect.query(selectedQuery, [id]);


        // Perform the update
        dbconnect.query(sqlCommand, values, async (err, result) => {
            if (err) {
                console.log("err", err);
                res.status(500).json({
                    msg: "There was an error while querying the database",
                    success: false,
                    data: err
                });
            } else {
                try {
                    if (selectedResult.rows.length > 0) {
                        const oldValues = selectedResult.rows[0];
                        
                        // Log changes
                        for (const column of ["Code_Wip", "Name_Wip", "Code_Mold", "Dimension", "Chem_Grade", "Weight_Per_Pcs", "Pcs_Per_Mold", "Pcs_Per_Set", "Type_Brake", "Type_Mold", "Time_Per_Mold", "Mold_Per_8_Hour", "Remark"]) {
                            const oldValue = oldValues[column];
                            const newValue = req.body[column];
                            console.log('oldValues', oldValue);
                            console.log('newValue', newValue)
                            if (oldValue !== newValue) {
                                await logUpdate('wip', column, id , oldValue, newValue, UpdateBy);

                            }
                        }

                        res.status(200).json({
                            msg: `Wip Id: ${id} & Code_Wip: ${Code_Wip} was updated successfully`,
                            success: true,
                            data: result
                        });
                    } else {
                        // No row found with the given id
                        res.status(404).json({
                            msg: `No record found with ID: ${id}`,
                            success: false
                        });
                    }
                } catch (queryErr) {
                    console.error("Error fetching updated row:", queryErr);
                    res.status(500).json({
                        msg: "There was an error fetching the updated row",
                        success: false,
                        data: queryErr
                    });
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            msg: "There was an error with the connection",
            success: false,
            data: error
        });
    }
};



//Delete Wip
const deleteWip = async (req, res) => {
    const id = req.params.id;
    const Status = "Delete"
    // Access the user email from requireAuth middleware
    const userEmail = req.user.email; // This email comes from requireAuth
    console.log('userEmail:', userEmail);
    const UpdateBy = userEmail;
    try {
        //Query value before update status
        const selectedQuery = `SELECT * FROM "wip" WHERE "id" = $1`;
        const selectedResult = await dbconnect.query(selectedQuery, [id]);

        //Update status to Update
        dbconnect.query('UPDATE "wip" SET "Status" = $1 WHERE "id" = $2', [Status, id], (err, result) => {
            if (err) {
                res.status(400).json({
                    msg: "There are some Problem",
                    data: err,
                    success: false
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
                            logUpdate('wip', column, id , oldValue, newValue, UpdateBy);

                        }
                    }
                }
                res.status(200).json({
                    success: true,
                    msg: `Delete record ${id} successfully`,
                    data: result
                });
            }
        });
    } catch (error) {
        res.status(400).json({
            msg: "There are some Problem with connection",
            data: error,
            success: false
        });
    }
}

module.exports ={
    getWip,
    getSingleWip,
    postWip,
    deleteWip,
    updateWip,
    postWipExcel

}