const dbconnect = require('../DbConnect');

//Type Brake
const getTypebrakewip = async (req, res) =>{
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
const postTypebrakewip = async (req, res) =>{
    const {Type_Brake} = req.body;
    const sqlCommand = `
        INSERT INTO "typebrakewip" ('Type_Brake') VALUES ($1) RETURNING *
    `;
    try {
        dbconnect.query(sqlCommand, [Type_Brake], (err, result)=>{
            if(err){
                res.status(400).json({
                    success: false,
                    msg: "Query Fail",
                    data: err
                })
            }else{
                res.status(200).json({
                    success: true,
                    msg: "Insert Success",
                    data: result
                })
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Query Fail",
            data: err
        })
    }
}
const deleteTypebrakewip = async (req, res) =>{
    const id = req.params.id;
    const sqlCommand = `
        DELETE FROM typebrakewip WHERE id = $1;

    `
    try {
        dbconnect.query(sqlCommand, [id], (err, result)=>{
            
        })
    } catch (error) {
        
    }
}

//Type Mold
const getTypemold = async (req, res) =>{
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