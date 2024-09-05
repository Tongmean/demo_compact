const express = require('express');
const router = express.Router();
const {getFgs, getSigleFg, postFg, postfgexcel, deleteFg } = require("../controller/fgcontroller")
//Get all Fg
router.get('/', getFgs);
//Get Single Fg
router.get('/:id', getSigleFg);
router.post('/create', postFg);
router.post('/createExcel', postfgexcel);
router.delete('/delete/:id', deleteFg);


module.exports = router;