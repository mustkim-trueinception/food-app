const express = require("express");
const router = express.Router();
const { 
    orderStatusController, 
    createfoodController, 
    getAllfoodController, 
    getSingleFoodController, 
    getFoodbyRestaurantController, 
    updateFoodController,
    deletefoodController,
    placeOrderController} = require("../controllers/foodController");
const  {authMiddleware} = require("../middlewares/authMiddleware");
const adminMiddlewere = require("../middlewares/adminMiddlewere");


// Food Create Route !! Post
router.post("/create",adminMiddlewere,createfoodController);

// Food Get Route !! Get
router.get("/getall",getAllfoodController);

// get Food by ID
router.get("/get/:id",getSingleFoodController);


// get Food by restaurant ID
router.get("/getbyrestaurant/:id",getFoodbyRestaurantController);

// update food
router.put("/update/:id",adminMiddlewere,updateFoodController);


// Delete food Item
router.delete("/delete/:id",adminMiddlewere,deletefoodController);


// Placed Order route
router.post("/placeorder",authMiddleware,placeOrderController);

// ORDER STATUS

router.post("/status/:id",authMiddleware,orderStatusController);



module.exports = router