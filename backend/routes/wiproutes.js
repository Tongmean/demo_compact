const express = require('express');
const router = express.Router();
const {getWip, getSingleWip, postWip, deleteWip, updateWip, postWipExcel} = require('../controller/wipController');


router.get('/', getWip);
router.get('/:id', getSingleWip);
router.post('/create', postWip);
router.delete('/delete/:id', deleteWip);
router.put('/update/:id', updateWip);
router.post('/createExcel', postWipExcel);


module.exports = router;