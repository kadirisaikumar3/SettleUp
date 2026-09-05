const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
const groupRoutes = require("./routes/groupRoutes");
const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const settlementRoutes = require("./routes/settlementRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/groups", groupRoutes);
app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/settlements", settlementRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to SettleUp API",
    status: "success",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "SettleUp API is healthy",
  });
});

const PORT = process.env.PORT || 5000;

connectDatabase();

app.listen(PORT, () => {
  console.log(`SettleUp server running on port ${PORT}`);
});
