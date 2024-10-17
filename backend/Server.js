//Middleware make request body light weight
const compression = require('compression')

//call express
const express = require('express');
// app express
const app = express();
//Call cors
const cors = require('cors')
//Call body-parser
const bodyParser = require('body-parser');
//Middleware
app.use(compression())
const path = require('path');
app.use(cors())
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true })); // For URL-encoded data
app.use(bodyParser.json());
// Serve static files from the 'Assets' folder
app.use('/Assets', express.static(path.join(__dirname, 'Assets')));
//Connect Db
// const dbconnect = require('../Backend/DbConnect');

//Import Router user
const userrouter = require('./routes/userRoutes')
//Auth middleware
const requireAuth = require('./middleware/requireAuth');
//Import Router Bom
const bomsrouter = require('../Backend/routes/bomRoutes');
const fgRoutes = require('./routes/fgRoutes')
const wipRoutes = require('./routes/wiproutes')
const drRoutes = require('./routes/drRoutes')
const dashRoutes = require('./routes/dashRoutes')
const historyLogRouter = require('./routes/historyLogRouters') 
const drawingRouter = require('./routes/drawingRoutes')
const staticRouter = require('./routes/staticRoute')
const staicWiprouter = require('./routes/staticWiproutes')
const staticDrrouter = require('./routes/staticDrroutes')
// Create Router (Table User)
app.use('/api/user', userrouter);

// Create Router (Table bom)
app.use('/api/bom', requireAuth, bomsrouter);

//Fg
app.use('/api/fg',requireAuth,fgRoutes)
//wip
app.use('/api/wip',requireAuth,wipRoutes)
//dr
app.use('/api/dr', requireAuth, drRoutes)

//dash(Product Data)
app.use('/api/dash',requireAuth, dashRoutes)

app.use('/api/historylog', requireAuth,historyLogRouter)
//Drawing
app.use('/api/drawing', requireAuth, drawingRouter)
//Static Wip/Fg/Dr
app.use('/api/static', requireAuth, staticRouter)
//static wip
app.use('/api/static/wip', requireAuth, staicWiprouter)
app.use('/api/static/dr', requireAuth, staticDrrouter)
//


//Config Port using dotenv
require('dotenv').config();
const port = process.env.PORT || 8000;
//listen port
app.listen(port, (req, res) => {

    console.log('Your server run on port', port)
})