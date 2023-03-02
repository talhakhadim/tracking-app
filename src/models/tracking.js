const { DataTypes } = require('sequelize');
const sequelize = require('../../connection');

const Tracking = sequelize.define('Tracking', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId:{
        type: DataTypes.INTEGER,
    },
    lat:{
        type: DataTypes.FLOAT,
    },
    long:{
        type: DataTypes.FLOAT,
    },
});

module.exports = Tracking;