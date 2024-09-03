const jwt = require('jsonwebtoken');
const dbconnect = require('../DbConnect');

const requireAuth = async (req, res, next) => {
    // Destructuring Header req
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authorization.split(' ')[1];
    console.log(token)
    try {
        // Verify the token and extract the user ID
        const decoded = jwt.verify(token, process.env.SECRET);
        console.log('Decoded Token:', decoded);
        //Destructor id from decoded
        const { id } = decoded;
       
        // Fetch the user from the database asynchronously
        dbconnect.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {

            
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database query failed' });
            }
            
            if (results.length === 0) {
                return res.status(401).json({ error: 'User not found' });
            }

            // Store user information in req.user
            req.user = results[0];

            // Proceed to the next middleware or route handler
            next();
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: 'Request is not Authorized' });
    }
};

module.exports = requireAuth;
