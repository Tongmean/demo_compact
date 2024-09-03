//Connect DB
const dbconnect = require('../DbConnect');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//Get All boms
const getUsers= async (req,res) =>{
    dbconnect.query("SELECT * FROM users",(err, result) =>{
        if(err){
            console.log(err);
        }else{
            res.status(200).send(result);
        }
    });
}
//Get All boms
const createuser = async (req,res) =>{
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;
    const hashpassword = await bcrypt.hash(password, 10); // Hash password
    dbconnect.query("INSERT INTO users(email, password, role) VALUES( ?, ?, ?)",
    [email, hashpassword, role],
    (err, result) =>{
        if(err){
            res.status(500).json({ error: "Internal Server Error" });
        }else{
            res.status(200).json({ message: "Registered Successfully" });
        }
    });
}

//create login

const login = async (req, res) =>{
    try {
        const {email, password} = req.body;
        // Validate input
        if (!email || !password) {
            return res.status(401).send('email and password are required');
        }

        const sql = 'SELECT * FROM users WHERE email = ?';
        dbconnect.query(sql, [email], async (err, result) => {
            if (err) throw err;
            // Check if user exists
            if (result.length === 0) {
                return res.status(401).json({ 'message': 'Invalid email or password'});
            }
            //Get user From database
            const user = result[0];
            // Compare passwords
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({ 'message': 'Invalid email or password'});
            }
             // Generate JWT token (Include id, email in object)
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET, { expiresIn: '10h' });

             // Respond with the token
            res.status(200).json({ token, user }); 
            //Response to frontend
        })
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Error logging in');
    }

}



module.exports ={
    getUsers,
    createuser,
    login,
}
