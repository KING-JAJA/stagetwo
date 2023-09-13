const Sequelize = require('sequelize');
require('dotenv').config();

const database = process.env.MYSQL_DB;
const user = process.env.MYSQL_USER
const password = process.env.MYSQL_PASSWORD;
const host = process.env.MYSQL_HOST;

const sequelize = new Sequelize(database, user, password, {
    host,
    dialect: 'mysql'
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection established successfully');
    } catch (error) {
        console.error(`Unable to connect to the database ${error}`);
    }
})();

module.exports = sequelize;