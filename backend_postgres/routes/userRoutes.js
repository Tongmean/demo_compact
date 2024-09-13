const express = require('express');
const router = express.Router();

//Import function in UserController
const { getUsers, createuser, login, getSingleUser, deleteUser } = require('../controller/userController');

//Get user
router.get('/',getUsers);
router.get('/:id',getSingleUser);
//Post user
router.post('/create', createuser)
//login verify
router.delete('/delete/:id', deleteUser)
//login verify
router.post('/login', login)




module.exports = router;