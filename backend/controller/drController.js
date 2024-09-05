const dbconnect = require('../DbConnect');

const getDr = async (req, res)=>{
    try {
        dbconnect.query("SELECT * From drill", (err, result)=>{
            if(err){
                res.status(400).json({
                    success: false,
                    msg: "Failed to retrieve data from the database.",
                    data: err
                })
            }else{
                res.status(200).json({
                    success: true,
                    msg: "Successful retrieve data from the database.",
                    data: result
                })
            }
        })
    } catch (error) {
        
    }
}
//Get single Dr
const getSingleDr = async(req, res) =>{
    const id = req.params.id
    try {
        dbconnect.query("SELECT * FROM drill WHERE id = ?", id, (err, result)=>{
            if(err){
                res.status(400).json({
                    msg: `Unsuccessful retrieve data from the database by ${id}`,
                    success: false,
                    data: err
                })
            }else{
                res.status(400).json({
                    msg: `Successful retrieve data from the database by ${id}`,
                    success: true,
                    data: result
                })
            }
        })
    } catch (error) {
        res.status(400).json({
            msg: `Unsuccessful retrieve data from the database by ${id}`,
            success: false,
            data: error
        })
    }
}

//Post Dr

const postDr = async (req, res) =>{
    const {Code_Dr, Name_Dr, Name_Wip, Name_Fg_1, Demension, Type_Brake, Chem_Grade, Status_Dr,No_Grind, Num_Hole, No_Jig_Drill, No_Drill,No_Reamer, Code, Remark, Color, Color_Spray, Grind_Back, Grind_Front, Grind_Detail, Drill, Baat, Ji_Hou, Fon_Hou, Tha_Khob, Cut,Form } = req.body;

    try {
        const checkSqlCommand = "SELECT * FROM drill WHERE Code_Dr = ?";
        dbconnect.query(checkSqlCommand, [Code_Dr], (err, result)=>{
            if(err){
                console.log("Check Fail", err);
                return res.status(400).json({
                    msg:"Check duplicate Code Dr faill",
                    data: err,
                    success: false
                })
            }
            if(result.length > 0){
                console.log("Code_Dr already Exit:", result)
                return res.status(400).json({
                    success: false,
                    msg: `Code_Dr ${result[0].Code_Dr} already exist.`
                })
            }else{
                const sqlCommand = "INSERT INTO drill (Code_Dr, Name_Dr, Name_Wip, Name_Fg_1, Demension, Type_Brake, Chem_Grade, Status_Dr,No_Grind, Num_Hole, No_Jig_Drill, No_Drill,No_Reamer, Code, Remark, Color, Color_Spray, Grind_Back, Grind_Front, Grind_Detail, Drill, Baat, Ji_Hou, Fon_Hou, Tha_Khob, Cut,Form) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ? )";
                dbconnect.query(sqlCommand, [Code_Dr, Name_Dr, Name_Wip, Name_Fg_1, Demension, Type_Brake, Chem_Grade, Status_Dr,No_Grind, Num_Hole, No_Jig_Drill, No_Drill,No_Reamer, Code, Remark, Color, Color_Spray, Grind_Back, Grind_Front, Grind_Detail, Drill, Baat, Ji_Hou, Fon_Hou, Tha_Khob, Cut,Form], (err, result)=>{
                    if(err){
                        res.status(400).json({
                            success: false,
                            msg: "Insert Code_dr Unsuccessful",
                            data: err
                        })
                    }else{
                        res.status(200).json({
                            success: true,
                            msg:`Insert Successful Code_dr:${Code_Dr} Successful`,
                            data: result
                        })
                    }
                })
            }
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: "Insert Code_dr Unsuccessful",
            data: err
        })
    }
}



const deleteDr = async (req, res) =>{
    const id = req.params.id
    try {
        dbconnect.query("DELETE FROM drill WHERE id = ?", id, (err, result)=>{
            if(err){
                res.status(400).json({
                    success: false,
                    msg: "There Error Accur",
                    data: err
                })
            }else{
                res.status(200).json({
                    success: true,
                    msg: `Code_Dr:id: ${id} Delete Successful.`,
                    data: result
                })
            }
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: "There Error Accur",
            data: err
        })
    }
}

module.exports ={
    getDr,
    getSingleDr,
    postDr,
    deleteDr
}