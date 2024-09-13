// const mongoose = require('mongoose')
// const dbconnect = mongoose.connect(process.env.MONG_URI)
//     .then(()=>{
//         console.log('Conect db seccessfully')
//     })
//     .catch((error)=>{
//         console.log(error)
// })

// module.exports = dbconnect;

const mysql = require('mysql')
const dbconnect = mysql.createConnection({
  user:"root",
  host: "localhost",
  database: "demo_1"
});
  
dbconnect.connect((err) => {
    if (err) {
      console.log("Database Connection Failed !!!", err);
    } else {
      console.log("connected to Database");
    }
})
module.exports = dbconnect;