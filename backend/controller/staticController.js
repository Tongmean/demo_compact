const dbconnect = require('../DbConnect');

const staticFg = async (req, res) =>{
    const sqlCommand = `
        SELECT "Code_Fg", "Name_Fg" from fg
        ORDER BY "Code_Fg" 
    `
    try {
        dbconnect.query(sqlCommand, (err, result)=>{
            if(err){
                res.status(400).json({
                    success: false,
                    msg: "Query Fail",
                    data: err
                })
            }else{
                res.status(200).json({
                    success: true,
                    msg: "Query Success",
                    data: result.rows
                })
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Query Fail",
            data: error
        })
    }
}

const staticDr = async (req, res) =>{
    const sqlCommand = `
        SELECT "Code_Dr", "Name_Dr" from drill
        ORDER BY "Code_Dr" 
    `
    try {
        dbconnect.query(sqlCommand, (err, result)=>{
            if(err){
                res.status(400).json({
                    success: false,
                    msg: "Query Fail",
                    data:err
                })
            }else{
                res.status(200).json({
                    success: true,
                    msg: "Query Success",
                    data: result.rows
                })
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Query Fail",
            data:error
        })
    }
}

const staticWip = async (req, res) =>{
    const sqlCommand = `
        SELECT "Code_Wip", "Name_Wip" from wip
        GROUP BY "Code_Wip", "Name_Wip"
        ORDER BY "Code_Wip" ASC    
    `
    try {
        await dbconnect.query(sqlCommand, (err, result) => {
            if(err){
                res.status(400).json({
                    success: false,
                    msg: "Query Fail",
                    data: err,
                })
            }else{
                res.status(200).json({
                    success: true,
                    msg: "Query Success",
                    data: result.rows,
                })
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Query Fail",
            data: error,
        })
    }
}

const staicFgPartNo = async (req, res) => {
    const sqlCommand = `
        SELECT "Part_No" FROM drawing
        GROUP BY "Part_No"
    `;
    try {
        dbconnect.query(sqlCommand, (err, result) => {
            if (err) {
                res.status(400).json({
                    success: false,
                    msg: "Query Fail",
                    data: err
                });
            } else {
                res.status(200).json({
                    success: true,
                    msg: "Query success",
                    data: result.rows
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Server error",
            data: error
        });
    }
};


//use both wip & Dr
const getPcsperset = (req, res) =>{
    const sqlCommand = `
        SELECT * FROM pcsperset
        ORDER BY "Pcs_Per_Set" ASC 
    `
    try {
        dbconnect.query(sqlCommand, (err, result)=>{
            if(err){
                res.status(400).json({
                    success: false,
                    msg: "Query Fail",
                    data: err
                })
            }else{
                res.status(200).json({
                    success: true,
                    msg: "Query Success",
                    data: result.rows,
                })
            }
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: "Query Fail",
            data: err
        })
    }
}


module.exports = {
    staticFg,
    staticDr,
    staticWip,
    staicFgPartNo,
    getPcsperset,

}