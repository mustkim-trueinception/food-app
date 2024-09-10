const expres = require('express');
const { 
    getUserController, 
    updateUserController, 
    updatePasswordController, 
    resetPasswordController,
    deleteUserController,
    profileImageController
 } = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = expres.Router();

//routes
// GET USER | GET
router.get('/getUser',authMiddleware,getUserController)

// UPDATE USER DETAILS | PUT
router.put('/updateUser',authMiddleware,updateUserController)

// PASSWORD UPDATE | PUT
router.put('/updatePassword',authMiddleware,updatePasswordController)

// RESET PASSWORD | POST
router.post('/resetPassword',authMiddleware,resetPasswordController)

// DELETE USER | DELETE
router.delete('/deleteUser',authMiddleware,deleteUserController)

// UPDATE PROFILE IMAGE | POST 
router.put('/profileImage',profileImageController)



module.exports = router