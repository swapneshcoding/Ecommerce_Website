const express = require('express');
const { registerUser, listAllUsers, loginUser} = require('../controllers/userController');
const router = express.Router();


router.route('/register').post(registerUser);
router.route('/users').get(listAllUsers);

router.route('/login').post(loginUser);


module.exports = router;