const calculateBalances = require("../src/algorithms/balanceCalculator");

describe("calculateBalances", () => {
  test("should calculate balances for an equal split", () => {
    const expenses = [
      {
        paidBy: "Sai",
        amount: 3000,
        splitAmong: ["Sai", "Deepa", "Siri"],
      },
    ];

    const balances = calculateBalances(expenses);

    expect(balances.get("Sai")).toBe(2000);
    expect(balances.get("Deepa")).toBe(-1000);
    expect(balances.get("Siri")).toBe(-1000);
  });

  test("total balance should always be zero", () => {
    const expenses = [
      {
        paidBy: "Sai",
        amount: 3000,
        splitAmong: ["Sai", "Deepa", "Siri"],
      },
      {
        paidBy: "Deepa",
        amount: 1500,
        splitAmong: ["Sai", "Deepa", "Siri"],
      },
    ];

    const balances = calculateBalances(expenses);

    const totalBalance = [...balances.values()].reduce(
      (sum, balance) => sum + balance,
      0,
    );

    expect(totalBalance).toBe(0);
  });
});
