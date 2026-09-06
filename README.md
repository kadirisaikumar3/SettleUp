# SettleUp

## Graph & Tree-Based Group Expense Settlement Engine

SettleUp is a full-stack expense management application that models shared group expenses using data structures and algorithms to calculate balances and generate an optimized set of settlement transactions.

The project focuses on solving the core expense-settlement problem efficiently using HashMaps, Trees, DFS, Max Heaps, and Greedy Algorithms.

🌐 Live Demo

Frontend: https://settle-up-sage.vercel.app

Backend API: https://settleup-uiyc.onrender.com

Health Check: https://settleup-uiyc.onrender.com/api/health

🚀 Features

Create and manage groups

Create nested sub-groups

Add shared expenses

Edit expenses

Delete expenses

Select the person who paid

Split expenses among group members

Calculate individual balances

Aggregate expenses across nested groups

Generate optimized settlement transactions

Prevent invalid group hierarchies

Protect DFS traversal from circular hierarchies

Validate expense amounts and participants

Display success and error states

Persistent data using MongoDB

Automated backend tests using Jest

🧠 Core DSA

SettleUp is designed around practical DSA concepts.

HashMap

Used to maintain each user's running balance while processing expenses.

User → Balance
Sai → +1600
Deepa → -50
Siri → -1550

Tree

Groups and sub-groups are modeled as a hierarchical tree.

Trio
├── Sightseeing Places
│ ├── Mysore Palace
│ ├── Halebeedu
│ ├── Chennakesava Swamy Temple
│ ├── Shivanasamudra Waterfalls
│ └── Karanji Lake
├── Food
│ ├── Malgudi Cafe
│ └── RRR Restaurant
├── Museum
│ └── Pioneer Car Museum
└── Places
└── Postal Training Centre

DFS — Depth-First Search

DFS traverses the selected group and all nested child groups to aggregate expenses across the complete subtree.

Cycle protection using a Set prevents infinite recursion if corrupted hierarchical data contains circular references.

Max Heap

Two max heaps are used during settlement:

Creditors — members who should receive money

Debtors — members who should pay money

The largest creditor and largest debtor are repeatedly matched.

Greedy Algorithm

The settlement engine greedily matches the largest outstanding creditor with the largest outstanding debtor to reduce the number of transactions.

⚖️ Settlement Example

Suppose the calculated balances are:

Sai → +₹1600
Deepa → -₹50
Siri → -₹1550

The optimized settlement becomes:

Siri → Sai ₹1550
Deepa → Sai ₹50

Instead of generating unnecessary pairwise transactions, the algorithm directly matches debtors and creditors.

🏗️ Architecture

┌──────────────────────────┐
│ React + Vite │
│ Frontend │
│ Vercel │
└────────────┬─────────────┘
│ REST API
▼
┌──────────────────────────┐
│ Node.js + Express │
│ Backend │
│ Render │
└────────────┬─────────────┘
│
▼
┌──────────────────────────┐
│ MongoDB Atlas │
│ Database │
└──────────────────────────┘

🛠️ Tech Stack

Frontend

React.js

Vite

JavaScript

HTML5

CSS3

Backend

Node.js

Express.js

REST APIs

Database

MongoDB

MongoDB Atlas

Mongoose

Algorithms & Testing

HashMap

Tree

DFS

Max Heap

Greedy Algorithm

Jest

Deployment & Tools

Vercel

Render

Git

GitHub

VS Code

Thunder Client

📁 Project Structure

SettleUp/
├── backend/
│ ├── src/
│ │ ├── algorithms/
│ │ ├── config/
│ │ ├── controllers/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── services/
│ │ └── server.js
│ ├── tests/
│ ├── .env.example
│ └── package.json
├── frontend/
│ ├── src/
│ └── package.json
├── tests/
├── docs/
├── .gitignore
└── README.md

💰 Expense Processing Flow

User creates expense
↓
Validate group, payer and participants
↓
Store expense in MongoDB
↓
Collect expenses from selected group subtree
↓
DFS traverses nested groups
↓
HashMap calculates user balances
↓
Separate creditors and debtors
↓
Max Heaps select largest balances
↓
Greedy matching generates settlements
↓
Display optimized transactions

🧪 Testing

Backend tests are implemented using Jest.

Current test status:

Test Suites: 5 passed, 5 total
Tests: 17 passed, 17 total

Tests cover:

Balance calculation

Settlement calculation

Expense tree traversal

Nested group traversal

Empty expense handling

Decimal rounding

Circular hierarchy protection

Run tests:

cd backend
npm test

⚙️ Local Setup

Clone

git clone https://github.com/kadirisaikumar3/SettleUp.git
cd SettleUp

Backend

cd backend
npm install

Create .env:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development

Start:

npm start

Development:

npm run dev

Frontend

Open another terminal:

cd frontend
npm install
npm run dev

🔐 Environment Variables

Backend

PORT=5000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development

Frontend

Production:

VITE_API_URL=https://settleup-uiyc.onrender.com/api

Never commit .env files or database credentials to GitHub.

🌐 Production Deployment

Frontend — Vercel

https://settle-up-sage.vercel.app

Backend — Render

https://settleup-uiyc.onrender.com

Health Check

https://settleup-uiyc.onrender.com/api/health

Database — MongoDB Atlas

The production backend connects to MongoDB Atlas using the MONGODB_URI environment variable.

📈 Algorithm Complexity

The settlement engine uses max heaps for creditors and debtors and a greedy matching strategy.

For n participants, settlement calculation runs in approximately:

O(n log n)

Expense aggregation uses DFS over the group hierarchy.

The project demonstrates how appropriate data structures can improve an expense-settlement workflow compared with naive pairwise transaction generation.

🧩 Engineering Highlights

Designed a heap-based greedy algorithm to minimize group debt settlements from O(n²) pairwise transactions to approximately O(n log n).

Implemented recursive tree traversal to aggregate expenses across nested sub-groups.

Added cycle protection to prevent infinite DFS recursion from corrupted group hierarchies.

Added validation for invalid expense amounts and duplicate participants.

Implemented complete expense CRUD operations.

Implemented group creation, editing and safe deletion.

Added automated Jest tests for core algorithms and edge cases.

Connected a React frontend to a production Express REST API.

Deployed frontend and backend independently for production.

🎯 Project Goal

The goal of SettleUp is to demonstrate how Data Structures and Algorithms can be applied to a real-world software engineering problem.

The application models:

Groups as trees

User balances using hash maps

Settlement participants using max heaps

Final transaction generation using a greedy algorithm

🚀 Project Status

Production Ready

Frontend → Vercel ✅
Backend → Render ✅
Database → MongoDB Atlas ✅
REST APIs → Working ✅
DSA Engine → Working ✅
Automated Tests → 17/17 Passed ✅
Production Flow → Verified ✅

👨‍💻 Author

Saikumar Kadiri

B.Tech — Computer Science Engineering
Madanapalle Institute of Technology and Science

GitHub: https://github.com/kadirisaikumar3

Portfolio: https://kadirisaikumar3.github.io/

LinkedIn: https://www.linkedin.com/in/saikumarkadiri/

⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.
