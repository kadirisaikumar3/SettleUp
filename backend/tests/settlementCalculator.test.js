const calculateSettlements = require("../src/algorithms/settlementCalculator");

describe("calculateSettlements", () => {
  test("should settle a simple three-person debt", () => {
    const balances = new Map([
      ["Sai", 2000],
      ["Deepa", -1000],
      ["Siri", -1000],
    ]);

    const settlements = calculateSettlements(balances);

    expect(settlements).toEqual([
      {
        from: "Deepa",
        to: "Sai",
        amount: 1000,
      },
      {
        from: "Siri",
        to: "Sai",
        amount: 1000,
      },
    ]);
  });

  test("should settle multiple creditors and debtors", () => {
    const balances = new Map([
      ["Sai", 3000],
      ["Deepa", 1000],
      ["Siri", -2500],
      ["Kumar", -1500],
    ]);

    const settlements = calculateSettlements(balances);

    expect(settlements).toHaveLength(3);

    const totalSettled = settlements.reduce(
      (sum, settlement) => sum + settlement.amount,
      0,
    );

    expect(totalSettled).toBe(4000);
  });

  test("should return empty array when everyone is settled", () => {
    const balances = new Map([
      ["Sai", 0],
      ["Deepa", 0],
      ["Siri", 0],
    ]);

    const settlements = calculateSettlements(balances);

    expect(settlements).toEqual([]);
  });

  test("should handle decimal amounts correctly", () => {
    const balances = new Map([
      ["Sai", 100.5],
      ["Deepa", -33.5],
      ["Siri", -67],
    ]);

    const settlements = calculateSettlements(balances);

    expect(settlements).toHaveLength(2);

    const totalSettled = settlements.reduce(
      (sum, settlement) => sum + settlement.amount,
      0,
    );

    expect(totalSettled).toBe(100.5);
  });

  test("should preserve the balance of every user after applying settlements", () => {
    const balances = new Map([
      ["Sai", 1400],
      ["Deepa", 50],
      ["Siri", -1450],
    ]);

    const settlements = calculateSettlements(balances);

    const finalBalances = new Map(balances);

    for (const settlement of settlements) {
      finalBalances.set(
        settlement.from,
        finalBalances.get(settlement.from) + settlement.amount,
      );

      finalBalances.set(
        settlement.to,
        finalBalances.get(settlement.to) - settlement.amount,
      );
    }

    for (const balance of finalBalances.values()) {
      expect(Math.abs(balance)).toBeLessThanOrEqual(0.01);
    }
  });
});
