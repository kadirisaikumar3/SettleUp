const Group = require("../models/Group");
const User = require("../models/User");
const Expense = require("../models/Expense");

const userHasGroupAccess = (group, userId) => {
  if (!group || !userId) {
    return false;
  }

  const userIdString = userId.toString();

  return (
    group.createdBy?.toString() === userIdString ||
    group.members.some((memberId) => memberId.toString() === userIdString)
  );
};

const createGroup = async ({
  name,
  members = [],
  parentGroupId = null,
  createdBy,
}) => {
  if (!name || !name.trim()) {
    throw new Error("Group name is required");
  }

  const existingUsers = await User.find({
    _id: { $in: members },
  });

  if (existingUsers.length !== members.length) {
    throw new Error("One or more users do not exist");
  }

  if (parentGroupId) {
    const parentGroup = await Group.findById(parentGroupId);

    if (!parentGroup) {
      throw new Error("Parent group not found");
    }

    if (!userHasGroupAccess(parentGroup, createdBy)) {
      throw new Error("Access denied to parent group");
    }
  }

  const group = await Group.create({
    name: name.trim(),
    members,
    parentGroupId,
    createdBy,
  });

  return group;
};

const getGroupById = async (groupId, userId) => {
  const group = await Group.findOne({
    _id: groupId,
    $or: [{ createdBy: userId }, { members: userId }],
  }).populate("members", "name email");

  if (!group) {
    throw new Error("Group not found or access denied");
  }

  return group;
};

const updateGroupMembers = async (groupId, members, userId) => {
  const group = await Group.findOne({
    _id: groupId,
    createdBy: userId,
  });

  if (!group) {
    throw new Error("Group not found or access denied");
  }

  const existingUsers = await User.find({
    _id: { $in: members },
  });

  if (existingUsers.length !== members.length) {
    throw new Error("One or more users do not exist");
  }

  group.members = members;

  await group.save();

  return group.populate("members", "name email");
};

const updateGroup = async (
  groupId,
  { name, members, parentGroupId },
  userId,
) => {
  const group = await Group.findOne({
    _id: groupId,
    createdBy: userId,
  });

  if (!group) {
    throw new Error("Group not found or access denied");
  }

  if (name !== undefined) {
    if (!name.trim()) {
      throw new Error("Group name is required");
    }

    group.name = name.trim();
  }

  if (members !== undefined) {
    const existingUsers = await User.find({
      _id: { $in: members },
    });

    if (existingUsers.length !== members.length) {
      throw new Error("One or more users do not exist");
    }

    group.members = members;
  }

  if (parentGroupId !== undefined) {
    if (parentGroupId === null || parentGroupId === "") {
      group.parentGroupId = null;
    } else {
      if (parentGroupId === groupId) {
        throw new Error("A group cannot be its own parent");
      }

      const parentGroup = await Group.findById(parentGroupId);

      if (!parentGroup) {
        throw new Error("Parent group not found");
      }

      if (!userHasGroupAccess(parentGroup, userId)) {
        throw new Error("Access denied to parent group");
      }

      // Prevent circular hierarchy
      let currentParent = parentGroup;

      while (currentParent.parentGroupId) {
        if (currentParent.parentGroupId.toString() === groupId) {
          throw new Error("Invalid parent group: circular hierarchy detected");
        }

        currentParent = await Group.findById(currentParent.parentGroupId);

        if (!currentParent) {
          throw new Error("Parent hierarchy is invalid");
        }
      }

      group.parentGroupId = parentGroupId;
    }
  }

  await group.save();

  return group.populate("members", "name email");
};

const getAllGroups = async (userId) => {
  return Group.find({
    $or: [{ createdBy: userId }, { members: userId }],
  })
    .populate("members", "name email")
    .sort({ createdAt: 1 });
};

const deleteGroup = async (groupId, userId) => {
  const group = await Group.findOne({
    _id: groupId,
    createdBy: userId,
  });

  if (!group) {
    throw new Error("Group not found or access denied");
  }

  const childGroup = await Group.findOne({
    parentGroupId: groupId,
  });

  if (childGroup) {
    throw new Error("Cannot delete a group that has child groups");
  }

  const expense = await Expense.findOne({
    groupId,
  });

  if (expense) {
    throw new Error("Cannot delete a group that has expenses");
  }

  await Group.findByIdAndDelete(groupId);

  return {
    message: "Group deleted successfully",
  };
};

module.exports = {
  createGroup,
  getAllGroups,
  getGroupById,
  updateGroupMembers,
  updateGroup,
  deleteGroup,
};
