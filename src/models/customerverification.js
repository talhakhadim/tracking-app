const { DataTypes } = require('sequelize');
const sequelize = require('../../connection');

const customerverification = sequelize.define('customerverification', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    qrcode: {
        type: DataTypes.STRING,
    },
    invoiceId: {
        type: DataTypes.INTEGER,
    },
    customerId: {
        type: DataTypes.INTEGER,
    },
    uniqueKey: {
        type: DataTypes.STRING,
    },
    employeeId: {
        type: DataTypes.INTEGER,
    },
    status: {
        type: DataTypes.STRING,
    }
});

module.exports = customerverification;
