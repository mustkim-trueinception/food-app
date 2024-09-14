// GET USER INFORMATION

const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");

/**
 * Controller to get user information by ID
 * @function getUserController
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.body.id - ID of the user
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} - Returns the user information or an error message if the user is not found
 *
 * @description
 * This function fetches user information by their ID and hides the password from the response.
 *
 * @throws Will return an error if the user is not found or if there is an issue fetching the user data.
 */
const getUserController = async (req, res) => {
  try {
    // find user
    const user = await userModel.findById(req.body.id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    // hide password
    user.password = undefined;

    // response send
    res.status(200).send({
      success: true,
      message: "User found successfully",
      user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Fetching User",
      error,
    });
  }
};

/**
 * Controller to update user information
 * @function updateUserController
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.body.id - ID of the user
 * @param {string} [req.body.username] - New username of the user (optional)
 * @param {string} [req.body.address] - New address of the user (optional)
 * @param {string} [req.body.phone] - New phone number of the user (optional)
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} - Returns success message if user is updated, or an error message if update fails
 *
 * @description
 * This function allows a user to update their username, address, and phone number.
 *
 * @throws Will return an error if the user is not found or if there is an issue updating the user data.
 */
// UPDATE USER
const updateUserController = async (req, res) => {
  try {
    // find user
    const user = await userModel.findById({ _id: req.body.id });
    // validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    // update user data
    const { username, address, phone } = req.body;
    if (username) user.username = username;
    if (address) user.address = address;
    if (phone) user.phone = phone;
    // save user
    await user.save();
    res.status(200).send({
      success: true,
      message: "User Updated Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: "false",
      message: "Error in updating user",
      error,
    });
  }
};

/**
 * Controller to update user password
 * @function updatePasswordController
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.body.id - ID of the user
 * @param {string} req.body.oldPassword - Current password of the user
 * @param {string} req.body.newPassword - New password for the user
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} - Returns success message if password is updated, or an error message if update fails
 *
 * @description
 * This function allows users to update their password by verifying the old password and setting a new one.
 *
 * @throws Will return an error if the old password is incorrect or if there is an issue updating the password.
 */
// UPDATE USER PASSWORD
const updatePasswordController = async (req, res) => {
  try {
    // find user
    const user = await userModel.findById(req.body.id);
    // validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // get data from user to update old password
    const { oldPassword, newPassword } = req.body;

    // validation
    if (!oldPassword || !newPassword) {
      return res.status(400).send({
        success: false,
        message: "Please provide both old and new passwords",
      });
    }

    // compare old password
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(402).send({
        success: false,
        message: "Incorrect old password",
      });
    }

    // Hashing new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in password update",
      error,
    });
  }
};

/**
 * Controller to reset user password
 * @function resetPasswordController
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.body.email - Email of the user
 * @param {string} req.body.newPassword - New password for the user
 * @param {string} req.body.answer - Security answer for verification
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} - Returns success message if password is reset, or an error message if reset fails
 *
 * @description
 * This function resets a user's password by validating the provided email and security answer.
 *
 * @throws Will return an error if the email, answer, or new password is incorrect or if there is an issue resetting the password.
 */
// RESET USER PASSWORD
const resetPasswordController = async (req, res) => {
  try {
    // find user by email new password and answer
    const { email, newPassword, answer } = req.body;
    // validation
    if (!email || !newPassword || !answer) {
      return res.status(400).send({
        success: false,
        message: "Please provide all fields",
      });
    }
    const user = await userModel.findOne({ email, answer });
    // validation
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User Not Found or Invalid answer",
      });
    }
    // Hasing Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    // update password
    user.password = hashedPassword;
    // store in db
    await user.save();
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error in Resetting Password",
      error,
    });
  }
};

/**
 * Controller to delete a user account
 * @function deleteUserController
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.body._id - ID of the user to be deleted
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} - Returns success message if the user is deleted, or an error message if deletion fails
 *
 * @description
 * This function deletes a user account by the provided ID.
 *
 * @throws Will return an error if the user is not found or if there is an issue deleting the user.
 */
// DELETE PROFILE | ACCOUNT
const deleteUserController = async (req, res) => {
  try {
    // find user
    const user = await userModel.findByIdAndDelete(req.body._id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Deleting Api",
    });
  }
};

// profile upload route
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now() + ".jpg");
    },
  }),
}).single("image");

/**
 * Controller to upload a user profile image
 * @function profileImageController
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.file - Uploaded file object
 * @param {string} req.body.id - ID of the user
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} - Returns success message if profile image is uploaded, or an error message if upload fails
 *
 * @description
 * This function uploads a new profile image for the user and updates their profile data with the image path.
 *
 * @throws Will return an error if the user is not found or if there is an issue uploading the image.
 */
// Upload Profile Image
const profileImageController = async (req, res) => {
  try {
    // Get the file path
    const fieldname = req.file.fieldname;
    const filePath = req.file.path;
    const user = await userModel.findById({ _id: req.body.id });
    // validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    // update user data
    const { image } = req.body;
    const updated = (user.profile = `${filePath}`);
    // save user
    await user.save();

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).send({
      message: "File uploaded successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

module.exports = {
  getUserController,
  updateUserController,
  updatePasswordController,
  resetPasswordController,
  deleteUserController,
  profileImageController,
  upload,
};
