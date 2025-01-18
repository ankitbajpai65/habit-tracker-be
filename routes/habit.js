const express = require("express");
const router = express.Router();
const { createHabit, fetchHabits } = require("../controllers/habit");
const verifyToken = require("../middleware/verifyToken");

router.get("/getAll", verifyToken, fetchHabits);
router.post("/create", verifyToken, createHabit);

module.exports = router;
