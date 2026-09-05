const express = require("express");

const { getGroupSettlement } = require("../controllers/settlementController");

const router = express.Router();

router.get("/group/:groupId", getGroupSettlement);

module.exports = router;
