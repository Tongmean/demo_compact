const express = require('express');
const router = express.Router();

//Import function in UserController
const { getUsers, createuser, login } = require('../controller/userController');

//Get user
router.get('/',getUsers);
//Post user
router.post('/createuser', createuser)
//login verify
router.post('/login', login)




module.exports = router;