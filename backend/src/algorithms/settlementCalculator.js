const MaxHeap = require("./MaxHeap");

const calculateSettlements = (balances) => {
  const creditors = new MaxHeap();
  const debtors = new MaxHeap();

  for (const [userId, balance] of balances.entries()) {
    const roundedBalance = Math.round(balance * 100) / 100;

    if (roundedBalance > 0) {
      creditors.insert({
        userId,
        amount: roundedBalance,
      });
    } else if (roundedBalance < 0) {
      debtors.insert({
        userId,
        amount: Math.abs(roundedBalance),
      });
    }
  }

  const settlements = [];

  while (creditors.size > 0 && debtors.size > 0) {
    const creditor = creditors.extractMax();
    const debtor = debtors.extractMax();

    const settlementAmount =
      Math.round(Math.min(creditor.amount, debtor.amount) * 100) / 100;

    settlements.push({
      from: debtor.userId,
      to: creditor.userId,
      amount: settlementAmount,
    });

    creditor.amount =
      Math.round((creditor.amount - settlementAmount) * 100) / 100;

    debtor.amount = Math.round((debtor.amount - settlementAmount) * 100) / 100;

    if (creditor.amount > 0) {
      creditors.insert(creditor);
    }

    if (debtor.amount > 0) {
      debtors.insert(debtor);
    }
  }

  return settlements;
};

module.exports = calculateSettlements;
