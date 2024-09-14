const categoryModel = require("../models/categoryModel");
const route = require("../routes/categoryRoute");

/**
 * Controller for creating a new category
 * @function createCatergoryController
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing category details
 * @param {string} req.body.title - Category title
 * @param {string} [req.body.imageUrl] - Category image URL (optional)
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} - Returns a success message and the created category, or an error response if the creation fails
 *
 * @description
 * This function creates a new category by validating the input, saving the category to the database,
 * and returning a success message along with the created category details.
 *
 * @throws Will return an error if the title is missing or if any issue occurs while saving the category.
 */
// create category controller route model
const createCatergoryController = async (req, res) => {
  try {
    const { title, imageUrl } = req.body;
    // validation
    if (!title) {
      return res.status(500).send({
        success: false,
        message: "Please Provide title",
      });
    }
    // create new category
    const newCategory = new categoryModel({ title, imageUrl });
    await newCategory.save();
    res.status(200).send({
      success: true,
      message: "Category Created Successfully",
      newCategory,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while creating catergory",
      error,
    });
  }
};

/**
 * Controller for getting all categories
 * @function getAllCatController
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} - Returns a success message, the total number of categories, and the list of categories, or an error if none are found
 *
 * @description
 * This function retrieves all categories from the database and returns them in the response.
 *
 * @throws Will return an error if no categories are found or if an issue occurs while fetching the categories.
 */
// GET ALL CATEGORY ROUTE | GET
const getAllCatController = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    // validation
    if (!categories) {
      return res.status(404).send({
        success: false,
        message: "No category found",
      });
    }
    res.status(200).send({
      success: true,
      totalCategories: categories.length,
      message: "Categories found successfully",
      categories,
    });
  } catch (error) {
    res.status(500).send({
      success: true,
      message: "Error in Get Category API",
      error,
    });
  }
};

/**
 * Controller for updating a category
 * @function updateCatController
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Category ID
 * @param {Object} req.body - Request body containing category update details
 * @param {string} [req.body.title] - Updated title (optional)
 * @param {string} [req.body.imageUrl] - Updated image URL (optional)
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} - Returns a success message if the category is updated, or an error response if the update fails
 *
 * @description
 * This function updates a category based on the provided category ID, title, and imageUrl. It saves the updated category in the database.
 *
 * @throws Will return an error if the category ID is invalid or if no category is found.
 */
// UPDATE CATEGORY ROUTE | PUT
const updateCatController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, imageUrl } = req.body;
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      { title, imageUrl },
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).send({
        success: false,
        message: "No category found with this Id",
      });
    }
    res.status(200).send({
      success: true,
      message: "Category Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating category",
      error,
    });
  }
};

/**
 * Controller for deleting a category
 * @function deleteCatController
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Category ID to delete
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} - Returns a success message if the category is deleted, or an error response if the deletion fails
 *
 * @description
 * This function deletes a category from the database by its ID. It checks if the category exists before performing the deletion.
 *
 * @throws Will return an error if the category ID is not provided, or if no category is found with the given ID.
 */
const deleteCatController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "Id is required",
      });
    }
    const category = await categoryModel.find({ id });
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category Not Found",
      });
    }
    await categoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Category Deleted Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Deleting Category",
    });
  }
};

module.exports = {
  createCatergoryController,
  getAllCatController,
  updateCatController,
  deleteCatController,
};
