const Group = require("../models/Group");
const User = require("../models/User");

const createGroup = async ({ name, members = [], parentGroupId = null }) => {
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
  }

  const group = await Group.create({
    name: name.trim(),
    members,
    parentGroupId,
  });

  return group;
};

const getGroupById = async (groupId) => {
  const group = await Group.findById(groupId).populate("members", "name email");

  if (!group) {
    throw new Error("Group not found");
  }

  return group;
};

const updateGroupMembers = async (groupId, members) => {
  const group = await Group.findById(groupId);

  if (!group) {
    throw new Error("Group not found");
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

const updateGroup = async (groupId, { name, members, parentGroupId }) => {
  const group = await Group.findById(groupId);

  if (!group) {
    throw new Error("Group not found");
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

const getAllGroups = async () => {
  return Group.find().populate("members", "name email").sort({ createdAt: 1 });
};

module.exports = {
  createGroup,
  getAllGroups,
  getGroupById,
  updateGroupMembers,
  updateGroup,
};
