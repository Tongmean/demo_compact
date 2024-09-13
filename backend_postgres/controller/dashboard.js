const dbconnect = require('../DbConnect');
//join home view
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


//join table dashview
const joinTableDash = async (req, res) =>{
    const sqlCommand = "SELECT DISTINCT fg.Code_Fg, fg.Name_Fg, fg.Pcs_Per_Set AS Pcs_Per_Set_Fg, drill.Code_Dr, drill.Name_Dr, (bom.Ra_Wip * fg.Pcs_Per_Set) AS Ra_Wip_Modify, wip.Code_Wip, wip.Name_Wip, ((bom.Ra_Wip * fg.Pcs_Per_Set) / bom.Ra_L) AS Ra_L_Modify, bom.Remark, drill.Code AS Code_Drill,fg.Code AS Code_fg, bom.*, wip.*, fg.*, drill.* FROM bom JOIN wip ON bom.Code_Wip = wip.Code_Wip JOIN drill ON bom.Code_Dr = drill.Code_Dr JOIN fg ON bom.Code_Fg = fg.Code_Fg ORDER BY fg.Code_Fg";    
    try {
        dbconnect.query(sqlCommand, (err, result) =>{
            if(err){
                res.status(500).json({
                    success: false,
                    data: err,
                    msg: "Error While query data"
                })
            }else{
                res.status(200).json({
                    success: true,
                    msg: "Query data successful",
                    data: result
                })
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            data: error,
            msg: "Error While query data"
        })
    }
};

module.exports = {
    joinTable,
    joinTableDash,
}