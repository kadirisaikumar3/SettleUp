const expenseService = require("../services/expenseService");

const createExpense = async (req, res) => {
  try {
    const { groupId, paidBy, description, amount, splitAmong } = req.body;

    const expense = await expenseService.createExpense({
      groupId,
      paidBy,
      description,
      amount,
      splitAmong,
    });

    res.status(201).json({
      status: "success",
      message: "Expense created successfully",
      data: expense,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const getGroupExpenses = async (req, res) => {
  try {
    const expenses = await expenseService.getGroupExpenses(req.params.groupId);

    res.status(200).json({
      status: "success",
      data: expenses,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { groupId, paidBy, description, amount, splitAmong } = req.body;

    const expense = await expenseService.updateExpense(req.params.id, {
      groupId,
      paidBy,
      description,
      amount,
      splitAmong,
    });

    res.status(200).json({
      status: "success",
      message: "Expense updated successfully",
      data: expense,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const result = await expenseService.deleteExpense(req.params.id);

    res.status(200).json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  createExpense,
  getGroupExpenses,
  updateExpense,
  deleteExpense,
};
