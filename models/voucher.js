'use strict';
module.exports = (sequelize, DataTypes) => {
    var voucher = sequelize.define('voucher', {
        vou_date: DataTypes.DATEONLY,
        vou_no: DataTypes.INTEGER,
        led_id: DataTypes.INTEGER,
        led_treat: DataTypes.STRING,
        vou_amt: {
            type: DataTypes.DECIMAL(20, 2)
        },
        vou_desc: DataTypes.STRING,
    }, {});
    voucher.associate = function (models) {

        voucher.belongsTo(models.ledger, {
            foreignKey: 'led_id'
        });

    };
    return voucher;
}; 
