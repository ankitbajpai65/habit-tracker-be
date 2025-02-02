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
    await HabitModel.create({
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
      streak: {
        current: 0,
        longest: 0,
      },
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

const updateHabit = async (req, res) => {
  const { id } = req.params;
  const { updatedQuantity } = req.body;

  try {
    if (!id) {
      return res.status(400).json({
        status: "error",
        error: "id is required!",
      });
    }

    const habit = await HabitModel.findById(id);

    if (!habit) {
      return res.status(404).json({
        status: "error",
        error: "Habit not found",
      });
    }

    const today = new Date().toLocaleDateString("en-CA");
    const todayEntry = habit.history.find((entry) => entry.date === today);

    if (todayEntry) {
      todayEntry.quantity = updatedQuantity;
      todayEntry.status =
        updatedQuantity >= habit.target.quantity ? "completed" : "incomplete";
    } else {
      habit.history.push({
        date: today,
        quantity: updatedQuantity,
        status:
          updatedQuantity >= habit.target.quantity ? "completed" : "incomplete",
      });
    }

    // Sort history by date
    habit.history.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Update Streaks
    let longestStreak = 0;
    let currentStreak = 0;
    let streak = 0;

    for (let i = 0; i < habit.history.length; i++) {
      const entry = habit.history[i];

      if (entry.status === "completed") {
        streak++;

        // Check if this is the last entry and if it's part of the current streak
        if (
          i === habit.history.length - 1 ||
          new Date(habit.history[i + 1]?.date).getTime() -
            new Date(entry.date).getTime() !==
            86400000
        ) {
          longestStreak = Math.max(longestStreak, streak);
          if (
            new Date(entry.date).getTime() >=
            new Date(today).getTime() - 86400000
          ) {
            currentStreak = streak;
          }
          streak = 0; // Reset streak if next date is not consecutive
        }
      } else {
        longestStreak = Math.max(longestStreak, streak);
        streak = 0;
      }
    }

    // Update habit object
    habit.streak.current = currentStreak;
    habit.streak.longest = longestStreak;

    // Save updated habit
    const updatedHabit = await habit.save();

    return res.status(200).json({
      status: "ok",
      message: "Habit updated successfully!",
      habit: updatedHabit,
    });
  } catch (error) {
    console.error("Error updating habit:", error);
    return res.status(500).json({
      status: "error",
      error: "Internal server error",
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
  updateHabit,
  deleteHabit,
};
