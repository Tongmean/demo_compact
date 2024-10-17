const dbconnect = require('../DbConnect');

//Type Brake
const getTypebrakewip = (req, res) =>{
    const sqlCommand = `
        SELECT * FROM typebrakewip
        ORDER BY "Type_Brake" ASC 
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

//Type Mold
const getTypemold = (req, res) =>{
    const sqlCommand = `
        SELECT * FROM typemold
        ORDER BY "Type_Mold" ASC 
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


module.exports ={
    getTypebrakewip,
    getTypemold

}