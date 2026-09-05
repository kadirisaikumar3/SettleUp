const groupService = require("../services/groupService");

const createGroup = async (req, res) => {
  try {
    const { name, members, parentGroupId } = req.body;

    const group = await groupService.createGroup({
      name,
      members,
      parentGroupId,
    });

    res.status(201).json({
      status: "success",
      message: "Group created successfully",
      data: group,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const getAllGroups = async (req, res) => {
  try {
    const groups = await groupService.getAllGroups();

    res.status(200).json({
      status: "success",
      data: groups,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getGroupById = async (req, res) => {
  try {
    const group = await groupService.getGroupById(req.params.id);

    res.status(200).json({
      status: "success",
      data: group,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

const updateGroupMembers = async (req, res) => {
  try {
    const { members } = req.body;

    const group = await groupService.updateGroupMembers(req.params.id, members);

    res.status(200).json({
      status: "success",
      message: "Group members updated successfully",
      data: group,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  createGroup,
  getAllGroups,
  getGroupById,
  updateGroupMembers,
};
