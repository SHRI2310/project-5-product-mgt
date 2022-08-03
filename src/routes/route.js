const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const auth = require("../middlewares/auth")
const productController = require("../controllers/productController")
const cartController = require("../controllers/cartController")

// USER APIS
router.post("/register",userController.registerUser)
router.post("/login",userController.login)
router.get("/user/:userId/profile", auth.auth,userController.userProfile)
router.put("/user/:userId/profile", auth.auth,userController.updateUser)

router.post("/products",productController.createProduct)
router.get("/products",productController.getProduct)
router.get("/products/:productId",productController.getProductById)
router.put("/products/:productId",productController.updateProduct)
router.delete("/products/:productId",productController.deleteProduct)

// CART APIS
router.post("/users/:userId/cart",auth.auth,cartController.createCart)
router.get("/users/:userId/cart",auth.auth,cartController.getCart)
router.delete("/users/:userId/cart",auth.auth,cartController.deleteCart)

//INVALID ROUTES WILL BE HANDLED HERE
router.all("*", function (req, res) {
    res.status(404).send({ status: false, message: "you're on a wrong route" });
  });

module.exports = router