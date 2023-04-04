const express = require("express");
const isAuthenticated = require("../middlewares/auth");
const { register, login, getMyProfile, logout } = require("../controller/userController");
const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.get("/logout",logout)

router.get("/me", isAuthenticated, getMyProfile)

// if you have same end point hence use route() function;

// router
//     .route("/userid/:id")
//     .get(getUserById)
// .put(updateUser)
// .delete(deleteUser)

// router.get("/userid/:id", getUserById)
// router.put("/userid/:id", updateUser)
// router.delete("/userid/:id", deleteUser)

module.exports = router;