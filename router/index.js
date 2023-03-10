const routes = require("express").Router()
const userRoute = require("./userRouter")

routes.use("/user",userRoute)

module.exports = routes