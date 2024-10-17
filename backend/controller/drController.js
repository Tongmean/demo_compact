const dbconnect = require('../DbConnect');
const { logUpdate } = require('../utility/historylog');

const getDr = async (req, res) => {
    try {
        dbconnect.query(`SELECT * FROM "drill" WHERE "Status" IN ('Active', 'Update') ORDER BY "Code_Dr" ASC `, (err, result) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    msg: "Failed to retrieve data from the database.",
                    data: err
                });
            } else {
                res.status(200).json({
                    success: true,
                    msg: "Successfully retrieved data from the database.",
                    data: result.rows, // PostgreSQL stores the result in the `rows` array
                    count: result.rows.length
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Failed to retrieve data from the database.",
            data: error // Changed err to error to properly reference the caught error
        });
    }
};

//Get single Dr
const getSingleDr = async (req, res) => {
    const id = req.params.id;
    try {
        dbconnect.query('SELECT * FROM "drill" WHERE "id" = $1', [id], (err, result) => {
            if (err) {
                res.status(400).json({
                    msg: `Unsuccessful retrieve data from the database by ${id}`,
                    success: false,
                    data: err
                });
            } else {
                res.status(200).json({
                    msg: `Successful retrieve data from the database by ${id}`,
                    success: true,
                    data: result.rows // Use result.rows in PostgreSQL
                });
            }
        });
    } catch (error) {
        res.status(400).json({
            msg: `Unsuccessful retrieve data from the database by ${id}`,
            success: false,
            data: error
        });
    }
};

//Post Dr

const postDr = async (req, res) => {
    const { 
        Code_Dr, Name_Dr, Name_Wip, Name_Fg_1, Demension, 
        Type_Brake, Chem_Grade, Status_Dr, No_Grind, Num_Hole, 
        No_Jig_Drill, No_Drill, No_Reamer, Code, Remark, 
        Color, Color_Spray, Grind_Back, Grind_Front, Grind_Detail, 
        Drill, Baat, Ji_Hou, Fon_Hou, Tha_Khob, Cut, Form 
    } = req.body;
    const Status = "Active";
    // Access the user email from requireAuth middleware
    const userEmail = req.user.email; // This email comes from requireAuth
    const CreateBy = userEmail; // This email comes from requireAuth
    console.log('userEmail:', userEmail)
    try {
        // Check if Code_Dr already exists
        const checkSqlCommand = 'SELECT * FROM "drill" WHERE "Code_Dr" = $1';
        dbconnect.query(checkSqlCommand, [Code_Dr], (err, result) => {
            if (err) {
                console.log('Check Fail', err);
                return res.status(400).json({
                    msg: 'Check duplicate Code_Dr failed',
                    data: err,
                    success: false
                });
            }
            if (result.rows.length > 0) {
                console.log('Code_Dr already exists:', result.rows);
                return res.status(400).json({
                    success: false,
                    msg: `Code_Dr: ${result.rows[0].Code_Dr} already exists.`
                });
            } else {
                // Insert new record
                const sqlCommand = `
                    INSERT INTO "drill" (
                        "Code_Dr", "Name_Dr", "Name_Wip", "Name_Fg_1", "Demension", 
                        "Type_Brake", "Chem_Grade", "Status_Dr", "No_Grind", "Num_Hole", 
                        "No_Jig_Drill", "No_Drill", "No_Reamer", "Code", "Remark", 
                        "Color", "Color_Spray", "Grind_Back", "Grind_Front", "Grind_Detail", 
                        "Drill", "Baat", "Ji_Hou", "Fon_Hou", "Tha_Khob", "Cut", "Form","Status", "CreateBy"
                    ) 
                    VALUES (
                        $1, $2, $3, $4, $5, 
                        $6, $7, $8, $9, $10, 
                        $11, $12, $13, $14, $15, 
                        $16, $17, $18, $19, $20, 
                        $21, $22, $23, $24, $25, $26, $27, $28, $29
                    )
                `;
                dbconnect.query(sqlCommand, [
                    Code_Dr, Name_Dr, Name_Wip, Name_Fg_1, Demension, 
                    Type_Brake, Chem_Grade, Status_Dr, No_Grind, Num_Hole, 
                    No_Jig_Drill, No_Drill, No_Reamer, Code, Remark, 
                    Color, Color_Spray, Grind_Back, Grind_Front, Grind_Detail, 
                    Drill, Baat, Ji_Hou, Fon_Hou, Tha_Khob, Cut, Form, Status, CreateBy
                ], (err, result) => {
                    if (err) {
                        console.log(err)
                        res.status(400).json({
                            success: false,
                            msg: 'Insert Code_Dr Unsuccessful',
                            data: err
                        });
                    } else {
                        res.status(200).json({
                            success: true,
                            msg: `Insert Successful Code_Dr: ${Code_Dr}`,
                            data: result
                        });
                    }
                });
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Insert Code_Dr Unsuccessful due to server error !!',
            data: error
        });
    }
};



const postDrExcel = async (req, res) => {
    // Retrieve data from the request body
    let data = req.body;

    // Ensure no fields are empty; replace empty or null values with "-"
    data = data.map(row => row.map(value => value === "" || value === null ? "-" : value));
    
    // Access the user email from requireAuth middleware
    const userEmail = req.user.email; // This email comes from requireAuth
    console.log('userEmail:', userEmail);

    try {
        // Extract Code_Dr values from the data (assuming it's the first column)
        const codes = data.map(row => row[0]);

        // Query the database to check if these Code_Dr values already exist
        const checkQuery = `SELECT "Code_Dr" FROM "drill" WHERE "Code_Dr" = ANY($1)`;
        dbconnect.query(checkQuery, [codes], (err, existingRows) => {
            if (err) {
                // Return an error response if the query fails
                return res.status(400).json({
                    success: false,
                    msg: "There was an error checking Code_Dr duplicates",
                    data: err
                });
            }

            // Extract the existing Code_Dr values from the query result
            const existingCodes = existingRows.rows.map(row => row.Code_Dr);

            // Separate the data into new records (not in the existingCodes) and existing records
            const newData = data.filter(row => !existingCodes.includes(row[0]));
            const existingData = data.filter(row => existingCodes.includes(row[0]));

            if (newData.length > 0) {
                // Convert newData into an array of objects with named keys for SQL insertion
                const newDataObjects = newData.map(row => ({
                    Code_Dr: row[0],
                    Name_Dr: row[1],
                    Name_Wip: row[2],
                    Name_Fg_1: row[3],
                    Demension: row[4],
                    Type_Brake: row[5],
                    Chem_Grade: row[6],
                    Status_Dr: row[7],
                    No_Grind: row[8],
                    Num_Hole: row[9],
                    No_Jig_Drill: row[10],
                    No_Drill: row[11],
                    No_Reamer: row[12],
                    Code: row[13],
                    Remark: row[14],
                    Color: row[15],
                    Color_Spray: row[16],
                    Grind_Back: row[17],
                    Grind_Front: row[18],
                    Grind_Detail: row[19],
                    Drill: row[20],
                    Baat: row[21],
                    Ji_Hou: row[22],
                    Fon_Hou: row[23],
                    Tha_Khob: row[24],
                    Cut: row[25],
                    Form: row[26],
                    Status: "Active", // Add the Status field with the value 'Active'
                    CreateBy: userEmail // Add the CreateBy field with the value of userEmail
                }));

                // Prepare the values for insertion, including CreateBy
                const values = newDataObjects.map(obj => [
                    obj.Code_Dr,
                    obj.Name_Dr,
                    obj.Name_Wip,
                    obj.Name_Fg_1,
                    obj.Demension,
                    obj.Type_Brake,
                    obj.Chem_Grade,
                    obj.Status_Dr,
                    obj.No_Grind,
                    obj.Num_Hole,
                    obj.No_Jig_Drill,
                    obj.No_Drill,
                    obj.No_Reamer,
                    obj.Code,
                    obj.Remark,
                    obj.Color,
                    obj.Color_Spray,
                    obj.Grind_Back,
                    obj.Grind_Front,
                    obj.Grind_Detail,
                    obj.Drill,
                    obj.Baat,
                    obj.Ji_Hou,
                    obj.Fon_Hou,
                    obj.Tha_Khob,
                    obj.Cut,
                    obj.Form,
                    obj.Status, // Include the Status field in the values array
                    obj.CreateBy // Include the CreateBy field in the values array
                ]);

                // Create placeholders for all rows (e.g., $1, $2, ..., $n)
                const placeholders = values.map((_, i) => `(${
                    Array.from({ length: 29 }, (_, j) => `$${i * 29 + j + 1}`).join(', ')
                })`).join(', ');

                // Insert new records into the database
                const sqlCommand = `INSERT INTO "drill" (
                    "Code_Dr", "Name_Dr", "Name_Wip", "Name_Fg_1", "Demension", "Type_Brake", "Chem_Grade", "Status_Dr",
                    "No_Grind", "Num_Hole", "No_Jig_Drill", "No_Drill", "No_Reamer", "Code", "Remark", "Color", "Color_Spray",
                    "Grind_Back", "Grind_Front", "Grind_Detail", "Drill", "Baat", "Ji_Hou", "Fon_Hou", "Tha_Khob", "Cut", "Form", "Status", "CreateBy"
                ) VALUES ${placeholders}`;

                const flattenedValues = values.flat();

                dbconnect.query(sqlCommand, flattenedValues, (err, result) => {
                    if (err) {
                        // Return an error response if the insertion fails
                        console.log(err);
                        return res.status(400).json({
                            success: false,
                            msg: `There was an error inserting records`,
                            data: err
                        });
                    }

                    // Return a success response with the count of inserted and skipped records
                    res.status(200).json({
                        success: true,
                        msg: `Insert data successful. Inserted ${newData.length} records. ${existingData.length} records were skipped as they already exist.`,
                        data: result
                    });
                });
            } else {
                // Return a response if all records already exist
                res.status(200).json({
                    success: true,
                    msg: `All records already exist. Skipped ${existingData.length} records.`,
                    data: existingData
                });
            }
        });
    } catch (error) {
        // Return a response if there is an exception during processing
        res.status(400).json({
            success: false,
            msg: "There was a problem with processing the Excel data",
            data: error
        });
    }
};






const deleteDr = async (req, res) => {
    const id = req.params.id;
    const Status = "Delete";


    const userEmail = req.user.email; // This email comes from requireAuth
    console.log('userEmail:', userEmail);
    const UpdateBy = userEmail;
    try {
        //Query Current record before update
        const selectedQuery = `SELECT * FROM "wip" WHERE "id" = $1`;
        const selectedResult = await dbconnect.query(selectedQuery, [id]);


        //Update Status -> Delete
        dbconnect.query('UPDATE "drill" SET "Status" = $1 WHERE "id" = $2', [Status, id], (err, result) => {
            if (err) {
                res.status(400).json({
                    success: false,
                    msg: "There Error Accur",
                    data: err
                });
            } else {
                if (selectedResult.rows.length > 0) {
                    const oldValues = selectedResult.rows[0];
                    
                    // Log changes
                    for (const column of ["Status"]) {
                        const oldValue = oldValues[column];
                        const newValue = Status;
                        console.log('oldValues', oldValue);
                        console.log('newValue', newValue)

                        if (oldValue !== newValue) {
                            logUpdate('drill', column, id , oldValue, newValue, UpdateBy);

                        }
                    }
                }
                res.status(200).json({
                    success: true,
                    msg: `Code_Dr:id: ${id} Delete Successfull.`,
                    data: result
                });
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: "There Error Accur",
            data: error
        });
    }
};



//update dr
const updateDr = async (req, res) => {
    // Get values from request (HTTP)
    const id = req.params.id;
    const Code_Dr = req.body.Code_Dr;
    const Name_Dr = req.body.Name_Dr;
    const Name_Wip = req.body.Name_Wip;
    const Name_Fg_1 = req.body.Name_Fg_1;
    const Demension = req.body.Demension;
    const Type_Brake = req.body.Type_Brake;
    const Chem_Grade = req.body.Chem_Grade;
    const Status_Dr = req.body.Status_Dr;
    const No_Grind = req.body.No_Grind;
    const Num_Hole = req.body.Num_Hole;
    const No_Jig_Drill = req.body.No_Jig_Drill;
    const No_Drill = req.body.No_Drill;
    const No_Reamer = req.body.No_Reamer;
    const Code = req.body.Code;
    const Remark = req.body.Remark;
    const Color = req.body.Color;
    const Color_Spray = req.body.Color_Spray;
    const Grind_Back = req.body.Grind_Back;
    const Grind_Front = req.body.Grind_Front;
    const Grind_Detail = req.body.Grind_Detail;
    const Drill = req.body.Drill;
    const Baat = req.body.Baat;
    const Ji_Hou = req.body.Ji_Hou;
    const Fon_Hou = req.body.Fon_Hou;
    const Tha_Khob = req.body.Tha_Khob;
    const Cut = req.body.Cut;
    const Form = req.body.Form;
    //Status
    const Status = "Update";
    const userEmail = req.user.email; // This email comes from requireAuth
    console.log('userEmail:', userEmail);
    const UpdateBy = userEmail;

    try {
        //Query Current Value Before update
        //Query Current record before update
        const selectedQuery = `SELECT * FROM "drill" WHERE "id" = $1`;
        const selectedResult = await dbconnect.query(selectedQuery, [id]);

        //Query update
        const query = `
            UPDATE "drill" SET
                "Code_Dr" = $1, "Name_Dr" = $2, "Name_Wip" = $3, "Name_Fg_1" = $4, "Demension" = $5,
                "Type_Brake" = $6, "Chem_Grade" = $7, "Status_Dr" = $8, "No_Grind" = $9, "Num_Hole" = $10,
                "No_Jig_Drill" = $11, "No_Drill" = $12, "No_Reamer" = $13, "Code" = $14, "Remark" = $15,
                "Color" = $16, "Color_Spray" = $17, "Grind_Back" = $18, "Grind_Front" = $19, "Grind_Detail" = $20,
                "Drill" = $21, "Baat" = $22, "Ji_Hou" = $23, "Fon_Hou" = $24, "Tha_Khob" = $25, "Cut" = $26,
                "Form" = $27, "Status" = $28 WHERE "id" = $29
        `;

        dbconnect.query(query, [
            Code_Dr, Name_Dr, Name_Wip, Name_Fg_1, Demension, Type_Brake, Chem_Grade, Status_Dr,
            No_Grind, Num_Hole, No_Jig_Drill, No_Drill, No_Reamer, Code, Remark, Color, Color_Spray,
            Grind_Back, Grind_Front, Grind_Detail, Drill, Baat, Ji_Hou, Fon_Hou, Tha_Khob, Cut, Form, Status, id
        ], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    success: false,
                    msg: `There was a problem while updating DR ${id}`,
                    data: err
                });
            } else {
                if (selectedResult.rows.length > 0) {
                    const oldValues = selectedResult.rows[0];
                    
                    // Log changes
                    for (const column of ["Code_Dr", "Name_Dr", "Name_Wip", "Name_Fg_1", "Demension", "Type_Brake", "Chem_Grade", "Status_Dr", "No_Grind", "Num_Hole", "No_Jig_Drill", "No_Drill", "No_Reamer", "Code", "Remark", "Color", "Color_Spray", "Grind_Back", "Grind_Front", "Grind_Detail", "Drill", "Baat", "Ji_Hou", "Fon_Hou", "Tha_Khob", "Cut", "Form"]) {
                        const oldValue = oldValues[column];
                        const newValue = req.body[column];
                        // console.log('oldValues', oldValue);
                        // console.log('newValue', newValue)

                        if (oldValue !== newValue) {
                            logUpdate('drill', column, id , oldValue, newValue, UpdateBy);

                        }
                    }
                }
                res.status(200).json({
                    success: true,
                    msg: `Code_Dr Id: ${id} update successful`,
                    data: result
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: `There was a problem while updating DR ${id}`,
            data: error
        });
    }
};




module.exports ={
    getDr,
    getSingleDr,
    postDr,
    deleteDr,
    postDrExcel,
    updateDr
}