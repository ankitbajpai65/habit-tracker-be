const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.js/verifyToken");
const { createhabit } = require("../controllers/habit");

router.post("/create", createhabit);

module.exports = router;
