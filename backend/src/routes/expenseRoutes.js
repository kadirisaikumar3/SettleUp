const express = require("express");

const {
  createExpense,
  getGroupExpenses,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticate);

router.post("/", createExpense);

router.get("/group/:groupId", getGroupExpenses);

router.put("/:id", updateExpense);

router.delete("/:id", deleteExpense);

module.exports = router;
