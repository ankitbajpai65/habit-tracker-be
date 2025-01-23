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

const getHabitById = async (req, res) => {
  try {
    const { id } = req.params;
    const habit = await HabitModel.find({ _id: id });
    if (!habit) {
      return res.status(404).json({
        status: "error",
        message: "Habit not found.",
      });
    }

    return res.status(200).json({
      status: "ok",
      data: habit[0],
    });
  } catch (error) {
    console.log("Error in fetching habit:", error);
    return res.status(404).json({
      status: "error",
      message: "Habit not found.",
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
          date: startDate,
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

const editHabit = async (req, res) => {
  const habitId = req.params.id;
  const { habitName, startDate, category, target } = req.body;
  const { user } = req;

  try {
    if (!habitName || !startDate || !category || !target) {
      return res.status(400).json({
        status: "error",
        error: "All fields are required!",
      });
    }
    const habit = await HabitModel.findById(habitId);
    const updatedHabit = await HabitModel.findByIdAndUpdate(
      habitId,
      {
        $set: {
          habitName,
          startDate,
          category,
          target,
          history: habit.history,
        },
      },
      { new: true }
    );

    if (!updatedHabit) {
      return res.status(404).json({
        status: "error",
        error: "Habit not found",
      });
    }

    return res.status(200).json({
      status: "ok",
      message: "Habit updated successfully!",
    });
  } catch (error) {
    // console.log("Error in editing habit:", error);
    return res.status(400).json({
      status: "error",
      error: error,
    });
  }
};

const deleteHabit = async (req, res) => {
  const habitId = req.params.id;

  try {
    if (!habitId) {
      return res.status(400).json({
        status: "error",
        error: "Habit id is required",
      });
    }

    await HabitModel.findByIdAndDelete({ _id: habitId });

    return res.status(200).json({
      status: "ok",
      message: "Habit deleted successfully!",
    });
  } catch (error) {
    console.log("Error in deleting habit:", error);
    return res.status(400).json({
      status: "error",
      error: error,
    });
  }
};

module.exports = {
  fetchHabits,
  getHabitById,
  createHabit,
  editHabit,
  deleteHabit,
};
