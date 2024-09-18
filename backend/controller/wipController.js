const dbconnect = require('../DbConnect');

//Get all Wip
const getWip = async (req, res) => {
    try {
        dbconnect.query('SELECT * FROM "wip"', (err, result) => {
            if (err) {
                res.status(400).json({
                    success: false,
                    msg: "There sth Error with Retrieve Wip Database.",
                    data: err
                });
            } else {
                res.status(200).json({
                    success: true,
                    msg: "Query wip successful",
                    data: result.rows // PostgreSQL stores result data in 'rows'
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
                ("Code_Wip", "Name_Wip", "Code_Mold", "Dimension", "Chem_Grade", "Weight_Per_Pcs", "Pcs_Per_Mold", "Pcs_Per_Set", "Type_Brake", "Type_Mold", "Time_Per_Mold", "Mold_Per_8_Hour", "Remark") 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            `;
            dbconnect.query(insertSqlCommand, [Code_Wip, Name_Wip, Code_Mold, Dimension, Chem_Grade, Weight_Per_Pcs, Pcs_Per_Mold, Pcs_Per_Set, Type_Brake, Type_Mold, Time_Per_Mold, Mold_Per_8_Hour, Remark], (insertErr, insertResult) => {
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

        // Define which columns are of type double precision. Adjust indices as needed.
        data = data.map(row => row.map(value => value === "" || value === null ? "-" : value));


        
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
                console.log('data',data);
                
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
                console.log(err.message)
                throw new Error(`Error while checking duplicates: ${err.message}`);
                
            }
        };

        // Function to insert non-duplicate records into the database
        const insertNonDuplicateRecords = async () => {
            if (nonDuplicateData.length === 0) {
                return res.status(200).json({
                    success: true,
                    insertedCount: insertedCount,
                    duplicateCount: duplicateCount,
                    msg: `0 records were inserted successfully. ${duplicateCount} records were duplicates.`
                });
            }

            const sqlCommand = `
                INSERT INTO "wip"("Code_Wip", "Name_Wip", "Code_Mold", "Dimension", "Chem_Grade", "Weight_Per_Pcs", "Pcs_Per_Mold", "Pcs_Per_Set", "Type_Brake", "Type_Mold", "Time_Per_Mold", "Mold_Per_8_Hour", "Remark") 
                VALUES ${nonDuplicateData.map(row => `(${row.map(value => value === null ? 'NULL' : `'${value}'`).join(", ")})`).join(", ")}
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
    const id = req.params.id;
    const { Code_Wip, Name_Wip, Code_Mold, Dimension, Chem_Grade, Weight_Per_Pcs, Pcs_Per_Mold, Pcs_Per_Set, Type_Brake, Type_Mold, Time_Per_Mold, Mold_Per_8_Hour, Remark } = req.body;

    // Using double quotes for PostgreSQL field names
    const sqlCommand = `UPDATE "wip" 
                        SET "Code_Wip" = $1, "Name_Wip" = $2, "Code_Mold" = $3, "Dimension" = $4, "Chem_Grade" = $5, "Weight_Per_Pcs" = $6, 
                            "Pcs_Per_Mold" = $7, "Pcs_Per_Set" = $8, "Type_Brake" = $9, "Type_Mold" = $10, "Time_Per_Mold" = $11, 
                            "Mold_Per_8_Hour" = $12, "Remark" = $13 
                        WHERE "id" = $14`;

    const values = [Code_Wip, Name_Wip, Code_Mold, Dimension, Chem_Grade, Weight_Per_Pcs, Pcs_Per_Mold, Pcs_Per_Set, Type_Brake, Type_Mold, Time_Per_Mold, Mold_Per_8_Hour, Remark, id];

    try {
        dbconnect.query(sqlCommand, values, (err, result) => {
            if (err) {
                console.log("err", err);
                res.status(500).json({
                    msg: "There was an error while querying the database",
                    success: false,
                    data: err
                });
            } else {
                res.status(200).json({
                    msg: `Wip Id: ${id} & Code_Wip: ${Code_Wip} was updated successfully`,
                    success: true,
                    data: result
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            msg: "There was an error with the connection",
            success: false,
            data: error
        });
    }
}



//Dellete Wip
const deleteWip = async (req, res) => {
    const id = req.params.id;
    try {
        dbconnect.query('DELETE FROM "wip" WHERE "id" = $1', [id], (err, result) => {
            if (err) {
                res.status(400).json({
                    msg: "There are some Problem",
                    data: err,
                    success: false
                });
            } else {
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