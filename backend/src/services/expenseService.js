const Expense = require("../models/Expense");
const Group = require("../models/Group");
const User = require("../models/User");

const userHasGroupAccess = (group, userId) => {
  if (!group || !userId) {
    return false;
  }

  const userIdString = userId.toString();

  return (
    group.createdBy?.toString() === userIdString ||
    group.members.some((memberId) => memberId.toString() === userIdString)
  );
};

const createExpense = async ({
  groupId,
  paidBy,
  description,
  amount,
  splitAmong,
  userId,
}) => {
  if (!groupId) {
    throw new Error("Group ID is required");
  }

  if (!userId) {
    throw new Error("User authentication is required");
  }

  if (!paidBy) {
    throw new Error("Payer is required");
  }

  if (!description || !description.trim()) {
    throw new Error("Expense description is required");
  }

  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    throw new Error("Expense amount must be a valid number greater than zero");
  }

  if (!Array.isArray(splitAmong) || splitAmong.length === 0) {
    throw new Error("Expense must be split among at least one user");
  }

  if (
    new Set(splitAmong.map((userId) => userId.toString())).size !==
    splitAmong.length
  ) {
    throw new Error("Expense participants cannot contain duplicates");
  }

  const group = await Group.findById(groupId);

  if (!group) {
    throw new Error("Group not found");
  }

  if (!userHasGroupAccess(group, userId)) {
    throw new Error("Access denied to this group");
  }

  const groupMemberIds = group.members.map((memberId) => memberId.toString());

  if (!groupMemberIds.includes(paidBy.toString())) {
    throw new Error("Payer must be a member of the group");
  }

  for (const participantId of splitAmong) {
    if (!groupMemberIds.includes(participantId.toString())) {
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
    description: description.trim(),
    amount,
    splitAmong,
  });

  return expense;
};

const getGroupExpenses = async (groupId, userId) => {
  if (!userId) {
    throw new Error("User authentication is required");
  }

  const group = await Group.findById(groupId);

  if (!group) {
    throw new Error("Group not found");
  }

  if (!userHasGroupAccess(group, userId)) {
    throw new Error("Access denied to this group");
  }

  return Expense.find({ groupId })
    .populate("paidBy", "name email")
    .populate("splitAmong", "name email")
    .sort({ createdAt: 1 });
};

const updateExpense = async (
  expenseId,
  { groupId, paidBy, description, amount, splitAmong },
  userId,
) => {
  if (!groupId) {
    throw new Error("Group ID is required");
  }

  if (!userId) {
    throw new Error("User authentication is required");
  }

  if (!paidBy) {
    throw new Error("Payer is required");
  }

  if (!description || !description.trim()) {
    throw new Error("Expense description is required");
  }

  if (
    typeof amount !== "number" ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    throw new Error("Expense amount must be a valid number greater than zero");
  }

  if (!Array.isArray(splitAmong) || splitAmong.length === 0) {
    throw new Error("Expense must be split among at least one user");
  }

  if (
    new Set(splitAmong.map((userId) => userId.toString())).size !==
    splitAmong.length
  ) {
    throw new Error("Expense participants cannot contain duplicates");
  }

  const expense = await Expense.findById(expenseId);

  if (!expense) {
    throw new Error("Expense not found");
  }

  if (expense.groupId.toString() !== groupId.toString()) {
    throw new Error("Expense does not belong to the specified group");
  }

  const group = await Group.findById(groupId);

  if (!group) {
    throw new Error("Group not found");
  }

  if (!userHasGroupAccess(group, userId)) {
    throw new Error("Access denied to this group");
  }

  const groupMemberIds = group.members.map((memberId) => memberId.toString());

  if (!groupMemberIds.includes(paidBy.toString())) {
    throw new Error("Payer must be a member of the group");
  }

  for (const participantId of splitAmong) {
    if (!groupMemberIds.includes(participantId.toString())) {
      throw new Error("All participants must be members of the group");
    }
  }

  const existingUsers = await User.find({
    _id: { $in: splitAmong },
  });

  if (existingUsers.length !== splitAmong.length) {
    throw new Error("One or more participants do not exist");
  }

  expense.paidBy = paidBy;
  expense.description = description.trim();
  expense.amount = amount;
  expense.splitAmong = splitAmong;

  await expense.save();

  return expense;
};

const deleteExpense = async (expenseId, userId) => {
  if (!userId) {
    throw new Error("User authentication is required");
  }

  const expense = await Expense.findById(expenseId);

  if (!expense) {
    throw new Error("Expense not found");
  }

  const group = await Group.findById(expense.groupId);

  if (!group) {
    throw new Error("Group not found");
  }

  if (!userHasGroupAccess(group, userId)) {
    throw new Error("Access denied to this group");
  }

  await Expense.findByIdAndDelete(expenseId);

  return {
    message: "Expense deleted successfully",
  };
};

module.exports = {
  createExpense,
  getGroupExpenses,
  updateExpense,
  deleteExpense,
};