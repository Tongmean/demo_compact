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
const postWip = async (req, res) =>{
    const { Code_Wip,Name_Wip,Code_Mold,Dimension,Chem_Grade,Weight_Per_Pcs,Pcs_Per_Mold,Pcs_Per_Set,Type_Brake,Type_Mold,Time_Per_Mold,Mold_Per_8_Hour, Remark } = req.body;
    const sqlCommand = "INSERT INTO wip (Code_Wip,Name_Wip,Code_Mold,Dimension,Chem_Grade,Weight_Per_Pcs,Pcs_Per_Mold,Pcs_Per_Set,Type_Brake,Type_Mold,Time_Per_Mold,Mold_Per_8_Hour, Remark) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    try {
        dbconnect.query(sqlCommand, [Code_Wip,Name_Wip,Code_Mold,Dimension,Chem_Grade,Weight_Per_Pcs,Pcs_Per_Mold,Pcs_Per_Set,Type_Brake,Type_Mold,Time_Per_Mold,Mold_Per_8_Hour, Remark], (err, result)=>{
            if(err){
                res.status(400).json({
                    success: false,
                    msg: "There sth Error with post Wip Database.",
                    data: err
                })
            }else{
                res.status(200).json({
                    success: true,
                    msg: "Save Wip successful",
                    data: result
                })
            }
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: "There sth Error with post Wip Database.",
            data: error
        })
    }
}

const postWipExcel = async (req, res) =>{
    //get value form request(Http)
    let data =req.body;  // Array 
    //Check if colum blank add "-"
    data = data.map(row => row.map(value => value === "" || value === null ? "-" : value));
    const sqlCommand = "INSERT INTO bom(Code_Wip,Name_Wip,Code_Mold,Dimension,Chem_Grade,Weight_Per_Pcs,Pcs_Per_Mold,Pcs_Per_Set,Type_Brake,Type_Mold,Time_Per_Mold,Mold_Per_8_Hour, Remark) VALUES ?";
    try {
        dbconnect.query(sqlCommand, data, (err, result)=>{
            if(err){
                res.status(400).json({
                    success: false,
                    msg: "There sth Error with post Wip Database.",
                    data: err
                })
            }else{
                res.status(200).json({
                    success: true,
                    msg: "Save Wip successful",
                    data: result
                })
            }
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: "There sth Error with post Wip Database.",
            data: error
        })
    }
};


//Dellete Wip
const deleteWip = async (req, res) =>{
    const id = req.params.id;
    try {
        dbconnect.query("DELETE FROM wip WHRER id = ?", id,(err, result)=>{
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
            msg: "There are some Problem",
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

}