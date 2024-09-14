// RESTURANT CONTROLLER

const restaurantModel = require("../models/restaurantModel");

/**
 * Controller for creating a new restaurant
 * @function createResturantController
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing restaurant details
 * @param {string} req.body.title - Title of the restaurant
 * @param {string} [req.body.imageUrl] - Image URL of the restaurant (optional)
 * @param {Array<Object>} [req.body.foods] - List of foods associated with the restaurant (optional)
 * @param {string} [req.body.time] - Opening hours of the restaurant (optional)
 * @param {boolean} [req.body.pickup] - Whether the restaurant offers pickup (optional)
 * @param {boolean} [req.body.delivery] - Whether the restaurant offers delivery (optional)
 * @param {boolean} [req.body.isOpen] - Open status of the restaurant (optional)
 * @param {string} [req.body.logoUrl] - Logo URL of the restaurant (optional)
 * @param {number} [req.body.rating] - Rating of the restaurant (optional)
 * @param {number} [req.body.ratingCount] - Number of ratings (optional)
 * @param {string} [req.body.code] - Unique code of the restaurant (optional)
 * @param {string} req.body.address - Address of the restaurant
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} - Returns a success message if the restaurant is created, or an error response if creation fails
 *
 * @description
 * This function creates a new restaurant and saves it to the database. It validates that the `title` and `address` fields are provided.
 *
 * @throws Will return an error if required fields are missing or if there is an issue saving the restaurant.
 */
// CREATE RESTURANTS CONTROLLER
const createResturantController = async (req, res) => {
  try {
    const {
      title,
      imageUrl,
      foods,
      time,
      pickup,
      delivery,
      isOpen,
      logoUrl,
      rating,
      ratingCount,
      code,
      address,
    } = req.body;
    // validation
    if (!title || !address) {
      return res.status(500).send({
        success: false,
        message: "Please Provide title and address",
      });
    }
    const newResturant = new restaurantModel({
      title,
      imageUrl,
      foods,
      time,
      pickup,
      delivery,
      isOpen,
      logoUrl,
      rating,
      ratingCount,
      code,
      address,
    });
    await newResturant.save();
    res.status(200).send({
      success: true,
      message: "New Resturant Created Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Resturant API",
      error,
    });
  }
};

/**
 * Controller for fetching all restaurants
 * @function getAllResturantController
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} - Returns a success message and a list of all restaurants, or an error response if fetching fails
 *
 * @description
 * This function retrieves all restaurants from the database and returns them in the response.
 *
 * @throws Will return an error if no restaurants are found or if there is an issue fetching them.
 */
// GET ALL RESTURANTS
const getAllResturantController = async (req, res) => {
  try {
    // find resturant
    const resturants = await restaurantModel.find({});
    // validation
    if (!resturants) {
      return res.status(404).send({
        success: false,
        message: "Resturants Not Found",
      });
    }
    res.status(200).send({
      success: true,
      totalCount: resturants.length,
      message: "Resturants Found Successfully",
      resturants,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Resturant API",
      error,
    });
  }
};

/**
 * Controller for fetching a single restaurant by ID
 * @function getResturantByIdController
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Restaurant ID
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} - Returns a success message and the restaurant details, or an error response if not found
 *
 * @description
 * This function fetches a single restaurant based on the provided restaurant ID.
 *
 * @throws Will return an error if no restaurant is found or if the ID is invalid.
 */
// GET RESTURANT BY ID

const getResturantByIdController = async (req, res) => {
  try {
    const resturantId = req.params.id;
    // validation of resturant Id
    if (!resturantId) {
      return res.status(404).send({
        success: false,
        message: "Please Provide Resturant Id",
      });
    }
    // find resturant Id
    const resturant = await restaurantModel.findById(resturantId);
    // validation
    if (!resturant) {
      return res.status(404).send({
        success: false,
        message: "Resturant Not Found By Id",
      });
    }
    res.status(202).send({
      success: true,
      message: "Resturant Found Successfully By Id",
      resturant,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get Resturant API By ID",
      error,
    });
  }
};

/**
 * Controller for deleting a restaurant by ID
 * @function deleteResturantController
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Restaurant ID
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} - Returns a success message if the restaurant is deleted, or an error response if the deletion fails
 *
 * @description
 * This function deletes a restaurant by its ID from the database.
 *
 * @throws Will return an error if no restaurant is found or if the ID is invalid.
 */
// DELETE RESTURANT CONTROLLER
const deleteResturantController = async (req, res) => {
  try {
    const resturantDelete = req.params.id;
    // validation of resturant Id
    if (!resturantDelete) {
      return res.status(404).send({
        success: false,
        message: "Resturnat Not Found, Please Provide Resturant Id",
      });
    }
    const resturant = await restaurantModel.findByIdAndDelete(resturantDelete);
    res.status(200).send({
      success: true,
      message: "Resturant Deleted Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Delete Resturant API",
    });
  }
};

module.exports = {
  createResturantController,
  getAllResturantController,
  getResturantByIdController,
  deleteResturantController,
};
