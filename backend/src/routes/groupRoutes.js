const express = require("express");

const {
  createGroup,
  getGroupById,
  updateGroupMembers,
} = require("../controllers/groupController");

const router = express.Router();

router.post("/", createGroup);

router.put("/:id/members", updateGroupMembers);

router.get("/:id", getGroupById);

module.exports = router;
