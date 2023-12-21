const asyncHanlder = require("express-async-handler");

const getAllUsers = asyncHanlder(async (req, res) => {
  res.json({ message: "All users routes are available" });
});

// Get user Profile Info

const getUserProfile = asyncHanlder(async (req, res) => {
  res.status(200).json({ message: "User Profile Info Successfully" });
});
// Update User Profile

const updateUserPrfile = asyncHanlder(async (req, res) => {
  res.status(200).json({ message: "Update user Successfully" });
});

module.exports = { updateUserPrfile, getUserProfile, getAllUsers };
