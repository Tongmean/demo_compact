const dbconnect = require('../DbConnect');
//join home view


//join table dashview
const joinTableDash = async (req, res) => {
    const sqlCommand = `
            SELECT DISTINCT 
            "fg"."Code_Fg", 
            "fg"."Name_Fg", 
            "bom"."Name_Fg" AS "Name_Fg_Bom", 
            
            "fg"."Pcs_Per_Set" AS "Pcs_Per_Set_Fg", 
            "drill"."Code_Dr", 
            "drill"."Name_Dr", 
            "bom"."Name_Dr" AS "Name_Dr_Bom", 
            
            ("bom"."Ra_Wip" * "fg"."Pcs_Per_Set") AS "Ra_Wip_Modify", 
            "wip"."Code_Wip", 
            "wip"."Name_Wip", 
            "bom"."Name_Wip" AS "Name_Wip_Bom", 

            
            (("bom"."Ra_Wip" * "fg"."Pcs_Per_Set") / "bom"."Ra_L") AS "Ra_L_Modify", 
            
            "bom"."Remark" AS "Remark_Bom", 
            "fg"."Remark" AS "Remark_Fg", 
            "drill"."Remark" AS "Remark_Dr", 
            "wip"."Remark" AS "Remark_Wip", 
            "drill"."Code" AS "Code_Drill", 
            
            "fg"."Code" AS "Code_fg", 
            "drill"."Type_Brake" AS "Type_Brake_Dr",
            "wip"."Pcs_Per_Set" AS "Pcs_Per_Set_Wip",


            "bom".*, 
            "wip".*, 
            "fg".*, 
            "drill".* 
            FROM "bom" 
            JOIN "wip" ON "bom"."Code_Wip" = "wip"."Code_Wip" 
            JOIN "drill" ON "bom"."Code_Dr" = "drill"."Code_Dr" 
            JOIN "fg" ON "bom"."Code_Fg" = "fg"."Code_Fg" 
            WHERE "bom"."Status" != 'Delete'
                AND "wip"."Status" != 'Delete'
                AND "drill"."Status" != 'Delete'
                AND "fg"."Status" != 'Delete'
            ORDER BY "fg"."Code_Fg"
    `;
    
    try {
        dbconnect.query(sqlCommand, (err, result) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    data: err,
                    msg: "Error While querying data"
                });
            } else {
                res.status(200).json({
                    success: true,
                    msg: "Query data successful",
                    data: result.rows // In PostgreSQL, use result.rows for the result set
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: error,
            msg: "Error While querying data"
        });
    }
};


module.exports = {
    joinTableDash,
}