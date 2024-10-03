const express = require('express');
const router = express.Router();


const { joinTableDash} = require('../controller/productDataController')

router.get('/jointabledash', joinTableDash);



module.exports = router;