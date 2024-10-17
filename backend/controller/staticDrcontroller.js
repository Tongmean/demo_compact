const dbconnect = require('../DbConnect');

const getTypebrakedr = async (req, res) =>{
    const sqlCommand = `
        SELECT * FROM typebrakedr
        ORDER BY "typebrakedr" ASC 
    `
    try {
        dbconnect.query(sqlCommand, (err, result)=>{
            if(err){
                res.status(400).json({
                    success: false,
                    msg: 'Query Fail',
                    data: err
                })
            }else{
                res.status(200).json({
                    success: true,
                    msg: 'Query Success',
                    data: result.rows
                })
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Query Fail',
            data: error
        })
    }
}

const getProcessorder = async (req, res) =>{
    const sqlCommand = `
        SELECT * FROM processorder
        ORDER BY "processorder" ASC
    `
    try {
        dbconnect.query(sqlCommand, (err, result)=>{
            if(err){
                res.status(400).json({
                    success: false,
                    msg: 'Query Fail',
                    data: err
                })
            }else{
                res.status(200).json({
                    success: true,
                    msg: 'Query Success',
                    data: result.rows
                })
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Query Fail',
            data: error
        })
    }
}


const getColor = async (req, res) =>{
    const sqlCommand = `
        SELECT * FROM color
        ORDER BY "color" ASC
    `
    try {
        dbconnect.query(sqlCommand, (err, result)=>{
            if(err){
                res.status(400).json({
                    success: false,
                    msg: 'Query Fail',
                    data: err
                })
            }else{
                res.status(200).json({
                    success: true,
                    msg: 'Query Success',
                    data: result.rows
                })
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Query Fail',
            data: error
        })
    }
}

const getFormreport = async (req, res) =>{
    const sqlCommand = `
        SELECT * FROM formreport
    `
    try {
        dbconnect.query(sqlCommand, (err, result)=>{
            if(err){
                res.status(400).json({
                    success: false,
                    msg: 'Query Fail',
                    data: err
                })
            }else{
                res.status(200).json({
                    success: true,
                    msg: 'Query Success',
                    data: result.rows
                })
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Query Fail',
            data: error
        })
    }
}



module.exports ={
    getTypebrakedr,
    getProcessorder,
    getColor,
    getFormreport,


}