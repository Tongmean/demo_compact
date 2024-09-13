const express = require('express');
const router = express.Router();
const {getDr, getSingleDr, postDr, deleteDr, postDrExcel, updateDr} =  require('../controller/drController')

router.get('/', getDr);
router.get('/:id', getSingleDr);
router.post('/create', postDr);
router.post('/createExcel', postDrExcel);

router.put('/update/:id', updateDr);

router.delete('/delete/:id', deleteDr);




module.exports = router;