//Connect DB
const dbconnect = require('../DbConnect');
//Get All boms
const getBoms = async (req,res) =>{
    dbconnect.query("SELECT * FROM bom",(err, result) =>{
        if(err){
            console.log(err);
        }else{
            res.status(200).json(result);
        }
    });
}
const getSigleBom = async (req,res) =>{
    const id = req.params.id
    dbconnect.query("SELECT * FROM bom where id = ?" , id,(err, result) =>{
        if(err){
            console.log(err);
        }else{
            res.status(200).json(result);
        }
    });
}
// Post json to database
const postBom = async (req, res) =>{
    //get value form request(Http)
    const Code_Fg =req.body.Code_Fg;
    const Name_Fg =req.body.Name_Fg;
    const Code_Dr =req.body.Code_Dr;
    const Name_Dr =req.body.Name_Dr;
    const Code_Wip =req.body.Code_Wip;
    const Name_Wip =req.body.Name_Wip;
    const Ra_Wip =req.body.Ra_Wip;
    const Ra_L =req.body.Ra_L;
    const Remark =req.body.Remark;
    //Insert Data From Rq.body to Database
    dbconnect.query("INSERT INTO bom(Code_Fg, Name_Fg, Code_Dr, Name_Dr,Code_Wip, Name_Wip, Ra_Wip, Ra_L , Remark) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [Code_Fg, Name_Fg, Code_Dr, Name_Dr,Code_Wip, Name_Wip, Ra_Wip, Ra_L , Remark],
        (Error,result)=>{
            if(Error){
                res.status(400).json({Error: Error.message})
            }else
            res.status(200).json({msg: "Bom created"});
        }
    )
};
// Input by using excel
const postBomExcel = async (req, res) =>{
    //get value form request(Http)
    let data =req.body;  // Array 
    //Check if colum blank add "-"
    data = data.map(row => row.map(value => value === "" || value === null ? "-" : value));
    const sqlCommand = "INSERT INTO bom(Code_Fg, Name_Fg, Code_Dr, Name_Dr,Code_Wip, Name_Wip, Ra_Wip, Ra_L, Remark) VALUES ?";
    dbconnect.query(sqlCommand,
        [data],
        (Error,result)=>{
            if(Error){
                res.status(400).json({Error: Error.message})
                console.log(Error)
            }else
            res.send("bom created");
        }
    )
};
//update bom by Puut Method
const updatebom = async (req, res) =>{
    //get value form request(Http)
    const id = req.params.id;
    const Code_Fg =req.body.Code_Fg;
    const Name_Fg =req.body.Name_Fg;
    const Code_Dr =req.body.Code_Dr;
    const Name_Dr =req.body.Name_Dr;
    const Code_Wip =req.body.Code_Wip;
    const Name_Wip =req.body.Name_Wip;
    const Ra_Wip =req.body.Ra_Wip;
    const Ra_L =req.body.Ra_L;
    const Remark =req.body.Remark;

    dbconnect.query("UPDATE bom SET Code_Fg = ?, Name_Fg = ?, Code_Dr = ?, Name_Dr = ?, Code_Wip = ?, Name_Wip = ?, Ra_Wip = ?, Ra_L = ?, Remark = ? WHERE id = ? ", 
    [Code_Fg, Name_Fg, Code_Dr, Name_Dr, Code_Wip,Name_Wip,Ra_Wip, Ra_L , Remark, id], 
    (err, result)=>{
        if(err){
            console.log(err);
        }else{
            res.status(200).send("bom updated");
        }
    })
};
//Delect Record bom
const deletebom = async (req, res) =>{
    const id = req.params.id

    dbconnect.query("DELETE FROM bom WHERE id = ? ", id, 
    (err, result)=>{
        if(err){
            res.status(400).json({error: error.message})
        }else{
            res.status(200).send(`Record ${id} was deleted`);
            // res.send("Delete Success");
        }
    })
};

module.exports ={
    getBoms,
    getSigleBom,
    postBom,
    updatebom,
    deletebom,
    postBomExcel
}