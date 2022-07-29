const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const auth = require("../middlewares/auth")
const productController = require("../controllers/productController")

// USER APIS
router.post("/register",userController.registerUser)
router.post("/login",userController.login)
router.get("/user/:userId/profile", auth.auth,userController.userProfile)
router.put("/user/:userId/profile", auth.auth,userController.updateUser)

router.post("/products",productController.createProduct)
router.get("/products",productController.getProduct)
router.get("/products/:productId",productController.getProductById)

module.exports = router