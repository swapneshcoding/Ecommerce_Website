const express = require('express');
const { registerUser, getUserDetails, loginUser, logoutUser, forgotPassword, resetPassword, updateUserPassword, updateUserProfile, listAllUsers, getUserDetailsAdmin, updateUserRoleAdmin, deleteUserAdmin} = require('../controllers/userController');
const { isAuthenticatedUser, isAuthorizedRole } = require('../middleware/authentication');
const router = express.Router();


router.route('/register').post(registerUser);
router.route('/profile').get(isAuthenticatedUser,getUserDetails);

router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/password/update').put(isAuthenticatedUser, updateUserPassword);
router.route('/profile/update').put(isAuthenticatedUser, updateUserProfile);

router.route('/admin/users').get(isAuthenticatedUser, isAuthorizedRole('admin'), listAllUsers);
router.route('/admin/user/:id')
.get(isAuthenticatedUser, isAuthorizedRole('admin'), getUserDetailsAdmin)
.put(isAuthenticatedUser, isAuthorizedRole('admin'), updateUserRoleAdmin)
.delete(isAuthenticatedUser, isAuthorizedRole('admin'), deleteUserAdmin);

module.exports = router;