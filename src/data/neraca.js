'use strict';
const db = require('./database').db

const getLaporanNeraca = async function(callback) {
    
}
// fungsi yang akan di lempar di mainController.js
const getLaporanLabarugi = async function(callback) {
// query laporan in = pilih kolom submenu.sub dan submenu.dess lalu jumlahkan kolom total dari submenu sebagai a dan  penerimaan sebagai b
// yang dimana kolom kd = 1 dan kolom sub(submenu) = kd(penerimaan) kemudian grup berdasarkan sub yang sama
    var queIn = `SELECT a.sub, a.dess, sum(i.total) as total
                FROM SUBMENU a, PENERIMAAN i
                WHERE a.kd = 1 and a.sub = i.kd 
                GROUP by a.sub`
// query yang digunakan untuk mengelompokkan penerimaan dan pengeluaran yang di kelompokkan berdasarkan tabel sub(submenu)=kd(penerimaan/pengeluaran)
    var queOut = `SELECT a.sub, a.dess, sum(i.total) as total
                FROM SUBMENU a, PENGELUARAN i
                WHERE a.kd = 2 and a.sub = i.kd 
                GROUP by a.sub`

    try {
        // masukkan var ke array kemudian inisialisasi query better sql
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