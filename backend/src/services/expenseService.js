const Expense = require("../models/Expense");
const Group = require("../models/Group");
const User = require("../models/User");

const createExpense = async ({ groupId, paidBy, amount, splitAmong }) => {
  if (!groupId) {
    throw new Error("Group ID is required");
  }

  if (!paidBy) {
    throw new Error("Payer is required");
  }

  if (!amount || amount <= 0) {
    throw new Error("Expense amount must be greater than zero");
  }

  if (!Array.isArray(splitAmong) || splitAmong.length === 0) {
    throw new Error("Expense must be split among at least one user");
  }

  const group = await Group.findById(groupId);

  if (!group) {
    throw new Error("Group not found");
  }

  const groupMemberIds = group.members.map((memberId) => memberId.toString());

  if (!groupMemberIds.includes(paidBy.toString())) {
    throw new Error("Payer must be a member of the group");
  }

  for (const userId of splitAmong) {
    if (!groupMemberIds.includes(userId.toString())) {
      throw new Error("All participants must be members of the group");
    }
  }

  const existingUsers = await User.find({
    _id: { $in: splitAmong },
  });

  if (existingUsers.length !== splitAmong.length) {
    throw new Error("One or more participants do not exist");
  }

  const expense = await Expense.create({
    groupId,
    paidBy,
    amount,
    splitAmong,
  });

  return expense;
};

const getGroupExpenses = async (groupId) => {
  const group = await Group.findById(groupId);

  if (!group) {
    throw new Error("Group not found");
  }

  return Expense.find({ groupId })
    .populate("paidBy", "name email")
    .populate("splitAmong", "name email")
    .sort({ createdAt: 1 });
};

module.exports = {
  createExpense,
  getGroupExpenses,
};
