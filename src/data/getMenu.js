'use strict';
const db = require('./database').db

async function getMenu(callback) {
    let query = "SELECT *FROM SUBMENU ORDER BY kd, sub";
    try {
        const rows = db.prepare(query).all();
        callback(rows);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getMenu
}