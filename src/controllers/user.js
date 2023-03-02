const UserModel = require('../models/user');

module.exports = {
  //create user
  createUser: async (req, res) => {
    try {
      const user = await UserModel.create(req.body);
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await UserModel.findAll();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Get user by id
  getUserById: async (req, res) => {
    try {
      const user = await UserModel.findByPk(req.params.id);
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
