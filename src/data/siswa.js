'use strict';
const db = require('./database').db

const getKelas = async function(callback) {
    let get = "SELECT *FROM KELAS ORDER BY kd";
    try {
        const rows = db.prepare(get).all();
        return callback(rows);
    } catch (error) {
        console.log(error);
    }
}

const addKelas = async function(kd, nama, callback) {
    let cekkode = "SELECT *FROM KELAS WHERE kd='"+kd+"'";
    try {
        const row = db.prepare(cekkode).get();
        if (row) {
            console.log('- gagal menambahkan kelas baru, kelas sudah ditambahkan');
            return callback({status: 'no', msg:'kelas sudah ditambahkan'})
        }else{
            let add = "INSERT INTO KELAS (kd,nama, siswa) VALUES ('"+kd+"','"+nama+"',"+0+")";
            try {
                const pre = db.prepare(add);
                const insert = pre.run();
                if (insert.changes > 0) {
                    console.log('- kelas baru berhasil ditambahkan');
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

const editKelas = async function(kd, callback) {
    let getinfo = "SELECT *FROM KELAS WHERE kd='"+kd+"'";
    try {
        const row = db.prepare(getinfo).get();
        if (row) {
            //return callback(row);
            let getSiswa = "SELECT *FROM SISWA WHERE kelas='"+kd+"' Order by nama";
            let jumlahSiswa = `SELECT count(nis)
            FROM siswa
            WHERE kelas='${kd}'`
            const siswas = db.prepare(getSiswa).all();
            const jumlah = db.prepare(jumlahSiswa).all();
            return callback({kelas:row, siswa:siswas, count:jumlah});
        }
    } catch (error) {
        console.log(error);
    }
}

const updateKelas = async function(kd, nama, wali, callback) {
    let update = "UPDATE KELAS SET kd='"+kd+"', nama='"+nama+"', wali='"+wali+"' WHERE kd='"+kd+"'";
    try {
        const pre = db.prepare(update);
        const run = pre.run();
        if (run.changes > 0) {
            return callback({status:"ok", msg:"sukses"});
        }
    } catch (error) {
        console.log(error);
    }
}

const deleteKelas = async function(kd, callback) {
    let delkelas = "DELETE FROM KELAS WHERE kd='"+kd+"'";
    let delsiswa = "DELETE FROM SISWA WHERE kelas='"+kd+"'";
    try {
        const statement = [delkelas,delsiswa].map(sql => db.prepare(sql));
        const transaction = db.transaction((data)=>{
            for(const stmt of statement){
                stmt.run(data)
            }
        });
        transaction({kd:kd});
        return callback({status: "ok", msg:"sukses"});        
    } catch (error) {
        console.log(error);
    }
}

const addSiswa = async function(kd,nis,nama, callback) {
    let checkNis = "SELECT *FROM SISWA WHERE nis='"+nis+"'";
    try {
        const row = db.prepare(checkNis).get();
        if (row) {
            console.log("- gagal menambahkan siswa, NIS sudah terdaftar");
            return callback({status:"no", msg: "gagal menambahkan siswa, NIS sudah terdaftar"});
        }else{
            let add = `INSERT INTO SISWA (nis,nama,kelas) VALUES ('${nis}','${nama}','${kd}')`;
            try {
                const pre = db.prepare(add);
                const run = pre.run();
                if (run.changes > 0) {
                    console.log("- "+nama+" berhasil ditambahkan di kelas "+kd);
                    let up = "UPDATE KELAS SET siswa = siswa+1 WHERE kd='"+kd+"'";
                    try {
                        const preup = db.prepare(up);
                        const runup = preup.run();
                        if (runup.changes > 0) {
                            return callback({status:"ok", msg:nama+" berhasil ditambahkan di kelas "+kd});                            
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
    } catch (error) {
        console.log(error);
    }
}
const delAll = async function(kd, callback) {
    let clearall = "DELETE FROM SISWA WHERE kelas='"+kd+"'";
    try {
        const pre = db.prepare(clearall);
        const run = pre.run();
        if (run.changes > 0) {
            let up = "UPDATE KELAS SET siswa=0 WHERE kd='"+kd+"'";
            try {
                const uppre = db.prepare(up);
                const uprun = uppre.run();
                if (uprun.changes > 0) {
                    console.log("- Data siswa kelas "+kd+" berhasil dihapus");
                    return callback({status:"ok", msg:"Data siswa kelas "+kd+" berhasil dihapus"});
                }
            } catch (error) {
                console.log(error);
            }            
        }
    } catch (error) {
        console.log(error);
    }
}

const delSelected = async function(nis,kelas, callback) {
    let del = "DELETE FROM SISWA WHERE kelas='"+kelas+"' and nis='"+nis+"'";
    try {
        const pre = db.prepare(del);
        const run = pre.run();
        if (run.changes > 0) {
            console.log("- Siswa berhasil dihapus");
            return callback({status: "ok", msg: "Siswa berhasil dihapus"});
        }
    } catch (error) {
        console.log(error);
    }
}

const editSiswa = async function(kd,nis,nama, callback) {
    let update = "UPDATE SISWA SET nama='"+nama+"' WHERE kelas='"+kd+"' and nis='"+nis+"'";
    try {
        const pre = db.prepare(update);
        const run = pre.run();
        if (run.changes > 0) {
            return callback({status: "ok", msg:"sukses"});
        }
    } catch (error) {
        console.log(error);
    }
}

const getSiswa = async function(kelas, callback) {
    try {
      // buat query select dari tabel siswa dimana kelas berdasarkaan request parameter dari controller
        const get = "SELECT *FROM SISWA WHERE kelas='"+kelas+"'";
        const rows = db.prepare(get).all();
        //buat fungsi callback yang dimana memanggil parameter fungsi dari appController yang mengirim data siswa
        return callback(rows)
    } catch (error) {
        console.log(error);
    }
}

const addTemplate = async function(data_template, kd, callback) {
    try {
        const filter = data_template.filter(item => item.Kelas === kd)
        const maping = filter.map(item => (`('${item.Nis}','${item.Nama}','${item.Kelas}')`))
        const conv = maping.toString()
        //console.log(data_template);
        //console.log(filter);
        let query = `INSERT INTO SISWA (nis,nama,kelas) VALUES ${conv}`
        const insert = db.prepare(query).run();
        console.log(insert);
        if (insert.changes > 0) {
            return callback({status:"ok", msg:"success"})
        }else{
            return callback({status:"no", msg:"tidak ada perubahan"})
        }
    } catch (error) {
        //console.log(error);
        if (error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
            return callback({status:"no", msg:"terdeteksi ada data nis yang sudah terdaftar"})
        }
    }
}

module.exports = {
    getKelas,
    addKelas,
    editKelas,
    updateKelas,
    deleteKelas,
    addSiswa,
    delAll,
    delSelected,
    editSiswa,
    getSiswa,
    addTemplate
}