'use strict';
module.exports = (sequelize, DataTypes) => {
    var ledger = sequelize.define('ledger', {
        led_name: DataTypes.STRING,
        led_desc: DataTypes.STRING,
        acc_group: DataTypes.STRING,
        acc_group_code: DataTypes.INTEGER,
        acc_sub_group: DataTypes.STRING,
        acc_sub_group_code: DataTypes.INTEGER,
        led_ob: {
            type: DataTypes.DECIMAL(20, 2)
        },
        led_ob_type: DataTypes.STRING,
    }, {});
    ledger.associate = function (models) {

        ledger.hasMany(models.voucher, {
            foreignKey: 'led_id',
            foreignKeyConstraint: true
        });

        // ledger.belongsTo(models.voucher, { foreignKey: 'led_id', foreignKeyConstraint: true });

        // associations can be defined here
    };
    return ledger;
}; 
