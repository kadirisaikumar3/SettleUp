const express = require("express");

const {
  createUser,
  getAllUsers,
  getUserById,
} = require("../controllers/userController");

const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", createUser);

router.get("/", authenticate, getAllUsers);

router.get("/:id", authenticate, getUserById);

module.exports = router;
