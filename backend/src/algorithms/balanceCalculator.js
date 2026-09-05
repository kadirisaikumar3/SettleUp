const calculateBalances = (expenses) => {
  const balances = new Map();

  for (const expense of expenses) {
    const { paidBy, amount, splitAmong } = expense;

    const share = amount / splitAmong.length;

    // Payer gets credited with the full amount
    balances.set(paidBy, (balances.get(paidBy) || 0) + amount);

    // Each participant owes their equal share
    for (const userId of splitAmong) {
      balances.set(userId, (balances.get(userId) || 0) - share);
    }
  }

  return balances;
};

module.exports = calculateBalances;
