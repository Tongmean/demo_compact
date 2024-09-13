const express = require('express');
const router = express.Router();


const {joinTable, joinTableDash} = require('../controller/dashboard')

router.get('/', joinTable);
router.get('/jointabledash', joinTableDash);



module.exports = router;