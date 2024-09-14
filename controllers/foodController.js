const restaurantModel = require("../models/restaurantModel");
const foodModel = require("../models/foodModel");
const orderModel = require("../models/orderModel");

/**
 * Controller for creating a new food item
 * @function createfoodController
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing food details
 * @param {string} req.body.title - Title of the food
 * @param {string} req.body.description - Description of the food
 * @param {number} req.body.price - Price of the food
 * @param {string} [req.body.imageUrl] - Image URL of the food (optional)
 * @param {Array<string>} [req.body.foodTags] - Tags associated with the food (optional)
 * @param {string} [req.body.category] - Category of the food (optional)
 * @param {string} [req.body.code] - Code of the food (optional)
 * @param {boolean} [req.body.isAvailable] - Availability status of the food (optional)
 * @param {string} req.body.restaurant - ID of the restaurant associated with the food
 * @param {number} [req.body.rating] - Rating of the food (optional)
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} - Returns a success message and the created food, or an error response if creation fails
 *
 * @description
 * This function creates a new food item, validates the input, saves the food to the database, and returns a success message with the food details.
 *
 * @throws Will return an error if required fields are missing or if an issue occurs while saving the food.
 */
// create food controller
const createfoodController = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      imageUrl,
      foodTags,
      category,
      code,
      isAvailable,
      restaurant,
      rating,
    } = req.body;
    if (!title || !description || !price || !restaurant) {
      return res.status(404).send({
        success: false,
        message: "Please provide all fields",
      });
    }

    const food = await foodModel.create({
      title,
      description,
      price,
      imageUrl,
      foodTags,
      category,
      code,
      isAvailable,
      restaurant,
      rating,
    });
    res.status(200).send({
      success: true,
      message: "Food created successfully",
      food,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in create food api",
      error,
    });
  }
};

/**
 * Controller for fetching all food items
 * @function getAllfoodController
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} - Returns a success message and the list of food items, or an error response if fetching fails
 *
 * @description
 * This function retrieves all food items from the database and returns them in the response.
 *
 * @throws Will return an error if no food items are found or if an issue occurs while fetching.
 */
const getAllfoodController = async (req, res) => {
  try {
    const foods = await foodModel.find();
    if (!foods) {
      return res.status(404).send({
        success: false,
        message: "No food found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Foods fetched successfully",
      foods,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get food api",
      error,
    });
  }
};

/**
 * Controller for fetching a single food item by ID
 * @function getSingleFoodController
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Food ID
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} - Returns a success message and the food item, or an error response if not found
 *
 * @description
 * This function fetches a single food item based on the provided food ID.
 *
 * @throws Will return an error if no food is found or if the ID is invalid.
 */

const getSingleFoodController = async (req, res) => {
  try {
    const foodid = req.params.id;
    if (!foodid) {
      return res.status(404).send({
        success: false,
        message: "Please provide valid food id",
      });
    }
    const food = await foodModel.findById(foodid);
    if (!food) {
      return res.status(404).send({
        success: false,
        message: "No food found with this id",
      });
    }

    res.status(200).send({
      success: true,
      message: "Food fetched successfully",
      food,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get food api",
      error,
    });
  }
};

/**
 * Controller for fetching food items by restaurant ID
 * @function getFoodbyRestaurantController
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Restaurant ID
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} - Returns a success message and the list of food items associated with the restaurant
 *
 * @description
 * This function fetches all food items associated with a specific restaurant ID.
 *
 * @throws Will return an error if no food is found or if the restaurant ID is invalid.
 */
const getFoodbyRestaurantController = async (req, res) => {
  try {
    const restaurantid = req.params.id;
    if (!restaurantid) {
      return res.status(404).send({
        success: false,
        message: "Please provide valid restaurant id",
      });
    }
    const food = await foodModel.find({ restaurant: restaurantid });
    if (!food) {
      return res.status(404).send({
        success: false,
        message: "No food found with this id",
      });
    }

    res.status(200).send({
      success: true,
      message: "Food based on restaurant fetched successfully",
      food,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get food api",
      error,
    });
  }
};

/**
 * Controller for updating a food item by ID
 * @function updateFoodController
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Food ID
 * @param {Object} req.body - Request body containing updated food details
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} - Returns a success message if the food is updated, or an error response if the update fails
 *
 * @description
 * This function updates a food item by its ID with the provided data.
 *
 * @throws Will return an error if no food is found or if the ID is invalid.
 */
// Update Food Controller

const updateFoodController = async (req, res) => {
  try {
    const foodid = req.params.id;
    if (!foodid) {
      return res.status(404).send({
        success: false,
        message: "Please provide valid food id",
      });
    }
    const food = await foodModel.findById(foodid);
    if (!food) {
      return res.status(404).send({
        success: false,
        message: "No food found with this id",
      });
    }
    const {
      title,
      description,
      price,
      imageUrl,
      foodTags,
      category,
      code,
      isAvailable,
      restaurant,
      rating,
    } = req.body;
    const updatedfood = await foodModel.findByIdAndUpdate(
      foodid,
      {
        title,
        description,
        price,
        imageUrl,
        foodTags,
        category,
        code,
        isAvailable,
        restaurant,
        rating,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Food updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update food api",
      error,
    });
  }
};

/**
 * Controller for deleting a food item by ID
 * @function deletefoodController
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Food ID
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} - Returns a success message if the food is deleted, or an error response if the deletion fails
 *
 * @description
 * This function deletes a food item by its ID.
 *
 * @throws Will return an error if no food is found or if the ID is invalid.
 */
// Delete food controller

const deletefoodController = async (req, res) => {
  try {
    const foodid = req.params.id;
    if (!foodid) {
      return res.status(404).send({
        success: false,
        message: "Please provide valid food id",
      });
    }
    const food = await foodModel.findById(foodid);
    if (!food) {
      return res.status(404).send({
        success: false,
        message: "No food found with this id",
      });
    }

    const deletefood = await foodModel.findByIdAndDelete(foodid);
    if (!food) {
      return res.status(404).send({
        success: false,
        message: "No food found with this id",
      });
    }
  } catch {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in delete food api",
      error,
    });
  }
};

/**
 * Controller for updating an order status by order ID
 * @function orderStatusController
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Order ID
 * @param {Object} req.body - Request body containing the new status
 * @param {string} req.body.status - New status of the order
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} - Returns a success message if the status is updated, or an error response if the update fails
 *
 * @description
 * This function updates the status of an order by its ID.
 *
 * @throws Will return an error if no order is found or if the ID is invalid.
 */
// Change order status
const orderStatusController = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res.status(404).send({
        success: false,
        message: "Please provide valid order id",
      });
    }
    const { status } = req.body;
    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Order Status Updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in order api",
      error,
    });
  }
};

/**
 * Controller for placing an order
 * @function placeOrderController
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing cart details
 * @param {Array<Object>} req.body.cart - List of food items in the cart
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} - Returns a success message and the new order, or an error response if placing the order fails
 *
 * @description
 * This function places an order, calculates the total payment, and stores the order in the database.
 *
 * @throws Will return an error if the cart is missing or if an issue occurs while placing the order.
 */
// Order Status controller
const placeOrderController = async (req, res) => {
  try {
    const { cart } = req.body;
    if (!cart) {
      return res.status(404).send({
        success: false,
        message: "Please provide cart and payment details",
      });
    }
    let total = 0;
    // calculate total
    cart.map((i) => {
      total = total + i.price;
    });
    const newOrder = await orderModel({
      foods: cart,
      payment: total,
      buyer: req.body.id,
    });
    await newOrder.save();
    res.status(200).send({
      success: true,
      message: "Order placed successfully",
      newOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in order api",
      error,
    });
  }
};

module.exports = {
  orderStatusController,
  createfoodController,
  getAllfoodController,
  getSingleFoodController,
  getFoodbyRestaurantController,
  updateFoodController,
  deletefoodController,
  placeOrderController,
};
