const Group = require("../models/Group");
const Expense = require("../models/Expense");

const calculateBalances = require("../algorithms/balanceCalculator");
const calculateSettlements = require("../algorithms/settlementCalculator");
const collectGroupExpenses = require("../algorithms/expenseTreeTraversal");

const userHasGroupAccess = (group, userId) => {
  if (!group || !userId) return false;

  const userIdString = userId.toString();

  return (
    group.createdBy?.toString() === userIdString ||
    group.members.some((member) => member._id?.toString() === userIdString)
  );
};

const getGroupSettlement = async (groupId, userId) => {
  if (!userId) {
    throw new Error("User authentication is required");
  }

  const group = await Group.findById(groupId).populate("members", "name email");

  if (!group) {
    throw new Error("Group not found");
  }

  if (!userHasGroupAccess(group, userId)) {
    throw new Error("Access denied to this group");
  }

  const groups = await Group.find();
  const expenses = await Expense.find().sort({ createdAt: 1 });

  const algorithmGroups = groups.map((currentGroup) => ({
    id: currentGroup._id.toString(),
    parentGroupId: currentGroup.parentGroupId
      ? currentGroup.parentGroupId.toString()
      : null,
  }));

  const algorithmExpenses = expenses.map((expense) => ({
    id: expense._id.toString(),
    groupId: expense.groupId.toString(),
    paidBy: expense.paidBy.toString(),
    amount: expense.amount,
    splitAmong: expense.splitAmong.map((userId) => userId.toString()),
  }));

  const groupExpenses = collectGroupExpenses(
    groupId,
    algorithmGroups,
    algorithmExpenses,
  );

  const totalExpense =
    Math.round(
      groupExpenses.reduce((total, expense) => total + expense.amount, 0) * 100,
    ) / 100;

  const balances = calculateBalances(groupExpenses);

  const settlements = calculateSettlements(balances);

  const balanceDetails = group.members.map((member) => {
    const memberId = member._id.toString();
    const balance = balances.get(memberId) || 0;

    return {
      userId: memberId,
      name: member.name,
      email: member.email,
      balance: Math.round(balance * 100) / 100,
    };
  });

  const settlementDetails = settlements.map((settlement) => {
    const fromUser = group.members.find(
      (member) => member._id.toString() === settlement.from,
    );

    const toUser = group.members.find(
      (member) => member._id.toString() === settlement.to,
    );

    return {
      from: {
        userId: settlement.from,
        name: fromUser ? fromUser.name : "Unknown User",
      },
      to: {
        userId: settlement.to,
        name: toUser ? toUser.name : "Unknown User",
      },
      amount: settlement.amount,
    };
  });

  return {
    group: {
      id: group._id,
      name: group.name,
    },
    totalExpense,
    balances: balanceDetails,
    settlements: settlementDetails,
  };
};

const getGroupBalances = async (groupId, userId) => {
  if (!userId) {
    throw new Error("User authentication is required");
  }

  const group = await Group.findById(groupId).populate("members", "name email");

  if (!group) {
    throw new Error("Group not found");
  }

  if (!userHasGroupAccess(group, userId)) {
    throw new Error("Access denied to this group");
  }

  const groups = await Group.find();
  const expenses = await Expense.find().sort({ createdAt: 1 });

  const algorithmGroups = groups.map((currentGroup) => ({
    id: currentGroup._id.toString(),
    parentGroupId: currentGroup.parentGroupId
      ? currentGroup.parentGroupId.toString()
      : null,
  }));

  const algorithmExpenses = expenses.map((expense) => ({
    id: expense._id.toString(),
    groupId: expense.groupId.toString(),
    paidBy: expense.paidBy.toString(),
    amount: expense.amount,
    splitAmong: expense.splitAmong.map((userId) => userId.toString()),
  }));

  const groupExpenses = collectGroupExpenses(
    groupId,
    algorithmGroups,
    algorithmExpenses,
  );

  const balances = calculateBalances(groupExpenses);

  return group.members.map((member) => {
    const memberId = member._id.toString();

    return {
      userId: memberId,
      name: member.name,
      email: member.email,
      balance: Math.round((balances.get(memberId) || 0) * 100) / 100,
    };
  });
};

module.exports = {
  getGroupSettlement,
  getGroupBalances,
};
