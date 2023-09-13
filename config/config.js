const User = require('../model/users');
const sequelize = require('../config/db');

const synchronizeModel = async () => {
    await User.sync({ force: false });
    console.log('Model synchronized successfully!');
}


module.exports = synchronizeModel;