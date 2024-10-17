const express = require('express');
const router = express.Router();
const {getTypebrakedr, getProcessorder, getFormreport, getColor } = require('../controller/staticDrcontroller')

router.get('/typebrake',getTypebrakedr);
router.get('/processorder',getProcessorder);
router.get('/color',getColor);
router.get('/formreport',getFormreport);



module.exports = router;