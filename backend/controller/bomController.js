//Connect DB
const dbconnect = require('../DbConnect');
//Get All boms
const getBoms = async (req,res) =>{
    try {
        dbconnect.query("SELECT * FROM bom",(err, result) =>{
            if(err){
                console.log(err);
                res.status(400).json({
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
        res.status(400).json({
            success: false,
            msg: "There Problems With retrieve Bom",
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
                res.status(400).json({
                    success: true,
                    msg: `There Problems With retrieve Bom id: ${id}`
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
        res.status(400).json({
            success: true,
            msg: `There Problems With retrieve Bom id: ${id}`,
            data: error
        })
    }

}
// Post json to database
const postBom = async (req, res) =>{
    //get value form request(Http)
    const Code_Fg =req.body.Code_Fg;
    const Name_Fg =req.body.Name_Fg;
    const Code_Dr =req.body.Code_Dr;
    const Name_Dr =req.body.Name_Dr;
    const Code_Wip =req.body.Code_Wip;
    const Name_Wip =req.body.Name_Wip;
    const Ra_Wip =req.body.Ra_Wip;
    const Ra_L =req.body.Ra_L;
    const Remark =req.body.Remark;
    //Insert Data From Rq.body to Database
    try {
        dbconnect.query("INSERT INTO bom(Code_Fg, Name_Fg, Code_Dr, Name_Dr,Code_Wip, Name_Wip, Ra_Wip, Ra_L , Remark) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [Code_Fg, Name_Fg, Code_Dr, Name_Dr,Code_Wip, Name_Wip, Ra_Wip, Ra_L , Remark],
        (err,result)=>{
            if(err){
                res.status(400).json({
                    success: false,
                    msg: "There is problem Accur",
                    data: err
                })
            }else
            res.status(200).json({
                msg: `Bom record: ${Code_Fg} Insert successful`,
                success: true,
                data: result
            });
        }
    )
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: "There is problem Accur",
            data: error
        })
    }

};
//post bom excel
const postBomExcel = async (req, res) => {
    let data = req.body;  // Array of rows from the client
    
    // Check if column is blank, add "-"
    data = data.map(row => row.map(value => value === "" || value === null ? "-" : value));

    try {
        // Extract the Code_Dr values from the data
        const codeDrArray = data.map(row => row[2]); // Assuming 'Code_Dr' is the 3rd column

        // Check for existing Code_Dr values in the database
        const checkSql = "SELECT Code_Dr FROM bom WHERE Code_Dr IN (?)";
        dbconnect.query(checkSql, [codeDrArray], (err, existingRows) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: "Error checking existing Code_Dr",
                    data: err
                });
            }

            // Map existing Code_Dr values to an array
            const existingCodeDrs = existingRows.map(row => row.Code_Dr);

            // Filter out rows where Code_Dr already exists and convert each row into an object
            const filteredData = data.filter(row => !existingCodeDrs.includes(row[2])).map(row => ({
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

            if (filteredData.length === 0) {
                return res.status(200).json({
                    success: true,
                    msg: "No new data to insert, all Code_Dr already exist.",
                    data: filteredData
                });
            }

            // Insert the filtered data
            const sqlCommand = "INSERT INTO bom(Code_Fg, Name_Fg, Code_Dr, Name_Dr, Code_Wip, Name_Wip, Ra_Wip, Ra_L, Remark) VALUES ?";
            // Convert filteredData back to array format for bulk insertion
            const insertData = filteredData.map(row => [
                row.Code_Fg,
                row.Name_Fg,
                row.Code_Dr,
                row.Name_Dr,
                row.Code_Wip,
                row.Name_Wip,
                row.Ra_Wip,
                row.Ra_L,
                row.Remark
            ]);

            dbconnect.query(sqlCommand, [insertData], (err, result) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        msg: "There was a problem during insertion",
                        data: err
                    });
                }

                res.status(200).json({
                    success: true,
                    msg: "BOM: Insert successful",
                    data: result
                });
            });
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: "There was a problem",
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
                res.status(400).json({
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
        res.status(400).json({
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