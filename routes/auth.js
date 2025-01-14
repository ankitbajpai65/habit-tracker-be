const express = require("express");
const router = express.Router();
const { handleUserSignup, handleUserLogin, handleUserLogout, getUserDetails } = require("../controllers/auth");
const verifyToken = require("../middleware/auth.js/verifyToken");

router.post("/signup", handleUserSignup);
router.post("/login", handleUserLogin);
router.post("/logout", handleUserLogout);
router.get("/userDetails",verifyToken, getUserDetails);

module.exports = router;
