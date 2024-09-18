//Connect DB
const dbconnect = require('../DbConnect');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//Get All user
const getUsers = async (req, res) => {
    try {
        dbconnect.query('SELECT * FROM "users"', (err, result) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    msg: "Failed to retrieve data from the database.",
                    data: err
                });
            } else {
                res.status(200).json({
                    success: true, // Changed from false to true to indicate success
                    msg: "Retrieve successful",
                    data: result.rows // PostgreSQL query result has a 'rows' property
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Failed to retrieve data from the database.",
            data: error
        });
    }
};


//Get single user
const getSingleUser = async (req, res) => {
    const id = req.params.id;
    const sqlCommand = 'SELECT * FROM "users" WHERE "id" = $1';
    try {
        dbconnect.query(sqlCommand, [id], (err, result) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    msg: 'Failed to retrieve data from the database.',
                    data: err
                });
            } else {
                res.status(200).json({
                    success: true,
                    msg: 'Retrieve successful',
                    data: result.rows
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Failed to retrieve data from the database.',
            data: error
        });
    }
};


//Create user
const createuser = async (req, res) => {
    const { email, password, role } = req.body;
    try {
        // Check if email already exists
        dbconnect.query('SELECT "email" FROM "users" WHERE "email" = $1', [email], async (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    msg: 'Error checking email. Please try again!',
                    data: err
                });
            }

            if (result.rows.length > 0) {
                // Email already exists
                return res.status(400).json({
                    success: false,
                    msg: 'Email already exists. Please use a different email.',
                });
            }

            // Hash password
            const hashpassword = await bcrypt.hash(password, 10);
            
            // Insert new user into the database
            dbconnect.query('INSERT INTO "users"("email", "password", "role") VALUES($1, $2, $3)', 
            [email, hashpassword, role], 
            (err, result) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        msg: 'Register Unsuccessful. Please try again!',
                        data: err
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        msg: "Registered Successfully",
                        data: result
                    });
                }
            });
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Register Unsuccessful. Please try again!',
            data: error
        });
    }
};



//create login

// const login = async (req, res) =>{
//     try {
//         const {email, password} = req.body;
//         console.log(req.body);

//         // Validate input
//         if (!email || !password) {
//             return res.status(401).json({msg:'email and password are required'});
//         }

//         const sql = 'SELECT * FROM users WHERE email = ?';
//         dbconnect.query(sql, [email], async (err, result) => {
//             if (err) throw err;
//             // Check if user exists
//             if (result.length === 0) {
//                 return res.status(401).json({ 'msg': 'Invalid email or password'});
//             }
//             //Get user From database
//             const user = result[0];
//             // Compare passwords
//             const passwordMatch = await bcrypt.compare(password, user.password);

//             if (!passwordMatch) {
//                 return res.status(401).json({ 'msg': 'Invalid email or password'});
//             }
//              // Generate JWT token (Include id, email in object)
//             const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET, { expiresIn: '10h' });

//              // Respond with the token
//             res.status(200).json({ token, user }); 
//             //Response to frontend
//         })
//     } catch (error) {
//         console.error('Login error:', error);
//         res.status(500).json({msg: 'Error logging in'});
//     }

// }

//Create login postgresql
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(401).json({ msg: 'Email and password are required' });
        }

        const sql = 'SELECT * FROM "users" WHERE "email" = $1';
        dbconnect.query(sql, [email], async (err, result) => {
            if (err) {
                console.error('Query error:', err);
                return res.status(500).json({ msg: 'Database query error' });
            }

            // Check if user exists
            if (result.rows.length === 0) {
                return res.status(401).json({ msg: 'Invalid email or password' });
            }

            // Get user from database
            const user = result.rows[0];

            // Compare passwords
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({ msg: 'Invalid email or password' });
            }

            // Generate JWT token (Include id, email in object)
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET, { expiresIn: '10h' });

            // Respond with the token
            res.status(200).json({ token, user });
            console.log('token',token)
            console.log('user',user)
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ msg: 'Error logging in' });
    }
};



//Delete user
const deleteUser = async (req, res) => {
    const id = req.params.id;
    const sqlCommand = `DELETE FROM "users" WHERE "id" = $1`;
    try {
        dbconnect.query(sqlCommand, [id], (err, result) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    msg: `Delete user id: ${id} unsuccessful. Please try again!`,
                    data: err,
                });
            } else {
                res.status(200).json({
                    success: true,
                    msg: `Delete user id: ${id} successful`,
                    data: result,
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: `Delete user id: ${id} unsuccessful. Please try again!`,
            data: error,
        });
    }
};


module.exports ={
    getUsers,
    createuser,
    login,
    getSingleUser,
    deleteUser,
}
