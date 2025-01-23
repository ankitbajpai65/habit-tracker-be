const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    habitName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    startDate: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    target: {
      quantity: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        required: true,
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    history: [
      {
        date: String,
        status: String,
        quantity: Number,
      },
    ],
  },
  { timestamps: true }
);

const HabitModel = mongoose.model("Habit", habitSchema);

module.exports = HabitModel;
