
const path = require('path')

// const models = require((path.join(__dirname, '../../models')))

// console.log(path.join(__dirname, '../../models'));
// const models = require(path.join(__dirname, './models'))
// const models = require("../models");
// const models = require("./models/index.js");
// const Sequelize = require("sequelize");

// const ledgers = require("../../models/ledgers")

async function AddOrUpdateLedger(data) {
    await models.ledgers
        .upsert(data)
        .then(result => {
            if (result === false) {
                data = "Ledger updated!";
            } else if (result === true) {
                data = "Ledger saved!";
            } else data = "An error occured!";
        })
        .catch(err => {
            data = "An error occured";
        });
    return data;
}