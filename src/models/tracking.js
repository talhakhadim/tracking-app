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
        //should be float and long float 
        type: DataTypes.FLOAT(10,6)
    },
    long:{
        type: DataTypes.FLOAT(10,6)
    },
});

module.exports = Tracking;