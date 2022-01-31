'use strict';
const path = require('path');
const db = require('./database').db

const getMenu = async function(callback) {
    let query = "SELECT *FROM SUBMENU ORDER BY kd, sub";
    try {
        const rows = db.prepare(query).all();
        return callback(rows);
    } catch (error) {
        console.log(error);
    }
}

const addNew = async function(no,nama,dess,menu,dbs,callback) {
    let cek = "SELECT *FROM SUBMENU WHERE kd="+menu+" and sub="+no;
        try {
            const row = db.prepare(cek).get();
            if (row) {
                return callback({status:'no', msg:'nomor menu sudah ditambahkan'})
            }else{
                let add = "INSERT INTO SUBMENU (kd,sub,nama,dess,dbsiswa) VALUES ("+menu+","+no+",'"+nama+"','"+dess+"',"+dbs+")";
                try {
                    const pre = db.prepare(add);
                    const insert = pre.run();
                    if (insert.changes > 0) {
                        console.log('- Menu baru berhasil ditambahkan');
                        return callback({status:'ok', msg:'sukses'});
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (error) {
            console.log(error);
        }
}

const deleteMenu = async function(kd,id,callback) {
    const kd1 = "PENERIMAAN";
    const kd2 = "PENGELUARAN";
    let que1 = "DELETE FROM SUBMENU WHERE kd=@kd AND sub=@sub";
    let que2 = "DELETE FROM "+eval('kd'+kd)+" WHERE kd=@sub";

    try {
        const statement = [que1,que2].map(sql => db.prepare(sql));
        const transaction = db.transaction((data)=>{
            for(const stmt of statement){
                stmt.run(data);        
            }
        });
        transaction({kd:kd,sub:id});

        callback({status:'ok', msg:'sukses'});
        console.log('- Menu berhasil dihapus');
    } catch (error) {
        console.log(error);
    }

}

const getEdit = async function name(kd,id,nama,dess,dbs,callback) {
    let query = "UPDATE SUBMENU SET nama='"+nama+"',dess='"+dess+"',dbsiswa="+dbs+" WHERE kd="+kd+" AND sub="+id;
    try {
        const pre = db.prepare(query);
        const run = pre.run();
        if (run.changes === 1) {
            callback({status:'ok',msg:'sukses'});
        }else{
            callback({status:'no',msg:'sukses'});
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    addNew,
    getMenu,
    deleteMenu,
    getEdit
}