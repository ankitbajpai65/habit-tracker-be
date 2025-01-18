const HabitModel = require("../schema/habit");

const fetchHabits = async (req, res) => {
  try {
    const habit = await HabitModel.find({});

    return res.status(200).json({
      status: "ok",
      data: habit.reverse(),
    });
  } catch (error) {
    console.log("Error in fetching habits:", error);
    return res.status(400).json({
      status: "error",
      error: error,
    });
  }
};

const createHabit = async (req, res) => {
  const { habitName, startDate, category, target } = req.body;
  const { user } = req;

  try {
    if (!habitName || !startDate || !category || !target) {
      return res.status(400).json({
        status: "error",
        error: "All fields are required!",
      });
    }
    const habit = await HabitModel.create({
      userId: user._id,
      habitName,
      startDate,
      category,
      target,
      history: [
        {
          date: Date.now(),
          status: "missed",
          quantity: 0,
        },
      ],
    });

    return res.status(201).json({
      status: "ok",
      error: "Habit is added!",
    });
  } catch (error) {
    console.log("Error in creating habit:", error);
    return res.status(400).json({
      status: "error",
      error: error,
    });
  }
};

module.exports = {
  fetchHabits,
  createHabit,
};
