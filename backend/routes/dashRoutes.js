const express = require('express');
const router = express.Router();


const { joinTableDash} = require('../controller/dashboard')

router.get('/jointabledash', joinTableDash);



module.exports = router;