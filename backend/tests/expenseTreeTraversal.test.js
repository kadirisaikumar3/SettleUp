const collectGroupExpenses = require("../src/algorithms/expenseTreeTraversal");

describe("collectGroupExpenses", () => {
  test("should collect expenses from a group and all nested child groups", () => {
    const groups = [
      { id: "trip", parentGroupId: null },
      { id: "sightseeing", parentGroupId: "trip" },
      { id: "food", parentGroupId: "trip" },
      { id: "mysore-palace", parentGroupId: "sightseeing" },
      { id: "halebeedu", parentGroupId: "sightseeing" },
      { id: "restaurant", parentGroupId: "food" },
    ];

    const expenses = [
      { id: "expense1", groupId: "trip", amount: 1000 },
      { id: "expense2", groupId: "sightseeing", amount: 500 },
      { id: "expense3", groupId: "mysore-palace", amount: 900 },
      { id: "expense4", groupId: "halebeedu", amount: 700 },
      { id: "expense5", groupId: "food", amount: 800 },
      { id: "expense6", groupId: "restaurant", amount: 600 },
    ];

    const result = collectGroupExpenses("trip", groups, expenses);

    expect(result).toHaveLength(6);

    expect(result.map((expense) => expense.id)).toEqual([
      "expense1",
      "expense2",
      "expense3",
      "expense4",
      "expense5",
      "expense6",
    ]);
  });

  test("should collect only the selected subtree", () => {
    const groups = [
      { id: "trip", parentGroupId: null },
      { id: "sightseeing", parentGroupId: "trip" },
      { id: "food", parentGroupId: "trip" },
      { id: "mysore-palace", parentGroupId: "sightseeing" },
      { id: "restaurant", parentGroupId: "food" },
    ];

    const expenses = [
      { id: "expense1", groupId: "trip", amount: 1000 },
      { id: "expense2", groupId: "mysore-palace", amount: 900 },
      { id: "expense3", groupId: "restaurant", amount: 800 },
    ];

    const result = collectGroupExpenses("sightseeing", groups, expenses);

    expect(result).toHaveLength(1);

    expect(result.map((expense) => expense.id)).toEqual(["expense2"]);
  });

  test("should collect expenses from multiple levels of nesting", () => {
    const groups = [
      { id: "root", parentGroupId: null },
      { id: "level1", parentGroupId: "root" },
      { id: "level2", parentGroupId: "level1" },
      { id: "level3", parentGroupId: "level2" },
    ];

    const expenses = [
      { id: "expense1", groupId: "root", amount: 100 },
      { id: "expense2", groupId: "level1", amount: 200 },
      { id: "expense3", groupId: "level2", amount: 300 },
      { id: "expense4", groupId: "level3", amount: 400 },
    ];

    const result = collectGroupExpenses("root", groups, expenses);

    expect(result).toHaveLength(4);
  });

  test("should return an empty array when the group has no expenses", () => {
    const groups = [
      { id: "trip", parentGroupId: null },
      { id: "food", parentGroupId: "trip" },
    ];

    const expenses = [];

    const result = collectGroupExpenses("trip", groups, expenses);

    expect(result).toEqual([]);
  });

  test("should stop safely when the group hierarchy contains a cycle", () => {
    const groups = [
      { id: "group-a", parentGroupId: "group-c" },
      { id: "group-b", parentGroupId: "group-a" },
      { id: "group-c", parentGroupId: "group-b" },
    ];

    const expenses = [
      { id: "expense1", groupId: "group-a", amount: 100 },
      { id: "expense2", groupId: "group-b", amount: 200 },
      { id: "expense3", groupId: "group-c", amount: 300 },
    ];

    const result = collectGroupExpenses("group-a", groups, expenses);

    expect(result).toHaveLength(3);

    expect(result.map((expense) => expense.id)).toEqual([
      "expense1",
      "expense2",
      "expense3",
    ]);
  });
});
