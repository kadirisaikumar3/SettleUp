import { useEffect, useState } from "react";
import {
  getGroups,
  getGroupSettlement,
  getGroupExpenses,
  getGroupBalances,
  getUsers,
  createExpense,
} from "./services/api";
import "./App.css";

function App() {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const [settlement, setSettlement] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState(null);

  const [users, setUsers] = useState([]);

  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const [expenseForm, setExpenseForm] = useState({
    description: "",
    amount: "",
    paidBy: "",
    splitAmong: [],
  });

  const [expenseSubmitting, setExpenseSubmitting] = useState(false);
  const [expenseSuccess, setExpenseSuccess] = useState("");
  const [expenseError, setExpenseError] = useState("");

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [error, setError] = useState("");

  // --------------------------------------------------
  // Load all groups
  // --------------------------------------------------
  useEffect(() => {
    const loadGroups = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getGroups();
        const fetchedGroups = response.data || [];

        setGroups(fetchedGroups);

        // Select the first group that has members
        const firstActiveGroup = fetchedGroups.find(
          (group) => group.members && group.members.length > 0,
        );

        if (firstActiveGroup) {
          setSelectedGroupId(firstActiveGroup._id);
        }
      } catch (err) {
        setError(err.message || "Failed to load groups");
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data || []);
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    };

    loadUsers();
  }, []);

  // --------------------------------------------------
  // Root groups
  // --------------------------------------------------
  const rootGroups = groups.filter((group) => group.parentGroupId === null);

  // --------------------------------------------------
  // Currently selected group
  // --------------------------------------------------
  const selectedGroup = groups.find((group) => group._id === selectedGroupId);

  // --------------------------------------------------
  // Load selected group details
  // --------------------------------------------------
  useEffect(() => {
    if (!selectedGroupId) {
      return;
    }

    const loadGroupDetails = async () => {
      try {
        setDetailsLoading(true);
        setError("");

        const [settlementResponse, expenseResponse, balanceResponse] =
          await Promise.all([
            getGroupSettlement(selectedGroupId),
            getGroupExpenses(selectedGroupId),
            getGroupBalances(selectedGroupId),
          ]);

        setSettlement(settlementResponse.data);
        setExpenses(expenseResponse.data || []);
        setBalances(balanceResponse.data);
      } catch (err) {
        setError(err.message || "Failed to load group details");
      } finally {
        setDetailsLoading(false);
      }
    };

    loadGroupDetails();
  }, [selectedGroupId]);

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------
  const handleGroupSelect = (groupId) => {
    if (groupId === selectedGroupId) {
      return;
    }

    setSelectedGroupId(groupId);
  };

  const formatAmount = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  const getPersonName = (person) => {
    if (typeof person === "string") {
      return person;
    }

    if (person?.name) {
      return person.name;
    }

    if (person?._id) {
      return person._id;
    }

    return "Unknown";
  };

  const getBalanceForUser = (userName) => {
    if (!Array.isArray(balances)) {
      return 0;
    }

    const userBalance = balances.find((balance) => balance.name === userName);

    return userBalance?.balance || 0;
  };

  const saiBalance = getBalanceForUser("Sai");

  const handleAddExpense = async () => {
    setExpenseError("");
    setExpenseSuccess("");

    if (!selectedGroupId) {
      setExpenseError("Please select a group.");
      return;
    }

    if (!expenseForm.description.trim()) {
      setExpenseError("Please enter a description.");
      return;
    }

    if (!expenseForm.amount || Number(expenseForm.amount) <= 0) {
      setExpenseError("Please enter a valid amount.");
      return;
    }

    if (!expenseForm.paidBy) {
      setExpenseError("Please select who paid.");
      return;
    }

    if (expenseForm.splitAmong.length === 0) {
      setExpenseError(
        "Please select at least one person to split the expense.",
      );
      return;
    }

    try {
      setExpenseSubmitting(true);

      await createExpense({
        groupId: selectedGroupId,
        paidBy: expenseForm.paidBy,
        description: expenseForm.description.trim(),
        amount: Number(expenseForm.amount),
        splitAmong: expenseForm.splitAmong,
      });

      setExpenseSuccess("Expense added successfully.");

      setExpenseForm({
        description: "",
        amount: "",
        paidBy: "",
        splitAmong: [],
      });

      const [settlementResponse, expenseResponse, balanceResponse] =
        await Promise.all([
          getGroupSettlement(selectedGroupId),
          getGroupExpenses(selectedGroupId),
          getGroupBalances(selectedGroupId),
        ]);

      setSettlement(settlementResponse.data);
      setExpenses(expenseResponse.data || []);
      setBalances(balanceResponse.data);
    } catch (err) {
      setExpenseError(err.message || "Failed to add expense.");
    } finally {
      setExpenseSubmitting(false);
    }
  };

  // --------------------------------------------------
  // Loading state
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-card">
          <div className="loading-logo">S</div>
          <h2>Loading SettleUp...</h2>
          <p>Connecting to your expense engine.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* ==================================================
          NAVBAR
      ================================================== */}
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="brand-mark">S</div>

          <span>SettleUp</span>
        </div>

        <div className="navbar-links">
          <a href="#dashboard">Dashboard</a>
          <a href="#groups">Groups</a>
          <a href="#settlements">Settlements</a>
        </div>

        <div className="navbar-profile">
          <div className="profile-avatar">S</div>
          <span>Sai</span>
        </div>
      </nav>

      {/* ==================================================
          ERROR
      ================================================== */}
      {error && (
        <div className="error-banner">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* ==================================================
          HERO
      ================================================== */}
      <main id="dashboard">
        <section className="hero-section">
          <div className="hero-content">
            <span className="eyebrow">GROUP EXPENSE ENGINE</span>

            <h1>
              Manage expenses.
              <br />
              <span>Settle smarter.</span>
            </h1>

            <p>
              SettleUp uses graph algorithms, tree traversal, heaps and greedy
              optimization to minimize group debt transactions.
            </p>

            {selectedGroup && (
              <div className="current-group-badge">
                <span className="status-dot"></span>

                <span>
                  Current group: <strong>{selectedGroup.name}</strong>
                </span>
              </div>
            )}
          </div>

          <div className="hero-balance-card">
            <span className="card-label">YOUR BALANCE</span>

            <div
              className={`hero-balance ${
                saiBalance >= 0 ? "positive" : "negative"
              }`}
            >
              {saiBalance >= 0 ? "+" : "-"}
              {formatAmount(Math.abs(saiBalance))}
            </div>

            <p>
              {saiBalance > 0
                ? "You are owed"
                : saiBalance < 0
                  ? "You owe"
                  : "All settled up"}
            </p>
          </div>
        </section>

        {/* ==================================================
            GROUP SELECTOR
        ================================================== */}
        <section id="groups" className="section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">YOUR GROUPS</span>
              <h2>Select a group</h2>
            </div>

            <span className="section-count">{rootGroups.length} groups</span>
          </div>

          <div className="groups-grid">
            {rootGroups.map((group) => {
              const isSelected = group._id === selectedGroupId;

              return (
                <button
                  key={group._id}
                  type="button"
                  className={`group-card ${isSelected ? "selected" : ""}`}
                  onClick={() => handleGroupSelect(group._id)}
                >
                  <div className="group-card-top">
                    <span className="group-icon">G</span>

                    {isSelected && (
                      <span className="selected-badge">SELECTED</span>
                    )}
                  </div>

                  <h3>{group.name}</h3>

                  <p>{group.members?.length || 0} members</p>

                  <span className="group-action">
                    {isSelected ? "Viewing group" : "View group →"}
                  </span>
                </button>
              );
            })}

            <button type="button" className="group-card add-group-card">
              <span className="add-icon">+</span>

              <h3>Create new group</h3>

              <p>Start tracking shared expenses</p>
            </button>
          </div>
        </section>

        {/* ==================================================
            SELECTED GROUP DETAILS
        ================================================== */}
        {selectedGroup && (
          <section className="section selected-group-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">GROUP DETAILS</span>
                <h2>{selectedGroup.name}</h2>
              </div>

              <div className="group-details-actions">
                {detailsLoading && (
                  <span className="loading-text">Updating...</span>
                )}

                <button
                  type="button"
                  className="add-expense-button"
                  onClick={() => {
                    setShowExpenseForm(true);
                    setExpenseSuccess("");
                    setExpenseError("");
                  }}
                >
                  + Add Expense
                </button>
              </div>
            </div>

            {/* Add Expense Form */}
            {showExpenseForm && (
              <div className="expense-form-card">
                <div className="expense-form-header">
                  <div>
                    <span className="eyebrow">NEW EXPENSE</span>
                    <h3>Add an expense</h3>
                  </div>

                  <button
                    type="button"
                    className="expense-cancel-button"
                    onClick={() => {
                      setShowExpenseForm(false);
                      setExpenseError("");
                      setExpenseSuccess("");

                      setExpenseForm({
                        description: "",
                        amount: "",
                        paidBy: "",
                        splitAmong: [],
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>

                <div className="expense-form-grid">
                  {/* Description */}
                  <div className="form-field">
                    <label htmlFor="expense-description">Description</label>

                    <input
                      id="expense-description"
                      type="text"
                      placeholder="e.g. Dinner at restaurant"
                      value={expenseForm.description}
                      onChange={(event) =>
                        setExpenseForm({
                          ...expenseForm,
                          description: event.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Amount */}
                  <div className="form-field">
                    <label htmlFor="expense-amount">Amount</label>

                    <input
                      id="expense-amount"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="e.g. 1500"
                      value={expenseForm.amount}
                      onChange={(event) =>
                        setExpenseForm({
                          ...expenseForm,
                          amount: event.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Paid by */}
                  <div className="form-field">
                    <label htmlFor="expense-paid-by">Paid by</label>

                    <select
                      id="expense-paid-by"
                      value={expenseForm.paidBy}
                      onChange={(event) =>
                        setExpenseForm({
                          ...expenseForm,
                          paidBy: event.target.value,
                        })
                      }
                    >
                      <option value="">Select payer</option>

                      {selectedGroup.members?.map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Split among */}
                <div className="split-section">
                  <label>Split among</label>

                  <div className="split-options">
                    {selectedGroup.members?.map((member) => (
                      <label className="split-option" key={member._id}>
                        <input
                          type="checkbox"
                          checked={expenseForm.splitAmong.includes(member._id)}
                          onChange={(event) => {
                            const memberId = member._id;

                            setExpenseForm({
                              ...expenseForm,
                              splitAmong: event.target.checked
                                ? [...expenseForm.splitAmong, memberId]
                                : expenseForm.splitAmong.filter(
                                    (id) => id !== memberId,
                                  ),
                            });
                          }}
                        />

                        <span>{member.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {expenseError && <p className="form-error">{expenseError}</p>}

                {expenseSuccess && (
                  <p className="form-success">{expenseSuccess}</p>
                )}

                <div className="expense-form-actions">
                  <button
                    type="button"
                    className="expense-cancel-button"
                    onClick={() => {
                      setShowExpenseForm(false);
                      setExpenseError("");
                      setExpenseSuccess("");

                      setExpenseForm({
                        description: "",
                        amount: "",
                        paidBy: "",
                        splitAmong: [],
                      });
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="expense-submit-button"
                    disabled={expenseSubmitting}
                    onClick={handleAddExpense}
                  >
                    {expenseSubmitting ? "Adding..." : "Add Expense"}
                  </button>
                </div>
              </div>
            )}

            {/* Summary cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">MEMBERS</span>
                <strong>{selectedGroup.members?.length || 0}</strong>
              </div>

              <div className="stat-card">
                <span className="stat-label">DIRECT EXPENSES</span>
                <strong>{expenses.length}</strong>
              </div>

              <div className="stat-card">
                <span className="stat-label">SETTLEMENTS</span>
                <strong>{settlement?.settlements?.length || 0}</strong>
              </div>

              <div className="stat-card">
                <span className="stat-label">TOTAL EXPENSE</span>
                <strong>
                  {formatAmount(
                    expenses.reduce(
                      (total, expense) => total + Number(expense.amount || 0),
                      0,
                    ),
                  )}
                </strong>
              </div>
            </div>

            {/* ==================================================
                BALANCES
            ================================================== */}
            <div className="details-grid">
              <div className="details-card">
                <div className="details-card-header">
                  <div>
                    <span className="eyebrow">BALANCES</span>
                    <h3>Who owes what?</h3>
                  </div>
                </div>

                {Array.isArray(balances) && balances.length > 0 ? (
                  <div className="balance-list">
                    {balances.map((balance) => (
                      <div className="balance-row" key={balance.userId}>
                        <div className="balance-user">
                          <div className="mini-avatar">
                            {balance.name?.charAt(0).toUpperCase()}
                          </div>

                          <span>{balance.name}</span>
                        </div>

                        <strong
                          className={
                            balance.balance >= 0 ? "positive" : "negative"
                          }
                        >
                          {balance.balance >= 0 ? "+" : "-"}
                          {formatAmount(Math.abs(balance.balance))}
                        </strong>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">
                    No balance information available.
                  </p>
                )}
              </div>

              {/* ==================================================
                  EXPENSES
              ================================================== */}
              <div className="details-card">
                <div className="details-card-header">
                  <div>
                    <span className="eyebrow">EXPENSES</span>
                    <h3>Recent expenses</h3>
                  </div>
                </div>

                {expenses.length > 0 ? (
                  <div className="expense-list">
                    {expenses.map((expense) => (
                      <div className="expense-row" key={expense._id}>
                        <div>
                          <strong>{expense.description}</strong>

                          <span>
                            Paid by {expense.paidBy?.name || "Unknown"}
                          </span>
                        </div>

                        <strong className="expense-amount">
                          {formatAmount(expense.amount)}
                        </strong>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">
                    No expenses in this group yet.
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ==================================================
            SETTLEMENTS
        ================================================== */}
        <section id="settlements" className="section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">OPTIMIZED SETTLEMENT</span>
              <h2>Minimum transactions</h2>
            </div>
          </div>

          {detailsLoading ? (
            <div className="empty-state">
              <h3>Calculating settlements...</h3>
              <p>Running the settlement engine for the selected group.</p>
            </div>
          ) : settlement?.settlements?.length > 0 ? (
            <div className="settlement-list">
              {settlement.settlements.map((item, index) => (
                <div
                  className="settlement-card"
                  key={`${item.from}-${item.to}-${index}`}
                >
                  <div className="settlement-person">
                    <div className="mini-avatar">
                      {getPersonName(item.from).charAt(0).toUpperCase()}
                    </div>

                    <strong>{getPersonName(item.from)}</strong>
                  </div>

                  <div className="settlement-arrow">
                    <span>pays</span>
                    <strong>→</strong>
                  </div>

                  <div className="settlement-person">
                    <div className="mini-avatar">
                      {getPersonName(item.to).charAt(0).toUpperCase()}
                    </div>

                    <strong>{getPersonName(item.to)}</strong>
                  </div>

                  <div className="settlement-amount">
                    {formatAmount(item.amount)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>All settled up 🎉</h3>
              <p>There are no outstanding transactions for this group.</p>
            </div>
          )}
        </section>

        {/* ==================================================
            DSA
        ================================================== */}
        <section className="section dsa-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">UNDER THE HOOD</span>
              <h2>DSA-powered settlement engine</h2>
            </div>
          </div>

          <div className="dsa-flow">
            <div className="dsa-item">
              <span>01</span>
              <strong>Tree</strong>
              <p>Nested groups</p>
            </div>

            <div className="flow-arrow">→</div>

            <div className="dsa-item">
              <span>02</span>
              <strong>DFS</strong>
              <p>Collect expenses</p>
            </div>

            <div className="flow-arrow">→</div>

            <div className="dsa-item">
              <span>03</span>
              <strong>HashMap</strong>
              <p>Calculate balances</p>
            </div>

            <div className="flow-arrow">→</div>

            <div className="dsa-item">
              <span>04</span>
              <strong>Max Heap</strong>
              <p>Prioritize debts</p>
            </div>

            <div className="flow-arrow">→</div>

            <div className="dsa-item">
              <span>05</span>
              <strong>Greedy</strong>
              <p>Minimize payments</p>
            </div>
          </div>
        </section>
      </main>

      {/* ==================================================
          FOOTER
      ================================================== */}
      <footer className="footer">
        <strong>SettleUp</strong>
        <span>Graph & Tree-Based Group Expense Settlement Engine</span>
      </footer>
    </div>
  );
}

export default App;
