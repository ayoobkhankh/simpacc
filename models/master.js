'use strict';
module.exports = (sequelize, DataTypes) => {
    var master = sequelize.define('master', {
        bus_name: DataTypes.STRING,
        adr_ln1: DataTypes.STRING,
        adr_ln2: DataTypes.STRING,
        bus_phone: DataTypes.STRING,
        bus_email: DataTypes.STRING,
        acc_start_date: DataTypes.DATEONLY,
    }, {});
    master.associate = function (models) {
        // associations can be defined here
    };
    return master;
}; 
