const express = require("express");

const { register, login } = require("../controllers/authController");
const authRateLimiter = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);

module.exports = router;
