const express = require('express');
const { registerUser, listAllUsers, loginUser, logoutUser, forgotPassword, resetPassword} = require('../controllers/userController');
const router = express.Router();


router.route('/register').post(registerUser);
router.route('/users').get(listAllUsers);

router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);

module.exports = router;