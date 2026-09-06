const express = require("express");

const {
  createGroup,
  getAllGroups,
  getGroupById,
  updateGroupMembers,
  updateGroup,
  deleteGroup,
} = require("../controllers/groupController");

const {
  createExpense,
  getGroupExpenses,
} = require("../controllers/expenseController");

const {
  getGroupSettlement,
  getGroupBalances,
} = require("../controllers/settlementController");

const router = express.Router();

router.post("/", createGroup);

router.get("/", getAllGroups);

router.put("/:id/members", updateGroupMembers);

router.put("/:id", updateGroup);

router.delete("/:id", deleteGroup);

router.post("/:id/expenses", (req, res) => {
  req.body.groupId = req.params.id;
  createExpense(req, res);
});

router.get("/:id/expenses", (req, res) => {
  req.params.groupId = req.params.id;
  getGroupExpenses(req, res);
});

router.get("/:id/balances", (req, res) => {
  req.params.groupId = req.params.id;
  getGroupBalances(req, res);
});

router.get("/:id/settlement", (req, res) => {
  req.params.groupId = req.params.id;
  getGroupSettlement(req, res);
});

router.get("/:id", getGroupById);

module.exports = router;
