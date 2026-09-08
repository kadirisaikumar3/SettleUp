# SettleUp

## Graph & Tree-Based Group Expense Settlement Engine

SettleUp is a full-stack expense management application that models shared group expenses using data structures and algorithms to calculate balances and generate an optimized set of settlement transactions.

The project focuses on solving the core expense-settlement problem efficiently using HashMaps, Trees, DFS, Max Heaps, and Greedy Algorithms.

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
- JWT-based authentication
- Backend-enforced authorization
- Authentication rate limiting
- Automated backend tests using Jest

---

## 🧠 Core DSA

SettleUp is designed around practical Data Structures and Algorithms concepts.

### HashMap

A JavaScript `Map` is used to maintain each user's running balance while processing expenses.

Example:

```text
User    → Balance

Sai     → +₹1600
Deepa   → -₹50
Siri    → -₹1550
```

### Tree

Groups and sub-groups are modeled as a hierarchical tree.

Example:

```text
Trio
├── Sightseeing Places
│   ├── Mysore Palace
│   ├── Halebeedu
│   ├── Chennakesava Swamy Temple
│   ├── Shivanasamudra Waterfalls
│   └── Karanji Lake
├── Food
│   ├── Malgudi Cafe
│   └── RRR Restaurant
├── Museum
│   └── Pioneer Car Museum
└── Places
    └── Postal Training Centre
```

### DFS — Depth-First Search

DFS traverses the selected group and all nested child groups to aggregate expenses across the complete subtree.

A `Set` is used to protect the traversal from infinite recursion if corrupted hierarchical data contains circular references.

### Max Heap

Two Max Heaps are used during settlement:

- **Creditors** — members who should receive money
- **Debtors** — members who should pay money

The largest creditor and largest debtor are repeatedly matched.

### Greedy Algorithm

The settlement engine greedily matches the largest outstanding creditor with the largest outstanding debtor to reduce the number of transactions.

---

## ⚖️ Settlement Example

Suppose the calculated balances are:

```text
Sai   → +₹1600
Deepa → -₹50
Siri  → -₹1550
```

The optimized settlement becomes:

```text
Siri  → Sai    ₹1550
Deepa → Sai    ₹50
```

Instead of generating unnecessary pairwise transactions, the algorithm directly matches debtors and creditors.

---

## 🏗️ Architecture

```text
┌──────────────────────────┐
│       React + Vite       │
│        Frontend          │
│          Vercel          │
└────────────┬─────────────┘
             │
             │ REST API
             ▼
┌──────────────────────────┐
│     Node.js + Express    │
│         Backend          │
│          Render          │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│       MongoDB Atlas      │
│         Database         │
└──────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- HTML5
- CSS3

### Backend

- Node.js
- Express.js
- REST APIs

### Database

- MongoDB
- MongoDB Atlas
- Mongoose

### Authentication & Security

- JWT
- bcrypt
- Express Rate Limit
- Environment Variables
- Backend Authorization

### Algorithms & Testing

- HashMap
- Tree
- DFS
- Max Heap
- Greedy Algorithm
- Jest

### Deployment & Tools

- Vercel
- Render
- Git
- GitHub
- VS Code
- Thunder Client

---

## 🔐 Authentication & Security

SettleUp uses JWT-based authentication and backend-enforced authorization.

### Authentication

- User registration with input validation
- Passwords hashed using bcrypt
- JWT issued after successful login
- Protected API routes require a Bearer token
- Password fields are excluded from normal user queries

### Authorization

- Users can access groups they own or belong to
- Only group owners can edit or delete groups
- Group members can manage expenses according to the application's access policy
- Backend services verify group access before sensitive operations
- Nested group creation and updates verify access to the parent group

### Security Hardening

- JSON request bodies limited to 10 KB
- Authentication endpoints are rate-limited
- JWT secrets and database credentials are stored in environment variables
- Environment files are excluded from Git
- Circular group hierarchies are protected during DFS traversal

---

## 📁 Project Structure

```text
SettleUp/
├── backend/
│   ├── src/
│   │   ├── algorithms/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   ├── tests/
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   └── package.json
│
├── tests/
├── docs/
├── .gitignore
└── README.md
```

---

## 🔌 API Overview

### Authentication

| Method | Endpoint             | Description                      |
| ------ | -------------------- | -------------------------------- |
| POST   | `/api/auth/register` | Register a new user              |
| POST   | `/api/auth/login`    | Authenticate user and return JWT |

### Groups

| Method | Endpoint          | Description                                         |
| ------ | ----------------- | --------------------------------------------------- |
| GET    | `/api/groups`     | Get groups accessible to the authenticated user     |
| POST   | `/api/groups`     | Create a group                                      |
| GET    | `/api/groups/:id` | Get a specific accessible group                     |
| PUT    | `/api/groups/:id` | Update an owned group                               |
| DELETE | `/api/groups/:id` | Delete an owned group when no dependent data exists |

### Expenses

| Method | Endpoint            | Description             |
| ------ | ------------------- | ----------------------- |
| GET    | `/api/expenses`     | Get accessible expenses |
| POST   | `/api/expenses`     | Create an expense       |
| PUT    | `/api/expenses/:id` | Update an expense       |
| DELETE | `/api/expenses/:id` | Delete an expense       |

### Settlements

| Method | Endpoint                          | Description                                              |
| ------ | --------------------------------- | -------------------------------------------------------- |
| GET    | `/api/settlements/group/:groupId` | Calculate balances and optimized settlements for a group |

All protected endpoints require:

```text
Authorization: Bearer <JWT>
```

The backend validates authentication and authorization before performing protected operations.

---

## 💰 Expense Processing Flow

```text
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
```

---

## 🧪 Testing

Backend tests are implemented using Jest.

### Current Test Status

```text
Test Suites: 6 passed, 6 total
Tests:       24 passed, 24 total
```

### Tests Cover

- Balance calculation
- Settlement calculation
- Multiple creditors and debtors
- Settlement balance preservation
- Expense tree traversal
- Nested group traversal
- Empty expense handling
- Decimal amounts
- Circular hierarchy protection
- Authentication token validation
- Invalid JWT rejection
- Protected expense endpoints
- Protected settlement endpoints

### Run Tests

```bash
cd backend
npm test
```

---

## ⚙️ Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/kadirisaikumar3/SettleUp.git
cd SettleUp
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here
```

Start the backend:

```bash
npm start
```

For development:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs locally at:

```text
http://localhost:5173
```

The backend runs locally at:

```text
http://localhost:5000
```

---

## 🔐 Environment Variables

### Backend

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here
```

### Frontend

For production:

```env
VITE_API_URL=https://settleup-uiyc.onrender.com/api
```

Never commit `.env` files or database credentials to GitHub.

---

## 🌐 Production Deployment

SettleUp is deployed using Vercel, Render, and MongoDB Atlas.

### Frontend — Vercel

Live application:

https://settle-up-sage.vercel.app/

### Backend — Render

Production API:

https://settleup-uiyc.onrender.com

### Health Check

```text
https://settleup-uiyc.onrender.com/api/health
```

The health endpoint confirms that the production backend is running successfully.

### Database — MongoDB Atlas

The production backend connects to MongoDB Atlas using the `MONGODB_URI` environment variable.

### Deployment Architecture

```text
User
  ↓
Vercel
  ↓
React Frontend
  ↓
Render
  ↓
Express REST API
  ↓
MongoDB Atlas
```

---

## 📈 Algorithm Complexity

### Balance Calculation

A HashMap (`Map`) maintains each user's running balance while processing expenses.

- **Time:** O(P)
- **Space:** O(U)

Where:

- `P` = total number of participant entries across all expenses
- `U` = number of unique users

### Expense Tree Traversal

The group hierarchy is traversed using DFS.

Lookup maps are built for:

- Parent group → child groups
- Group → expenses

This avoids repeatedly scanning the complete group and expense collections during traversal.

- **Time:** O(G + E)
- **Space:** O(G + E)

Where:

- `G` = number of groups
- `E` = number of expenses

### Settlement Calculation

Creditors and debtors are stored in two Max Heaps.

The largest creditor and largest debtor are repeatedly matched using a greedy strategy.

- **Time:** O(U log U)
- **Space:** O(U)

The resulting settlement set minimizes unnecessary pairwise transactions for the application's equal-split settlement model.

The project demonstrates how appropriate data structures can improve an expense-settlement workflow compared with naive pairwise transaction generation.

---

## 🧩 Engineering Highlights

- Designed a heap-based greedy algorithm to minimize group debt settlements from approximately O(n²) pairwise transaction generation to O(n log n)
- Implemented recursive tree traversal to aggregate expenses across nested sub-groups
- Optimized group expense traversal using lookup maps
- Added cycle protection to prevent infinite DFS recursion from corrupted group hierarchies
- Added validation for invalid expense amounts and duplicate participants
- Implemented complete expense CRUD operations
- Implemented group creation, editing, and safe deletion
- Implemented JWT authentication and backend authorization
- Added authentication rate limiting
- Added request body size limits
- Added automated Jest tests for core algorithms and edge cases
- Connected a React frontend to a production Express REST API
- Deployed frontend and backend independently for production
- Verified authenticated and unauthorized access scenarios

---

## 🎯 Project Goal

The goal of SettleUp is to demonstrate how Data Structures and Algorithms can be applied to a real-world software engineering problem.

The application models:

```text
Groups
  ↓
Trees

User balances
  ↓
HashMaps

Settlement participants
  ↓
Max Heaps

Transaction generation
  ↓
Greedy Algorithm
```

---

## 🚀 Project Status

### Production Ready

- Frontend → Vercel ✅
- Backend → Render ✅
- Database → MongoDB Atlas ✅
- REST APIs → Working ✅
- Authentication & Authorization → Working ✅
- DSA Engine → Working ✅
- Automated Tests → 24/24 Passed ✅
- Production Flow → Verified ✅
- Security Hardening → Implemented ✅

---

## 👨‍💻 Author

**Saikumar Kadiri**

B.Tech — Computer Science Engineering  
Madanapalle Institute of Technology and Science

- GitHub: https://github.com/kadirisaikumar3
- Portfolio: https://kadirisaikumar3.github.io/
- LinkedIn: https://www.linkedin.com/in/saikumarkadiri/

---

## ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.
