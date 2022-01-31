'use strict';
const db = require('./database').db

const getLaporanNeraca = async function(callback) {
    
}

const getLaporanLabarugi = async function(callback) {
    var queIn = `SELECT a.sub, a.dess, sum(total) as total
                FROM SUBMENU a, PENERIMAAN i
                WHERE a.kd = 1 and a.sub = i.kd 
                GROUP by a.sub`

    var queOut = `SELECT a.sub, a.dess, sum(total) as total
                FROM SUBMENU a, PENGELUARAN i
                WHERE a.kd = 2 and a.sub = i.kd 
                GROUP by a.sub`

    try {
        const statement = [queIn,queOut].map(sql => db.prepare(sql).all());
        const getIn = statement[0];
        const getOut = statement[1];

        getMenu(function(data_menu) {
            const menuIn = data_menu.filter(item => item.kd == 1);
            const menuOut = data_menu.filter(item => item.kd == 2);
            //---
            const finaldata = []
            for (let i = 0; i < menuIn.length; i++) {
                var cekData = getIn.filter(item => item.sub == menuIn[i].sub)[0]; 
                let total = 0;
                if (typeof cekData !== 'undefined') {
                    total = cekData.total
               }
                finaldata.push({
                    kategori: "penerimaan",
                    sub: menuIn[i].sub,
                    dess: menuIn[i].dess,
                    total
                })
            }
            for (let i = 0; i < menuOut.length; i++) {
                var cekData = getOut.filter(item => item.sub == menuOut[i].sub)[0]; 
                let total = 0;
                if (typeof cekData !== 'undefined') {
                     total = cekData.total
                }
                finaldata.push({
                    kategori: "pengeluaran",
                    sub: menuOut[i].sub,
                    dess: menuOut[i].dess,
                    total
                })
            }
            callback({
                status:"ok",
                data:finaldata
            });
        })
    } catch (error) {
        console.log(error);
    }
}

function getMenu(callback) {
    const menu = `SELECT *FROM SUBMENU`
    try {
        const get = db.prepare(menu).all();
        callback(get);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getLaporanNeraca,
    getLaporanLabarugi
}