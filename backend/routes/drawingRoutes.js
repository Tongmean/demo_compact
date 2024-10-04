const express = require('express');
const router = express.Router();

const { uploadMidleware, postDrawing, getDrawingByCode_Fg} = require('../controller/drawingController');

router.post('/create',uploadMidleware,postDrawing);

router.get('/getdrawingbycode_fg/:Code_Fg',getDrawingByCode_Fg);


module.exports = router;