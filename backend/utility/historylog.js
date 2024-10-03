// logging.js
const dbconnect = require('../DbConnect'); // Adjust the path to your dbconnect module

async function logUpdate(table, column, record_id, oldValue, newValue, user) {
    const query = `
        INSERT INTO update_log (table_name, column_name, record_id , old_value, new_value, updatedby)
        VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const values = [table, column, record_id , oldValue, newValue, user];
    
    try {
        // Ensure the query is properly awaited
        const result = await dbconnect.query(query, values);
        console.log("History Log successfully inserted", result.command);
    } catch (err) {
        console.error('Error logging update:', err); // Log the error if something goes wrong
    }
}

module.exports = {
    logUpdate
};
