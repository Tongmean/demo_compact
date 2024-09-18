//call express
const express = require('express');
// app express
const app = express();
//Call cors
const cors = require('cors')

// const corsOptions = {
//     origin: 'http://192.168.5.92:3000', // Replace with your client's URL
//     methods: 'GET, POST, PUT, DELETE, OPTIONS',
//     allowedHeaders: 'Content-Type, Authorization'
// };

// app.use(cors(corsOptions));
//Call body-parser
const bodyParser = require('body-parser');
//Middleware
app.use(cors())
app.use(express.json()); // Upcoming req to Json
app.use(bodyParser.json());
//Connect Db
const dbconnect = require('../Backend/DbConnect');
//Import Router Bom
const bomsrouter = require('../Backend/routes/bomRoutes');
//Import Router user
const userrouter = require('./routes/userRoutes')
const fgRoutes = require('./routes/fgRoutes')
const wipRoutes = require('./routes/wiproutes')
const drRoutes = require('./routes/drRoutes')
const dashRoutes = require('./routes/dashRoutes')
// Create Router (Table bom)
app.use('/api/bom', bomsrouter);
// Create Router (Table User)
app.use('/api/user', userrouter);
//Fg
app.use('/api/fg',fgRoutes)
//wip
app.use('/api/wip',wipRoutes)
//dr
app.use('/api/dr', drRoutes)

//dash
app.use('/api/dash', dashRoutes)




//Config Port using dotenv
require('dotenv').config();
const port =  8000;
//listen port
app.listen(port, (req, res) => {

    console.log('Your server run on port', port)
})