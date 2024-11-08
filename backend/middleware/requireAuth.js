const jwt = require('jsonwebtoken');
const dbconnect = require('../DbConnect');

const requireAuth = async (req, res, next) => {
    // Destructuring Header req
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ msg: 'Authorization token required' });
    }

    const token = authorization.split(' ')[1];
    // console.log(token);

    try {
        // Verify the token and extract the user ID
        const decoded = jwt.verify(token, process.env.SECRET);
        // console.log('Decoded Token:', decoded);

        // Destructure id from decoded
        const { id } = decoded;

        // Fetch the user from the database asynchronously
        dbconnect.query('SELECT * FROM "users" WHERE "id" = $1', [id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ msg: 'Database query failed' });
            }

            if (result.rows.length === 0) {
                return res.status(401).json({ msg: 'User not found' });
            }

            // Store user information in req.user
            req.user = result.rows[0];

            // Proceed to the next middleware or route handler
            next();
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({ msg: 'Request is not Authorized' });
    }
};

module.exports = requireAuth;
