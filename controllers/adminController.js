const adminModel = require("../models/adminModel");
const userModel = require("../models/userModel");
const { route } = require("../routes/testRoutes");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Controller for admin registration
 * @function adminController
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing admin registration details
 * @param {string} req.body.email - Admin's email
 * @param {string} req.body.password - Admin's password
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} - Returns a response object indicating success or failure
 *
 * @description
 * This function registers a new admin by taking the email and password, validating the input,
 * hashing the password, and saving the admin details to the database.
 * It returns a success response with the admin data upon successful registration or an error response if something goes wrong.
 *
 * @throws Will return an error if any part of the registration process fails.
 */
// Register route
const adminController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please provide all fields",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await adminModel.create({
      email,
      password: hashedPassword,
    });

    return res.status(201).send({
      success: true,
      message: "Successfully Registered",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Registration API",
    });
  }
};

/**
 * Controller for admin login
 * @function adminloginController
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing login details
 * @param {string} req.body.email - Admin's email
 * @param {string} req.body.password - Admin's password
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} - Returns a response object with a JWT token and admin data if login is successful
 *
 * @description
 * This function allows an admin to log in by validating the email and password,
 * checking if the admin exists, and comparing the provided password with the hashed password.
 * If login is successful, it generates a JWT token and sends it along with the admin data, while hiding the password.
 *
 * @throws Will return an error if the admin is not found, the password is incorrect, or any other error occurs during login.
 */
// Login route ....
const adminloginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validation
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Please provide email and password",
      });
    }
    //check if user exists
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(500).send({
        success: false,
        message: "admin not found",
      });
    }
    // compare password | check user password
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(500).send({
        success: false,
        message: "Incorrect password",
      });
    }
    // token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // password hide | send response
    admin.password = undefined;
    res.status(200).send({
      success: true,
      message: "Login successfully",
      token,
      admin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration API",
    });
  }
};

module.exports = { adminController, adminloginController };
