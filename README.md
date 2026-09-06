# SettleUp

## Graph & Tree-Based Group Expense Settlement Engine

SettleUp is a full-stack expense management application that models shared group expenses using **data structures and algorithms** to calculate balances and generate an optimized set of settlement transactions.

The project focuses on solving the core expense-settlement problem efficiently using **HashMaps, Trees, DFS, Max Heaps, and Greedy Algorithms**.

---

## 🚀 Features

- Create and manage groups
- Create nested sub-groups
- Add shared expenses
- Edit expenses
- Delete expenses
- Select the person who paid
- Split expenses among group members
- Calculate individual balances
- Aggregate expenses across nested groups
- Generate optimized settlement transactions
- Prevent invalid group hierarchies
- Protect DFS traversal from circular hierarchies
- Validate expense amounts and participants
- Display success and error states
- Persistent data using MongoDB
- Automated backend tests using Jest

---

## 🧠 Core DSA

SettleUp is designed around practical DSA concepts:

### HashMap

Used to maintain each user's running balance while processing expenses.

```text
User → Balance
Sai   → +1600
Deepa → -50
Siri  → -1550
```
