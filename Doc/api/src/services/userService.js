const User = require('../models/Usuario');

const createUser = async (userData) => {
    const newUser = new User(userData);
    return await newUser.save();
};

module.exports = {
    createUser,
};
