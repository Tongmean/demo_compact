const express = require('express');
const router = express.Router();
const {staticFg, staticDr, staticWip, staicFgPartNo, getPcsperset,} = require('../controller/staticController')

router.get('/fg',staticFg);
router.get('/dr',staticDr);
router.get('/wip',staticWip);
router.get('/fg/partno',staicFgPartNo);

router.get('/pcsperset',getPcsperset);



module.exports = router;