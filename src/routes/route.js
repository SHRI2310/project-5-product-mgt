const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const auth = require("../middlewares/auth")


router.post("/register",userController.registerUser)
router.post("/login",userController.login)
router.get("/user/:userId/profile", auth.auth,userController.userProfile)
router.put("/user/:userId/profile", auth.auth,userController.updateUser)


module.exports = router