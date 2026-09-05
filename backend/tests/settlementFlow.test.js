const calculateBalances = require("../src/algorithms/balanceCalculator");
const calculateSettlements = require("../src/algorithms/settlementCalculator");

describe("Complete Settlement Flow", () => {
  test("should calculate balances and minimum settlements", () => {
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

    expect(balances.get("Sai")).toBe(1500);
    expect(balances.get("Deepa")).toBe(0);
    expect(balances.get("Siri")).toBe(-1500);

    const settlements = calculateSettlements(balances);

    expect(settlements).toEqual([
      {
        from: "Siri",
        to: "Sai",
        amount: 1500,
      },
    ]);
  });

  test("should produce no settlements when balances are zero", () => {
    const expenses = [];

    const balances = calculateBalances(expenses);
    const settlements = calculateSettlements(balances);

    expect(settlements).toEqual([]);
  });
});
