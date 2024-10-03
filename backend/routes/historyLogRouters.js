const express = require('express');
const router = express.Router();
const { historyLogWip, historyLogFg, historyLogBom ,historyLogDr}= require('../controller/historyLogController');


router.get('/wip/:id', historyLogWip);
router.get('/fg/:id', historyLogFg);
router.get('/bom/:id', historyLogBom);
router.get('/dr/:id', historyLogDr);

module.exports = router;