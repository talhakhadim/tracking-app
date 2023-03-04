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
       
        type: DataTypes.STRING(100)
    },
    long:{
        type: DataTypes.STRING(100)
    },
});

module.exports = Tracking;