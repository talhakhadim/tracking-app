const Sequelize = require('sequelize');
require('dotenv').config();
const DB_URL=process.env.DB_URL;
const sequelize = new Sequelize( DB_URL,{
    logging: false
})

//connection test
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((err) => { console.log(err,"Database connection failed") });

module.exports = sequelize;
