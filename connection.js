const Sequelize = require('sequelize');
const database='test';
const username='root';
const password='Talha@123';
const sequelize = new Sequelize( database, username, '', {
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false
})

//connection test
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((err) => { console.log(err,"Database connection failed") });

module.exports = sequelize;
