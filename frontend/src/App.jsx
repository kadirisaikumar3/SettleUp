import { useEffect, useState } from "react";
import {
  getGroups,
  getGroupSettlement,
  getGroupExpenses,
} from "./services/api";
import "./App.css";

function App() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [settlement, setSettlement] = useState(null);
  const [settlementLoading, setSettlementLoading] = useState(false);

  const [expenses, setExpenses] = useState([]);
  const [expensesLoading, setExpensesLoading] = useState(false);

  /*
   * Load all groups.
   */
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const response = await getGroups();

        setGroups(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, []);

  /*
   * Find root-level groups.
   */
  const rootGroups = groups.filter((group) => group.parentGroupId === null);

  /*
   * Select the first root group that has members.
   */
  const currentGroup =
    rootGroups.find((group) => group.members.length > 0) ||
    rootGroups[0] ||
    null;

  /*
   * Load optimized settlement data for the current group.
   */
  useEffect(() => {
    if (!currentGroup) {
      return;
    }

    const loadSettlement = async () => {
      try {
        setSettlementLoading(true);

        const response = await getGroupSettlement(currentGroup._id);

        setSettlement(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setSettlementLoading(false);
      }
    };

    loadSettlement();
  }, [currentGroup]);

  /*
   * Load direct expenses for the current group.
   */
  useEffect(() => {
    if (!currentGroup) {
      return;
    }

    const loadExpenses = async () => {
      try {
        setExpensesLoading(true);

        const response = await getGroupExpenses(currentGroup._id);

        setExpenses(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setExpensesLoading(false);
      }
    };

    loadExpenses();
  }, [currentGroup]);

  /*
   * Find Sai's balance from the settlement response.
   */
  const saiBalance =
    settlement?.balances?.find((balance) => balance.name === "Sai")?.balance ||
    0;

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">S</div>
          <span>SettleUp</span>
        </div>

        <nav className="nav-links">
          <a href="#dashboard">Dashboard</a>
          <a href="#groups">Groups</a>
          <a href="#settlements">Settlements</a>
        </nav>

        <button className="profile-button">Sai</button>
      </header>

      <main className="main-content" id="dashboard">
        {/* HERO */}
        <section className="hero-section">
          <div>
            <p className="eyebrow">SMART EXPENSE SETTLEMENT</p>

            <h1>
              Split expenses.
              <br />
              <span>Settle smarter.</span>
            </h1>

            <p className="hero-description">
              Manage shared expenses, track balances, and find the minimum
              number of transactions needed to settle your group.
            </p>

            <div className="hero-actions">
              <button className="primary-button">Create Group</button>

              <button className="secondary-button">View Groups</button>
            </div>
          </div>

          {/* CURRENT GROUP CARD */}
          <div className="hero-card">
            <div className="card-header">
              <div>
                <p className="card-label">CURRENT GROUP</p>

                <h2>
                  {currentGroup
                    ? currentGroup.name
                    : loading
                      ? "Loading..."
                      : "No group selected"}
                </h2>
              </div>

              <span className="status-badge">
                {currentGroup ? "Active" : "Waiting"}
              </span>
            </div>

            <div className="balance-highlight">
              <span>Your balance</span>

              <strong>
                {settlementLoading
                  ? "..."
                  : saiBalance >= 0
                    ? `+₹${saiBalance.toLocaleString("en-IN")}`
                    : `-₹${Math.abs(saiBalance).toLocaleString("en-IN")}`}
              </strong>
            </div>

            <div className="mini-stats">
              <div>
                <span>Members</span>

                <strong>
                  {currentGroup ? currentGroup.members.length : 0}
                </strong>
              </div>

              <div>
                <span>Expenses</span>

                <strong>{expensesLoading ? "..." : expenses.length}</strong>
              </div>

              <div>
                <span>Settlements</span>

                <strong>
                  {settlement ? settlement.settlements.length : "—"}
                </strong>
              </div>
            </div>
          </div>
        </section>

        {/* GROUPS */}
        <section className="section" id="groups">
          <div className="section-heading">
            <div>
              <p className="eyebrow">OVERVIEW</p>

              <h2>Your Groups</h2>
            </div>

            <button className="text-button">View all →</button>
          </div>

          {loading && <p className="hero-description">Loading groups...</p>}

          {error && (
            <p className="hero-description">Unable to load data: {error}</p>
          )}

          {!loading && !error && (
            <div className="group-grid">
              {rootGroups.map((group) => (
                <article className="group-card" key={group._id}>
                  <div className="group-icon">
                    {group.name
                      .split(" ")
                      .slice(0, 2)
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()}
                  </div>

                  <div className="group-info">
                    <h3>{group.name}</h3>

                    <p>
                      {group.members.length}{" "}
                      {group.members.length === 1 ? "member" : "members"}
                    </p>
                  </div>

                  <div className="group-balance">
                    <span>Members</span>

                    <strong>{group.members.length}</strong>
                  </div>
                </article>
              ))}

              <article className="group-card add-group-card">
                <div className="add-icon">+</div>

                <div className="group-info">
                  <h3>Create a new group</h3>

                  <p>Start tracking shared expenses</p>
                </div>
              </article>
            </div>
          )}
        </section>

        {/* SETTLEMENTS */}
        <section className="section" id="settlements">
          <div className="section-heading">
            <div>
              <p className="eyebrow">OPTIMIZED PAYMENTS</p>

              <h2>Suggested Settlements</h2>
            </div>
          </div>

          {settlementLoading && (
            <p className="hero-description">
              Calculating optimized settlements...
            </p>
          )}

          {!settlementLoading &&
            settlement &&
            settlement.settlements.length === 0 && (
              <p className="hero-description">
                Everyone is settled. No payments are required.
              </p>
            )}

          {!settlementLoading &&
            settlement &&
            settlement.settlements.map((item, index) => (
              <div
                className="settlement-card"
                key={`${item.from.userId}-${item.to.userId}-${index}`}
              >
                <div className="settlement-user">
                  <div className="avatar">
                    {item.from.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <strong>{item.from.name}</strong>

                    <span>needs to pay</span>
                  </div>
                </div>

                <div className="settlement-arrow">→</div>

                <div className="settlement-user">
                  <div className="avatar">
                    {item.to.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <strong>{item.to.name}</strong>

                    <span>receives</span>
                  </div>
                </div>

                <strong className="settlement-amount">
                  ₹{item.amount.toLocaleString("en-IN")}
                </strong>
              </div>
            ))}
        </section>

        {/* DSA */}
        <section className="algorithm-section">
          <div>
            <p className="eyebrow">UNDER THE HOOD</p>

            <h2>Powered by Data Structures & Algorithms</h2>

            <p>
              SettleUp uses tree traversal to aggregate nested group expenses
              and a max-heap based greedy algorithm to minimize settlement
              transactions.
            </p>
          </div>

          <div className="algorithm-grid">
            <div className="algorithm-item">
              <strong>01</strong>

              <span>Tree + DFS</span>

              <p>Aggregate expenses across nested groups.</p>
            </div>

            <div className="algorithm-item">
              <strong>02</strong>

              <span>HashMap</span>

              <p>Calculate each member's net balance.</p>
            </div>

            <div className="algorithm-item">
              <strong>03</strong>

              <span>Max Heap</span>

              <p>Prioritize the largest creditors and debtors.</p>
            </div>

            <div className="algorithm-item">
              <strong>04</strong>

              <span>Greedy</span>

              <p>Reduce the number of required transactions.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>SettleUp</span>

        <span>Graph & Tree-Based Expense Settlement Engine</span>
      </footer>
    </div>
  );
}

export default App;
