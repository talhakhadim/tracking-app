const Sequelize = require('sequelize');
require('dotenv').config();
const database=process.env.Database;
const username=process.env.Username;
const password=process.env.Password;
const host=process.env.Host;
const sequelize = new Sequelize( database, username, password, {
    host: host,
    dialect: 'mysql',
    logging: false
})

//connection test
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((err) => { console.log(err,"Database connection failed") });

module.exports = sequelize;
