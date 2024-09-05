const express = require('express');
const router = express.Router();
const {getWip, getSingleWip, postWip, deleteWip} = require('../controller/wipController');


router.get('/', getWip);
router.get('/:id', getSingleWip);
router.post('/create', postWip);
router.delete('/delete/:id', deleteWip);


module.exports = router;