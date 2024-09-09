//Connect DB
const dbconnect = require('../DbConnect');
//Get All boms
const getBoms = async (req,res) =>{
    try {
        dbconnect.query("SELECT * FROM bom",(err, result) =>{
            if(err){
                console.log(err);
                res.status(500).json({
                    success: false,
                    msg: "There Problems With retrieve Bom",
                    data: err
                })
            }else{
                res.status(200).json({
                    success: true,
                    msg: "Retrieve Bom Successful",
                    data: result
                });
            }
        });
    } catch (error) {
        console.log(err);
        res.status(500).json({
            success: false,
            msg: "There Problems With retrieve Bom Process",
            data: error
        })
    }
   
}
const getSigleBom = async (req,res) =>{
    const id = req.params.id
    try {
        dbconnect.query("SELECT * FROM bom where id = ?" , id,(err, result) =>{
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
                    msg: `Bom id: ${id} Retrirvr successful`,
                    data: result
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

    try {
        // First, check if the Code_Dr already exists in the database
        const checkSqlCommand = "SELECT * FROM bom WHERE Code_Dr = ?";

        dbconnect.query(checkSqlCommand, [Code_Dr], (err, result) => {
            if (err) {
                console.error("Error checking Code_Dr:", err);
                return res.status(500).json({
                    success: false,
                    msg: "Database error occurred while checking for Code_Dr",
                    data: err
                });
            }

            if (result.length > 0) {
                // Code_Dr already exists, return an error response
                return res.status(400).json({
                    success: false,
                    msg: "Code_Dr already exists, cannot save duplicate value",
                    data: result
                });
            } else {
                // Proceed with inserting new record since Code_Dr does not exist
                const sqlCommand = "INSERT INTO bom (Code_Fg, Name_Fg, Code_Dr, Name_Dr, Code_Wip, Name_Wip, Ra_Wip, Ra_L, Remark) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

                dbconnect.query(sqlCommand, [Code_Fg, Name_Fg, Code_Dr, Name_Dr, Code_Wip, Name_Wip, Ra_Wip, Ra_L, Remark], (err, result) => {
                    if (err) {
                        console.log("Error occurred:", err);
                        return res.status(500).json({
                            success: false,
                            msg: "Database error occurred while saving Bom"
                        });
                    }

                    res.status(200).json({
                        success: true,
                        data: result,
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



//post bom excel
const postBomExcel = async (req, res) => {
    let data = req.body;  // Array of rows from the client

    // Ensure no fields are empty; replace empty or null values with "-"
    data = data.map(row => row.map(value => value === "" || value === null ? "-" : value));

    try {
        // Extract Code_Dr values from the data (assuming it's the third column)
        const codeDrArray = data.map(row => row[2]);

        // Query the database to check if these Code_Dr values already exist
        const checkSql = "SELECT Code_Dr FROM bom WHERE Code_Dr IN (?)";
        dbconnect.query(checkSql, [codeDrArray], (err, existingRows) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: "Error checking existing Code_Dr",
                    data: err
                });
            }

            // Extract existing Code_Dr values from the query result
            const existingCodeDrs = existingRows.map(row => row.Code_Dr);

            // Separate the data into new records (not in existingCodeDrs) and existing records
            const newData = data.filter(row => !existingCodeDrs.includes(row[2]));
            const existingData = data.filter(row => existingCodeDrs.includes(row[2]));

            if (newData.length > 0) {
                // Convert newData into an array of objects with named keys for SQL insertion
                const newDataObjects = newData.map(row => ({
                    Code_Fg: row[0],
                    Name_Fg: row[1],
                    Code_Dr: row[2],
                    Name_Dr: row[3],
                    Code_Wip: row[4],
                    Name_Wip: row[5],
                    Ra_Wip: row[6],
                    Ra_L: row[7],
                    Remark: row[8]
                }));

                // Prepare the values for insertion by mapping each object to an array of values
                const values = newDataObjects.map(obj => [
                    obj.Code_Fg,
                    obj.Name_Fg,
                    obj.Code_Dr,
                    obj.Name_Dr,
                    obj.Code_Wip,
                    obj.Name_Wip,
                    obj.Ra_Wip,
                    obj.Ra_L,
                    obj.Remark
                ]);

                // Insert new records into the database
                const sqlCommand = "INSERT INTO bom (Code_Fg, Name_Fg, Code_Dr, Name_Dr, Code_Wip, Name_Wip, Ra_Wip, Ra_L, Remark) VALUES ?";
                dbconnect.query(sqlCommand, [values], (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            msg: "Error inserting new records",
                            data: err
                        });
                    }

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
            msg: "There was a problem processing the request",
            data: error
        });
        console.log(error);
    }
};


//update bom by Puut Method
const updatebom = async (req, res) =>{
    //get value form request(Http)
    const id = req.params.id;
    const Code_Fg =req.body.Code_Fg;
    const Name_Fg =req.body.Name_Fg;
    const Code_Dr =req.body.Code_Dr;
    const Name_Dr =req.body.Name_Dr;
    const Code_Wip =req.body.Code_Wip;
    const Name_Wip =req.body.Name_Wip;
    const Ra_Wip =req.body.Ra_Wip;
    const Ra_L =req.body.Ra_L;
    const Remark =req.body.Remark;
    try {
        dbconnect.query("UPDATE bom SET Code_Fg = ?, Name_Fg = ?, Code_Dr = ?, Name_Dr = ?, Code_Wip = ?, Name_Wip = ?, Ra_Wip = ?, Ra_L = ?, Remark = ? WHERE id = ? ", 
        [Code_Fg, Name_Fg, Code_Dr, Name_Dr, Code_Wip,Name_Wip,Ra_Wip, Ra_L , Remark, id], 
        (err, result)=>{
            if(err){
                console.log(err);
                res.status(500).json({
                    success: false,
                    msg: `There Problem Accur while update BOM ${id}`,
                    data: err
                })
            }else{
                res.status(200).json({
                    success: true,
                    msg: `Bom Id: ${id} Update Successful`
                })
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: `There Problem Accur while update BOM ${id}`,
            data: error
        })
    }

};
//Delect Record bom
const deletebom = async (req, res) =>{
    const id = req.params.id
    try {
        dbconnect.query("DELETE FROM bom WHERE id = ? ", id, 
        (err, result)=>{
            if(err){
                res.status(400).json({
                    success: false,
                    data: err,
                    msg: `There Problem Accur while Delete BOM ${id}`,
                })
            }else{
                res.status(200).json({
                    msg: ` BOM id:${id} delete successful`,
                    data: result,
                    success: true
                });
                // res.send("Delete Success");
            }
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: `There Problem Accur while Delete BOM ${id}`,
            data: error
        })
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