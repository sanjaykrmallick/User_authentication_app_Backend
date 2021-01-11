const express = require("express")
const router = express.Router()

const expressJwt = require("express-jwt")

const checkJwt = expressJwt({ secret: process.env.SECRET }) // the JWT auth check middleware

const login = require("./auth")
const signup = require("./auth/signup")
const forgotpassword = require("./auth/password")
const users = require("./users")
const todos = require("./todos")

router.post("/login", login.post) // UNAUTHENTICATED
router.post("/signup", signup.post) // UNAUTHENTICATED
router.post("/forgotpassword", forgotpassword.startWorkflow) // UNAUTHENTICATED; AJAX
router.post("/resetpassword", forgotpassword.resetPassword) // UNAUTHENTICATED; AJAX

router.all("*", checkJwt) // use this auth middleware for ALL subsequent routes

router.get("/users", users.find)
router.get("/user/:id", users.get)
router.post("/user", users.post)
router.put("/user/:id", users.put)
router.delete("/user/:id", users.delete)

router.get("/todos", todos.find)
router.get("/todo/:id", todos.get)
router.post("/todo", todos.post)
router.put("/todo/:id", todos.put)
router.delete("/todo/:id", todos.delete)

module.exports = router
