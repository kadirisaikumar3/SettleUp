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

  test("should settle multiple creditors and debtors correctly", () => {
    const expenses = [
      {
        paidBy: "Sai",
        amount: 600,
        splitAmong: ["Sai", "Deepa", "Siri", "Kumar"],
      },
      {
        paidBy: "Deepa",
        amount: 400,
        splitAmong: ["Sai", "Deepa", "Siri", "Kumar"],
      },
    ];

    const balances = calculateBalances(expenses);

    expect(balances.get("Sai")).toBe(350);
    expect(balances.get("Deepa")).toBe(150);
    expect(balances.get("Siri")).toBe(-250);
    expect(balances.get("Kumar")).toBe(-250);

    const settlements = calculateSettlements(balances);

    expect(settlements).toEqual([
      {
        from: "Siri",
        to: "Sai",
        amount: 250,
      },
      {
        from: "Kumar",
        to: "Deepa",
        amount: 150,
      },
      {
        from: "Kumar",
        to: "Sai",
        amount: 100,
      },
    ]);
  });
});
