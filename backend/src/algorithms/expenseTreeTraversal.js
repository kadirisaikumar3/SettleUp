const collectGroupExpenses = (groupId, groups, expenses) => {
  const groupExpenses = [];

  const collectExpensesDFS = (currentGroupId) => {
    // Collect expenses belonging to the current group
    for (const expense of expenses) {
      if (expense.groupId === currentGroupId) {
        groupExpenses.push(expense);
      }
    }

    // Find child groups
    const childGroups = groups.filter(
      (group) => group.parentGroupId === currentGroupId,
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
