const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    habitName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    category: {
      type: String,
      required: true,
      unique: true,
      maxlength: 255,
    },
    target: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const HabitModel = mongoose.model("Habit", habitSchema);

module.exports = HabitModel;
