const express = require("express");

const {
  createExpense,
  getGroupExpenses,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

const router = express.Router();

router.post("/", createExpense);

router.get("/group/:groupId", getGroupExpenses);

router.put("/:id", updateExpense);

router.delete("/:id", deleteExpense);

module.exports = router;
