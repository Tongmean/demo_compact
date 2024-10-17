const express = require('express');
const router = express.Router();
const {getTypebrakewip, getTypemold} = require('../controller/staticWipcontroller')

router.get('/typebrake',getTypebrakewip);
router.get('/typemold',getTypemold);



module.exports = router;