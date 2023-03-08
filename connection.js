const Sequelize = require('sequelize');
require('dotenv').config();
const DB_URL = process.env.DB_URL;
const sequelize = new Sequelize('qrcode', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
})

//connection test
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((err) => { console.log(err, "Database connection failed") });

module.exports = sequelize;
