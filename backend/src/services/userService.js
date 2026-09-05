const User = require("../models/User");

const createUser = async ({ name, email }) => {
  if (!name || !name.trim()) {
    throw new Error("User name is required");
  }

  if (!email || !email.trim()) {
    throw new Error("User email is required");
  }

  const existingUser = await User.findOne({
    email: email.trim().toLowerCase(),
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const user = await User.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
  });

  return user;
};

const getAllUsers = async () => {
  return User.find().sort({ createdAt: 1 });
};

const getUserById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
};
