const dbconnect = require('../DbConnect');

const joinTable = async (req, res) =>{
    const sqlCommand = "SELECT * FROM homeview";
    try {
        dbconnect.query(sqlCommand, (err, result)=>{
            if(err){
                res.status(500).json({
                    success: "false",
                    msg: "",
                    data: err
                })
            }else{
                res.status(200).json({
                    success: "true",
                    msg: "",
                    data: result
                })
            }
        })
    } catch (error) {
        res.status(500).json({
            success: "false",
            msg: "",
            data: error
        })
    }
}

module.exports = {
    joinTable,
}