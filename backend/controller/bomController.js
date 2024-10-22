//Connect DB
const dbconnect = require('../DbConnect');
const { logUpdate } = require('../utility/historylog');
//Get All boms
const getBoms = async (req, res) => {
    try {
        dbconnect.query(`SELECT * FROM "bom" WHERE "Status" IN ('Active', 'Update') ORDER BY "Code_Fg" ASC `, (err, result) => { // Wrapped bom table in double quotes
            if (err) {
                res.status(500).json({
                    success: false,
                    msg: "Retrieve Bom Unsuccessful",
                    data: err // 'result' would be undefined in case of error
                });
            } else {
                res.status(200).json({
                    success: true,
                    msg: "Retrieve Bom Successful",
                    data: result.rows // PostgreSQL returns data in 'rows'
                });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "There were problems with the retrieve Bom process",
            data: error
        });
    }
};



const getSigleBom = async (req,res) =>{
    const id = req.params.id
    try {
        dbconnect.query('SELECT * FROM bom WHERE id = $1' , [id],(err, result) =>{
            if(err){
                console.log(err);
                res.status(500).json({
                    success: true,
                    msg: `There Problems With retrieve Bom id: ${id}`,
                    data: err
                })
            }else{
                res.status(200).json({
                    success: true,
                    msg: `Bom id: ${id} Retrierve successful`,
                    data: result.rows
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            success: true,
            msg: `There Problems With retrieve Bom id: ${id}`,
            data: error
        })
    }

}
// Post json to database
const postBom = async (req, res) => {
    const { Code_Fg, Name_Fg, Code_Dr, Name_Dr, Code_Wip, Name_Wip, Ra_Wip, Ra_L, Remark } = req.body;
    const Status = "Active";
        // Access the user email from requireAuth middleware
    const userEmail = req.user.email; // This email comes from requireAuth
    const CreateBy = userEmail;
    console.log('userEmail:', userEmail)
    try {
        // First, check if the Code_Dr already exists in the database
        const checkSqlCommand = 'SELECT * FROM "bom" WHERE "Code_Dr" = $1';

        dbconnect.query(checkSqlCommand, [Code_Dr], (err, result) => {
            if (err) {
                console.error("Error checking Code_Dr:", err);
                return res.status(500).json({
                    success: false,
                    msg: "Database error occurred while checking for Code_Dr",
                    data: err
                });
            }

            if (result.rows.length > 0) {
                // Code_Dr already exists, return an error response
                return res.status(400).json({
                    success: false,
                    msg: "Code_Dr already exists, cannot save duplicate value",
                    data: result.rows
                });
            } else {
                // Proceed with inserting new record since Code_Dr does not exist
                const sqlCommand = 'INSERT INTO "bom" ("Code_Fg", "Name_Fg", "Code_Dr", "Name_Dr", "Code_Wip", "Name_Wip", "Ra_Wip", "Ra_L", "Remark", "Status", "CreateBy") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *';

                dbconnect.query(sqlCommand, [Code_Fg, Name_Fg, Code_Dr, Name_Dr, Code_Wip, Name_Wip, Ra_Wip, Ra_L, Remark, Status, CreateBy], (err, result) => {
                    if (err) {
                        console.log("Error occurred:", err);
                        return res.status(500).json({
                            success: false,
                            msg: "Database error occurred while saving Bom",
                            data:err
                        });
                    }

                    res.status(200).json({
                        success: true,
                        data: result.rows[0],
                        msg: `Bom record: ${Code_Fg} was created successfully.`
                    });
                });
            }
        });
    } catch (error) {
        console.error('Error in postBom:', error);
        res.status(500).json({
            msg: 'An unexpected error occurred',
            success: false
        });
    }
};






//Post bom excel postgresql
const postBomExcel = async (req, res) => {
    let data = req.body;  // Array of rows from the client

    // Ensure no fields are empty; replace empty or null values with "-"
    data = data.map(row => row.map(value => value === "" || value === null ? "-" : value));

    // Access the user email from requireAuth middleware
    const userEmail = req.user.email; // This email comes from requireAuth
    console.log('userEmail:', userEmail);

    try {
        // Extract Code_Dr values from the data (assuming it's the third column)
        const codeDrArray = data.map(row => row[2]);

        // Query the database to check if these Code_Dr values already exist
        const checkSql = 'SELECT "Code_Dr" FROM "bom" WHERE "Code_Dr" = ANY($1)';
        const { rows: existingRows } = await dbconnect.query(checkSql, [codeDrArray]);

        // Extract existing Code_Dr values from the query result
        const existingCodeDrs = existingRows.map(row => row.Code_Dr);

        // Separate the data into new records (not in existingCodeDrs) and existing records
        const newData = data.filter(row => !existingCodeDrs.includes(row[2]));
        const existingData = data.filter(row => existingCodeDrs.includes(row[2]));

        if (newData.length > 0) {
            // Convert newData into an array of arrays with values for SQL insertion
            const values = newData.map(row => [
                row[0], // Code_Fg
                row[1], // Name_Fg
                row[2], // Code_Dr
                row[3], // Name_Dr
                row[4], // Code_Wip
                row[5], // Name_Wip
                row[6], // Ra_Wip
                row[7], // Ra_L
                row[8], // Remark
                "Active", // Status (set to "Active")
                userEmail // CreateBy (user email)
            ]);

            // Create SQL command with placeholders
            const sqlCommand = `
                INSERT INTO "bom" ("Code_Fg", "Name_Fg", "Code_Dr", "Name_Dr", "Code_Wip", "Name_Wip", "Ra_Wip", "Ra_L", "Remark", "Status", "CreateBy")
                VALUES ${values.map((_, i) => `($${i * 11 + 1}, $${i * 11 + 2}, $${i * 11 + 3}, $${i * 11 + 4}, $${i * 11 + 5}, $${i * 11 + 6}, $${i * 11 + 7}, $${i * 11 + 8}, $${i * 11 + 9}, $${i * 11 + 10}, $${i * 11 + 11})`).join(', ')}
            `;

            // Flatten values array for query parameters
            const flatValues = values.flat();

            // Insert new records into the database
            await dbconnect.query(sqlCommand, flatValues);

            res.status(200).json({
                success: true,
                msg: `Insert data successful. Inserted ${newData.length} records. ${existingData.length} records were skipped as they already exist.`,
                data: newData
            });
        } else {
            // Return a response if all records already exist
            res.status(200).json({
                success: true,
                msg: `All records already exist. Skipped ${existingData.length} records.`,
                data: existingData
            });
        }
    } catch (error) {
        // Return a response if there is an exception during processing
        res.status(400).json({
            success: false,
            msg: "There was a problem processing the request",
            data: error
        });
        console.log(error);
    }
};




//update bom by Puut Method
// const updatebom = async (req, res) =>{
//     //get value form request(Http)
//     const id = req.params.id;
//     const Code_Fg =req.body.Code_Fg;
//     const Name_Fg =req.body.Name_Fg;
//     const Code_Dr =req.body.Code_Dr;
//     const Name_Dr =req.body.Name_Dr;
//     const Code_Wip =req.body.Code_Wip;
//     const Name_Wip =req.body.Name_Wip;
//     const Ra_Wip =req.body.Ra_Wip;
//     const Ra_L =req.body.Ra_L;
//     const Remark =req.body.Remark;
//     try {
//         dbconnect.query("UPDATE bom SET Code_Fg = ?, Name_Fg = ?, Code_Dr = ?, Name_Dr = ?, Code_Wip = ?, Name_Wip = ?, Ra_Wip = ?, Ra_L = ?, Remark = ? WHERE id = ? ", 
//         [Code_Fg, Name_Fg, Code_Dr, Name_Dr, Code_Wip,Name_Wip,Ra_Wip, Ra_L , Remark, id], 
//         (err, result)=>{
//             if(err){
//                 console.log(err);
//                 res.status(500).json({
//                     success: false,
//                     msg: `There Problem Accur while update BOM ${id}`,
//                     data: err
//                 })
//             }else{
//                 res.status(200).json({
//                     success: true,
//                     msg: `Bom Id: ${id} Update Successful`
//                 })
//             }
//         })
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             msg: `There Problem Accur while update BOM ${id}`,
//             data: error
//         })
//     }

// };


//update postgressql
const updatebom = async (req, res) => {
    // Get values from request (Http)
    const id = req.params.id;
    const Code_Fg = req.body.Code_Fg;
    const Name_Fg = req.body.Name_Fg;
    const Code_Dr = req.body.Code_Dr;
    const Name_Dr = req.body.Name_Dr;
    const Code_Wip = req.body.Code_Wip;
    const Name_Wip = req.body.Name_Wip;
    const Ra_Wip = req.body.Ra_Wip;
    const Ra_L = req.body.Ra_L;
    const Remark = req.body.Remark;
    const Status = "Update";
    //Get Profile information
    const userEmail = req.user.email; // This email comes from requireAuth
    console.log('userEmail:', userEmail);
    const UpdateBy = userEmail;

    try {
        const query = `
            UPDATE "bom"
            SET "Code_Fg" = $1, "Name_Fg" = $2, "Code_Dr" = $3, "Name_Dr" = $4, "Code_Wip" = $5, "Name_Wip" = $6, "Ra_Wip" = $7, "Ra_L" = $8, "Remark" = $9, "Status" = $10
            WHERE "id" = $11
        `;

        const values = [Code_Fg, Name_Fg, Code_Dr, Name_Dr, Code_Wip, Name_Wip, Ra_Wip, Ra_L, Remark, Status, id];
        //Get current value before update
        const selectedQuery = `SELECT * FROM "bom" WHERE "id" = $1`;
        const selectedResult = await dbconnect.query(selectedQuery, [id]);
        //update query
        dbconnect.query(query, values, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    success: false,
                    msg: `There was a problem updating BOM ${id}`,
                    data: err
                });
            } else {
                if (selectedResult.rows.length > 0) {
                    const oldValues = selectedResult.rows[0];
                    
                    // Log changes
                    for (const column of ["Code_Fg", "Name_Fg", "Code_Dr", "Name_Dr", "Code_Wip", "Name_Wip", "Ra_Wip", "Ra_L", "Remark"]) {
                        const oldValue = oldValues[column];
                        const newValue = req.body[column];
                        console.log('oldValues', oldValue);
                        console.log('newValue', newValue)

                        if (oldValue !== newValue) {
                            logUpdate('bom', column, id , oldValue, newValue, UpdateBy);

                        }
                    }
                }
                res.status(200).json({
                    success: true,
                    msg: `BOM Id: ${id} update successful`,
                    data: result
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: `There was a problem updating BOM ${id}`,
            data: error
        });
    }
};

// //Delect Record bom
// const deletebom = async (req, res) =>{
//     const id = req.params.id
//     try {
//         dbconnect.query("DELETE FROM bom WHERE id = ? ", id, 
//         (err, result)=>{
//             if(err){
//                 res.status(400).json({
//                     success: false,
//                     data: err,
//                     msg: `There Problem Accur while Delete BOM ${id}`,
//                 })
//             }else{
//                 res.status(200).json({
//                     msg: ` BOM id:${id} delete successful`,
//                     data: result,
//                     success: true
//                 });
//                 // res.send("Delete Success");
//             }
//         })
//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             msg: `There Problem Accur while Delete BOM ${id}`,
//             data: error
//         })
//     }
   
// };

//Dellete postgresql
const deletebom = async (req, res) => {
    const id = req.params.id;
    const Status = "Delete";
    const userEmail = req.user.email; // This email comes from requireAuth
    console.log('userEmail:', userEmail);
    const UpdateBy = userEmail;

    try {
        //Query currrent value before update
        const selectedQuery = `SELECT * FROM "bom" WHERE "id" = $1`;
        const selectedResult = await dbconnect.query(selectedQuery, [id]);
        
        // Execute the query to update
        dbconnect.query('UPDATE "bom" SET "Status" = $1 WHERE "id" = $2', [Status, id], (err, result) => {
            if (err) {
                res.status(400).json({
                    success: false,
                    data: err,
                    msg: `There was a problem while deleting BOM ${id}`,
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
                            logUpdate('bom', column, id , oldValue, newValue, UpdateBy);

                        }
                    }
                }
                res.status(200).json({
                    msg: `BOM id:${id} deleted successfully`,
                    data: result.rows,
                    success: true
                });
                // res.send("Delete Success");
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: `There was a problem while deleting BOM ${id}`,
            data: error
        });
    }
};


module.exports ={
    getBoms,
    getSigleBom,
    postBom,
    updatebom,
    deletebom,
    postBomExcel
}