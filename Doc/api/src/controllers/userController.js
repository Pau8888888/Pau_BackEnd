const userService = require('../services/userService');

const createUser = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json({ status: 'success', data: user });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

module.exports = {
    createUser,
};
