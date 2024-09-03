// Connect DB
const dbconnect = require('../DbConnect');

// Get all fg
const getFgs = async (req, res) => {
    try {
        dbconnect.query("SELECT * FROM Fg", (err, result) => {
            if (err) {
                console.error("Database query error:", err);
                res.status(500).json({
                    success: false,
                    msg: "Failed to retrieve data from the database.",
                    error: err.message
                });
            } else {
                res.status(200).json({
                    success: true,
                    data: result
                });
            }
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({
            success: false,
            msg: "An unexpected error occurred.",
        });
    }
};
//Get single Fg
const getSigleFg = async (req, res) =>{
    const id = req.params.id;
    try {
        dbconnect.query("SELECT * FROM FG WHERE id = ?", id,(err, result)=>{
            if(err){
                console.log("An Error Accur",err)
                res.status(500).json({
                    success: false,
                    msg:"An unexpected error occurred.",
                })
            }else{
                res.status(200).json({
                    success: true,
                    data: result
                })
            }
        })
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({
            success: false,
            msg: "An unexpected error occurred.",
        });
    }
}
//Create Fg
const postFg = async (req, res) =>{
    const {Code_Fg, Name_Fg, Model, Part_No, OE_Part_No, Code,Chem_Grade, Pcs_Per_Set, Box_No, Weight_Box, 
        Box_Erp_No, Rivet_No, Weight_Revit_Per_Set, Num_Revit_Per_Set, Revit_Erp_No, Remark} = req.body;
    try{    
        const sqlCommand = "INSERT INTO Fg (Code_Fg, Name_Fg, Model, Part_No, OE_Part_No, Code,Chem_Grade, Pcs_Per_Set, Box_No, Weight_Box, Box_Erp_No, Rivet_No, Weight_Revit_Per_Set, Num_Revit_Per_Set, Revit_Erp_No, Remark) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        dbconnect.query(sqlCommand, [Code_Fg, Name_Fg, Model, Part_No, OE_Part_No, Code,Chem_Grade, Pcs_Per_Set, Box_No, Weight_Box, Box_Erp_No, Rivet_No, Weight_Revit_Per_Set, Num_Revit_Per_Set, Revit_Erp_No, Remark],(err, result)=>{
            if(err){
                console.log("Error Accur", err);
                res.status(500).json({
                    success: false,
                    msg: "Database error occurred"
                });
            }else{
                res.status(200).json({
                    success: true,
                    data: result,
                    msg: "Fg create Successful"
                })
            }
        });
    } catch (error) {
        console.error('Error in postFg:', error);
        res.status(500).json({ 
            msg: 'An unexpected error occurred',
            success: false
        });
    }
}


//Delete Fg
const deleteFg = async (req, res) =>{
    const id = req.params.id;
    try {
        dbconnect.query("DELETE FROM Fg WHERE id = ?", id, (err, result)=>{
            if(err){
                console.log("Delete Error Accur", err);
                res.status(500).json({
                    msg: 'An unexpected error occurred',
                    success: false
                })
            }else{
                res.status(200).json({
                    success: true,
                    msg: `Record ${id} was deleted`,
                })
            }
        })
    } catch (error) {
        console.error('Error in postFg:', error);
        res.status(500).json({ 
            msg: 'An unexpected error occurred',
            success: false
        });
    }
}
module.exports = {
    getFgs,
    getSigleFg,
    postFg,
    deleteFg
};
