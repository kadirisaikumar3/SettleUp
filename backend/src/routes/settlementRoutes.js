const express = require("express");

const { getGroupSettlement } = require("../controllers/settlementController");

const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticate);

router.get("/group/:groupId", getGroupSettlement);

module.exports = router;
