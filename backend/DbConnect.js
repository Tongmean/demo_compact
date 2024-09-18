const { Pool } = require('pg');

// Create a new pool with connection details
const dbconnect = new Pool({
  user: 'postgres',       // Your PostgreSQL username
  host: 'localhost',            // Database host (e.g., localhost)
  database: 'bom',    // Your PostgreSQL database name
  password: '15tongmean',    // Your PostgreSQL password
  port: 5432,                   // Default PostgreSQL port
});
dbconnect.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
  } else {
    console.log('Connection to PostgreSQL successful!');
    release();  // Release the client back to the pool
  }
});


module.exports = dbconnect;