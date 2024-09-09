const express = require('express');
const router = express.Router();


const {joinTable} = require('../controller/dashboard')

router.get('/', joinTable);



module.exports = router;