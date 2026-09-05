const Group = require("../models/Group");
const Expense = require("../models/Expense");

const calculateBalances = require("../algorithms/balanceCalculator");
const calculateSettlements = require("../algorithms/settlementCalculator");
const collectGroupExpenses = require("../algorithms/expenseTreeTraversal");

const getGroupSettlement = async (groupId) => {
  const group = await Group.findById(groupId).populate("members", "name email");

  if (!group) {
    throw new Error("Group not found");
  }

  // Get all groups in the database
  const groups = await Group.find();

  // Get all expenses in the database
  const expenses = await Expense.find().sort({ createdAt: 1 });

  // Convert MongoDB documents into the format expected by DFS
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

  // Use DFS to collect expenses from the requested group
  // and all of its child groups.
  const groupExpenses = collectGroupExpenses(
    groupId,
    algorithmGroups,
    algorithmExpenses,
  );

  // Calculate balances using expenses collected by DFS
  const balances = calculateBalances(groupExpenses);

  // Calculate minimum settlements using Max Heap + Greedy
  const settlements = calculateSettlements(balances);

  const balanceDetails = group.members.map((member) => {
    const userId = member._id.toString();

    const balance = balances.get(userId) || 0;

    return {
      userId,
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
    balances: balanceDetails,
    settlements: settlementDetails,
  };
};

module.exports = {
  getGroupSettlement,
};
