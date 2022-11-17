const express = require('express');
const { registerUser, listAllUsers} = require('../controllers/userController');
const router = express.Router();


router.route('/register').post(registerUser);
router.route('/users').get(listAllUsers);


module.exports = router;