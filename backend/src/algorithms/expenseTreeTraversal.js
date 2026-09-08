const collectGroupExpenses = (groupId, groups, expenses) => {
  const groupExpenses = [];
  const visitedGroups = new Set();

  // Build a lookup map: parent group ID -> child groups
  const childrenByParent = new Map();

  for (const group of groups) {
    const parentKey =
      group.parentGroupId === null || group.parentGroupId === undefined
        ? null
        : String(group.parentGroupId);

    if (!childrenByParent.has(parentKey)) {
      childrenByParent.set(parentKey, []);
    }

    childrenByParent.get(parentKey).push(group);
  }

  // Build a lookup map: group ID -> expenses
  const expensesByGroup = new Map();

  for (const expense of expenses) {
    const groupKey = String(expense.groupId);

    if (!expensesByGroup.has(groupKey)) {
      expensesByGroup.set(groupKey, []);
    }

    expensesByGroup.get(groupKey).push(expense);
  }

  const collectExpensesDFS = (currentGroupId) => {
    const groupKey = String(currentGroupId);

    // Prevent infinite recursion if corrupted data contains a cycle
    if (visitedGroups.has(groupKey)) {
      return;
    }

    visitedGroups.add(groupKey);

    // Collect expenses belonging to the current group
    const currentExpenses = expensesByGroup.get(groupKey) || [];
    groupExpenses.push(...currentExpenses);

    // Get child groups directly from the lookup map
    const childGroups = childrenByParent.get(groupKey) || [];

    // DFS into each child group
    for (const childGroup of childGroups) {
      collectExpensesDFS(childGroup._id ?? childGroup.id);
    }
  };

  collectExpensesDFS(groupId);

  return groupExpenses;
};

module.exports = collectGroupExpenses;
