const express = require('express');
const router = express.Router();
const {getDr, getSingleDr, postDr, deleteDr} =  require('../controller/drController')

router.get('/', getDr);
router.get('/:id', getSingleDr);
router.post('/create', postDr);
router.delete('/delete/:id', deleteDr);



module.exports = router;