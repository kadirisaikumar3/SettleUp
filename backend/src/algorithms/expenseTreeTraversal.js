const collectGroupExpenses = (groupId, groups, expenses) => {
  const groupExpenses = [];
  const visitedGroups = new Set();

  const collectExpensesDFS = (currentGroupId) => {
    const groupKey = String(currentGroupId);

    // Prevent infinite recursion if corrupted data contains a cycle
    if (visitedGroups.has(groupKey)) {
      return;
    }

    visitedGroups.add(groupKey);

    // Collect expenses belonging to the current group
    for (const expense of expenses) {
      if (String(expense.groupId) === groupKey) {
        groupExpenses.push(expense);
      }
    }

    // Find child groups
    const childGroups = groups.filter(
      (group) => String(group.parentGroupId) === groupKey,
    );

    // DFS into each child group
    for (const childGroup of childGroups) {
      collectExpensesDFS(childGroup.id);
    }
  };

  collectExpensesDFS(groupId);

  return groupExpenses;
};

module.exports = collectGroupExpenses;
