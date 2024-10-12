const express = require('express');
const router = express.Router();

const { uploadMidleware, postDrawing, getDrawingByCode_Fg, getDrawings, getSigleDrawing, deleteDrawing, updateDrawing} = require('../controller/drawingController');

router.post('/create',uploadMidleware,postDrawing);

router.get('/getdrawingbycode_fg/:Code_Fg',getDrawingByCode_Fg);

router.get('/',getDrawings);

router.get('/:id', getSigleDrawing);

router.delete('/delete/:id',deleteDrawing);

router.put('/update/:id',uploadMidleware,updateDrawing);


module.exports = router;