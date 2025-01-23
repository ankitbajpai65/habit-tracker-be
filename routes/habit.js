const express = require("express");
const router = express.Router();
const {
  createHabit,
  fetchHabits,
  editHabit,
  deleteHabit,
  getHabitById,
} = require("../controllers/habit");
const verifyToken = require("../middleware/verifyToken");

router.get("/getAll", verifyToken, fetchHabits);
router.get("/:id", verifyToken, getHabitById);
router.post("/create", verifyToken, createHabit);
router.patch("/edit/:id", verifyToken, editHabit);
router.delete("/delete/:id", verifyToken, deleteHabit);

module.exports = router;
