const { DataTypes } = require('sequelize');
const sequelize = require('../../connection');

const verificationCode = sequelize.define('verificationCode', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    qrcode: {
        type: DataTypes.STRING,
    },
    code: {
        type: DataTypes.STRING,
    }
});

module.exports = verificationCode;
