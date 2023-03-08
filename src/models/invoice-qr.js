const { DataTypes } = require('sequelize');
const sequelize = require('../../connection');

const invoiceqr = sequelize.define('invoiceqr', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    invoiceId: {
        type: DataTypes.INTEGER,
    },
    qrCode: {
        type: DataTypes.STRING,
    },
    customerId: {
        type: DataTypes.INTEGER,
    },
    userId: {
        type: DataTypes.INTEGER,
    },
    uniqueKey: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.STRING,
    }
});

module.exports = invoiceqr;