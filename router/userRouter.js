const routes = require("express").Router()
const usercontroller = require("../controller/userController")

routes.post("/signup",usercontroller.signUp)
routes.post("/signup/verify",usercontroller.verifyOtp)


module.exports = routes 