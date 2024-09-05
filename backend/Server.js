//call express
const express = require('express');
// app express
const app = express();
//Call cors
const cors = require('cors')
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
// Create Router (Table bom)
app.use('/api/bom', bomsrouter);
// Create Router (Table User)
app.use('/api/user', userrouter);
//Fg
app.use('/api/fg',fgRoutes)
//wip
app.use('/api/wip',wipRoutes)




//Config Port using dotenv
require('dotenv').config();
const port = process.env.PORT || 8000;
//listen port
app.listen(port, (req, res) => {
    console.log('Your server run on port', port)
})