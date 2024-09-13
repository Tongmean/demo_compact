const dbconnect = require('../DbConnect');

//Get all Wip
const getWip = async (req, res) =>{
    try {
        dbconnect.query("SELECT * FROM wip", (err, result)=>{
            if(err){
                res.status(400).json({
                    success: false,
                    msg: "There sth Error with Retrieve Wip Database.",
                    data: err
                })
            }else{
                res.status(200).json({
                    success: true,
                    msg: "Query wip successful",
                    data: result
                })
            }
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: "There sth Error with Retrieve Wip Database.",
            data: error
        })
    }
}
//get single wip
const getSingleWip = async (req, res) => {
    const id = req.params.id;
    try {
        dbconnect.query("SELECT * FROM wip where id = ?", id, (err, result)=>{
            if(err){
                res.status(400).json({
                    success: false,
                    msg: "There sth Error with Retrieve Wip Database.",
                    data: err
                })
            }else{
                res.status(200).json({
                    success: true,
                    msg: "Query wip successful",
                    data: result
                })
            }
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: "There sth Error with Retrieve Wip Database.",
            data: error
        })
    }
}

//post wip
const postWip = async (req, res) => {
    const { Code_Wip, Name_Wip, Code_Mold, Dimension, Chem_Grade, Weight_Per_Pcs, Pcs_Per_Mold, Pcs_Per_Set, Type_Brake, Type_Mold, Time_Per_Mold, Mold_Per_8_Hour, Remark } = req.body;

    // Define the query to check for duplicates
    const checkSqlCommand = `
        SELECT * FROM wip 
        WHERE Code_Wip = ? 
          AND Name_Wip = ? 
          AND Code_Mold = ? 
          AND Dimension = ? 
          AND Chem_Grade = ? 
          AND Weight_Per_Pcs = ? 
          AND Pcs_Per_Mold = ? 
          AND Pcs_Per_Set = ? 
          AND Type_Brake = ? 
          AND Type_Mold = ? 
          AND Time_Per_Mold = ? 
          AND Mold_Per_8_Hour = ? 
          AND Remark = ?
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

            if (result.length > 0) {
                // Record already exists
                return res.status(400).json({
                    success: false,
                    msg: "Record with these values already exists.",
                    data: result
                });
            }

            // Record doesn't exist, proceed with insertion
            const insertSqlCommand = `
                INSERT INTO wip 
                (Code_Wip, Name_Wip, Code_Mold, Dimension, Chem_Grade, Weight_Per_Pcs, Pcs_Per_Mold, Pcs_Per_Set, Type_Brake, Type_Mold, Time_Per_Mold, Mold_Per_8_Hour, Remark) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                    msg: "Wip record saved successfully.",
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


// const postWipExcel = async (req, res) =>{
//     //get value form request(Http)
//     let data = req.body;  // Array 
//     //Check if colum blank add "-"
//     data = data.map(row => row.map(value => value === "" || value === null ? "-" : value));
//     // console.log(data)
//     const sqlCommand = "INSERT INTO wip(Code_Wip,Name_Wip,Code_Mold,Dimension,Chem_Grade,Weight_Per_Pcs,Pcs_Per_Mold,Pcs_Per_Set,Type_Brake,Type_Mold,Time_Per_Mold,Mold_Per_8_Hour, Remark) VALUES ?";
//     try {
//         dbconnect.query(sqlCommand, [data], (err, result)=>{
//             if(err){
//                 res.status(400).json({
//                     success: false,
//                     msg: "There sth Error with post Wip Database.",
//                     data: err
//                 })
//             }else{
//                 res.status(200).json({
//                     success: true,
//                     msg: 'Code_Wip was insert successful',
//                     data: result
//                 })
//             }
//         })
//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             msg: "There sth Error with post Wip Database.",
//             data: error
//         })
//     }
// };


//Update Wip


const postWipExcel = (req, res) => {
    // Get value from request (Http)
    let data = req.body;  // Array of objects

    // Check if column is blank and add "-"
    data = data.map(row => row.map(value => value === "" || value === null ? "-" : value));

    let duplicateCount = 0;
    let insertedCount = 0;
    const nonDuplicateData = [];

    const checkDuplicate = (row, callback) => {
        const [Code_Wip, Name_Wip, Code_Mold, Dimension, Chem_Grade, Weight_Per_Pcs, Pcs_Per_Mold, Pcs_Per_Set, Type_Brake, Type_Mold, Time_Per_Mold, Mold_Per_8_Hour, Remark] = row;

        const checkDuplicateSql = `
            SELECT COUNT(*) as count 
            FROM wip 
            WHERE Code_Wip = ? 
              AND Name_Wip = ? 
              AND Code_Mold = ? 
              AND Dimension = ? 
              AND Chem_Grade = ? 
              AND Weight_Per_Pcs = ? 
              AND Pcs_Per_Mold = ? 
              AND Pcs_Per_Set = ? 
              AND Type_Brake = ? 
              AND Type_Mold = ? 
              AND Time_Per_Mold = ? 
              AND Mold_Per_8_Hour = ? 
              AND Remark = ?
        `;

        dbconnect.query(checkDuplicateSql, [
            Code_Wip, Name_Wip, Code_Mold, Dimension, Chem_Grade, Weight_Per_Pcs,
            Pcs_Per_Mold, Pcs_Per_Set, Type_Brake, Type_Mold, Time_Per_Mold, Mold_Per_8_Hour, Remark
        ], (err, results) => {
            if (err) {
                return callback(err);
            }
            if (results[0].count === 0) {
                nonDuplicateData.push(row);  // Only push if no duplicate found
            } else {
                duplicateCount++;  // Increment duplicate count
            }
            callback();  // Continue with the next row
        });
    };

    const insertNonDuplicateRecords = () => {
        const sqlCommand = "INSERT INTO wip(Code_Wip, Name_Wip, Code_Mold, Dimension, Chem_Grade, Weight_Per_Pcs, Pcs_Per_Mold, Pcs_Per_Set, Type_Brake, Type_Mold, Time_Per_Mold, Mold_Per_8_Hour, Remark) VALUES ?";

        dbconnect.query(sqlCommand, [nonDuplicateData], (err, result) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: "There was an error posting WIP data to the database.",
                    data: err
                });
            } else {
                insertedCount = nonDuplicateData.length;  // Update inserted count
                return res.status(200).json({
                    success: true,
                    msg: 'Records were inserted successfully.',
                    insertedCount: insertedCount,
                    duplicateCount: duplicateCount,
                    message: `${insertedCount} records were inserted successfully. ${duplicateCount} records were duplicates.`,
                    data: result
                });
            }
        });
    };

    // Check duplicates and then insert non-duplicate records
    let remainingChecks = data.length;

    data.forEach(row => {
        checkDuplicate(row, (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: "Error while checking duplicates.",
                    data: err
                });
            }
            remainingChecks--;
            if (remainingChecks === 0) {
                if (nonDuplicateData.length === 0) {
                    return res.status(200).json({
                        success: true,
                        msg: 'No new records to insert, all records are duplicates.',
                        insertedCount: insertedCount,
                        duplicateCount: duplicateCount,
                        message: `0 records were inserted successfully. ${duplicateCount} records were duplicates.`
                    });
                } else {
                    insertNonDuplicateRecords();
                }
            }
        });
    });
};




const updateWip = async (req, res) =>{
    const id = req.params.id;
    const {Code_Wip,Name_Wip,Code_Mold,Dimension,Chem_Grade,Weight_Per_Pcs,Pcs_Per_Mold,Pcs_Per_Set,Type_Brake,Type_Mold,Time_Per_Mold,Mold_Per_8_Hour, Remark} = req.body;
    const sqlCommand = "UPDATE wip SET Code_Wip =? ,Name_Wip=? ,Code_Mold=? ,Dimension=? ,Chem_Grade=? ,Weight_Per_Pcs=? ,Pcs_Per_Mold=? ,Pcs_Per_Set=?,Type_Brake=? ,Type_Mold=? ,Time_Per_Mold=? ,Mold_Per_8_Hour=? , Remark=?  WHERE id = ?";
    const value = [Code_Wip,Name_Wip,Code_Mold,Dimension,Chem_Grade,Weight_Per_Pcs,Pcs_Per_Mold,Pcs_Per_Set,Type_Brake,Type_Mold,Time_Per_Mold,Mold_Per_8_Hour, Remark, id];
    try {
        dbconnect.query(sqlCommand, value, (err, result)=>{
            if(err){
                console.log("err", err);
                res.status(500).json({
                    msg: "There was error while Query Database",
                    success: false,
                    data: err
                })
            }else{
                res.status(200).json({
                    msg: `Wip Id: ${id} & Code_Wip: ${Code_Wip} was update successful`,
                    success: true,
                    data: result
                })
            }
        })
    } catch (error) {
        res.status(500).json({
            msg: "There was error with connection",
            success: false,
            data: error
        })
    }
}


//Dellete Wip
const deleteWip = async (req, res) =>{
    const id = req.params.id;
    try {
        dbconnect.query("DELETE FROM wip WHERE id = ?", id ,(err, result)=>{
            if(err){
                res.status(400).json({
                    msg: "There are some Problem",
                    data: err,
                    success: false
                })
            }else{
                res.status(200).json({
                    success: true,
                    msg: `Delete record ${id} successfull`,
                    data: result
                })
            }
        })
    } catch (error) {
        res.status(400).json({
            msg: "There are some Problem with connection",
            data: error,
            success: false
        })
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