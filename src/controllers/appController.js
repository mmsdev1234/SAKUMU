'use strict';
const menu = require('../data/getMenu');
const appMenu = require('../data/addmenu');
const appKas = require('../data/kas');
const appSiswa = require('../data/siswa');

//read excel
const readXlsxFile = require('read-excel-file/node')
//GET
const getSetting = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result =>{
            if (result == true) {
                res.redirect('/settings/akun');
            }else{
                res.redirect('/logout');
            }
        })
    } catch (error) {
        console.log(error);
    }
}

const getSetAkun = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                getmenu(function(listmenu) {
                    res.render('./pages/set-akun', {
                        title: 'Pengaturan Akun',
                        page: 'setting',
                        menu: 'akun',
                        layout: 'settings-layout',
                        listmenu
                    });
                });
            }else{
                res.redirect('/logout');
            }
        });
    } catch (error) {
        console.log(error);
    }
}

const getSetKas = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                return appKas.getSumberDana(function(data) {
                    const kas = data.kas.filter(item => item.id !== 'kas1' && item.id !== 'kas2');                    
                    if (data.status === "ok") {
                        getmenu(function(listmenu) {
                            res.render('./pages/set-kas', {
                                title: 'Pengaturan Kas',
                                page: 'setting',
                                menu: 'kas',
                                layout: 'settings-layout',
                                listmenu,
                                sd: data.sumberdana,
                                kas
                            });
                        });
                    } 
                });
            }else{
                res.redirect('/logout');
            }
        });
    } catch (error) {
        console.log(error);
    }
}

//tampilkan menu yang akan dilempar di /pages/set-menu
const getSetMenu = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                // getmenu memiliki parameter fungsi yang berasal dari parameter allmenu pada fungsi callback
                getmenu(function(listmenu) {
                    res.render('./pages/set-menu', {
                        title: 'Pengaturan Menu',
                        page: 'setting',
                        menu: 'menu',
                        layout: 'settings-layout',
                        // listmenu in dan out berdasarkan pada json dari fungsi getmenu bawah
                        inmenu: listmenu.in,
                        outmenu: listmenu.out,
                        listmenu            
                    });
                });
            }else{
                res.redirect('/logout');
            }
        });  
    } catch (error) {
        console.log(error);
    }       
}

const getEditKelas = async (req, res) => {
    try {
        var kd = req.query.kd;
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                return appSiswa.editKelas(kd, function(data) {
                    getmenu(function(listmenu) {
                        res.render('./pages/set-editkelas', {
                            title: 'Edit Kelas '+data.kelas.nama,
                            page: 'setting',
                            menu: 'siswa',
                            layout: 'settings-layout',
                            listmenu,
                            data
                        });
                    });
                });
            }else{
                res.redirect('/logout');
            }            
        });
    } catch (error) {
        console.log(error);
    }    
}

const getSetSiswa = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                return appSiswa.getKelas(function(data) {
                    getmenu(function(listmenu) {
                        res.render('./pages/set-siswa', {
                            title: 'Pengaturan Data Siswa',
                            page: 'setting',
                            menu: 'siswa',
                            layout: 'settings-layout',
                            listmenu,
                            data
                        });
                    });
                });
            }else{
                res.redirect('/logout');
            }
        });        
    } catch (error) {
        console.log(error);
    }
}

//POST
const addNewKelas = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                var kd = req.body.kdKelas;
                var nama = req.body.namaKelas;
                return appSiswa.addKelas(kd,nama, function(data) {
                    if (data.status === 'ok') {
                        res.redirect('/settings/siswa');
                    }else if (data.status === 'no') {
                        res.redirect('/settings/siswa')
                    }
                });    
            }else{
                res.redirect('/logout');
            }
        });
    } catch (error) {
        console.log(error);
    }
}

const postEditKelas = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                var kd = req.body.getKd;
                var nama = req.body.inputNama;
                var wali = req.body.inputWali;
                return appSiswa.updateKelas(kd,nama,wali, function(data) {
                    if (data.status === "ok") {
                        res.redirect("/settings/editkelas?kd="+kd);
                    }
                });             
            }else{
                res.redirect('/logout');
            }
        });
    } catch (error) {
        console.log(error);
    }
}

const postDeleteKelas = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                var kd = req.query.kd;
                return appSiswa.deleteKelas(kd, function(data) {
                    if (data.status === 'ok') {
                        res.redirect("/settings/siswa");
                    }
                });
            }else{
                res.redirect('/logout');
            }
        });
    } catch (error) {
        console.log(error);
    }
}

const addDataSiswa = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                var kd = req.query.kd;
                var nis = req.body.inputNis;
                var nama = req.body.inputNama;
                return appSiswa.addSiswa(kd,nis,nama, function(data) {
                    if (data.status === "ok") {
                        res.redirect("/settings/editkelas?kd="+kd);
                    }else{
                        res.redirect("/settings/editkelas?kd="+kd);
                    }
                });
            }else{
                res.redirect('/logout');
            }
        });
    } catch (error) {
        console.log(error);
    }
}

const delAllSiswa = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                var kd = req.query.kd;
                return appSiswa.delAll(kd, function(data) {
                    if (data.status === "ok") {
                        res.redirect("/settings/editkelas?kd="+kd);
                    }
                });
            }else{
                res.redirect('/logout');
            }
        });
    } catch (error) {
        console.log(error);
    }
}

const delSelectedSiswa = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                var nis = req.query.nis;
                var kelas = req.query.kelas;
                return appSiswa.delSelected(nis,kelas, function(data) {
                    if (data.status === "ok") {
                        res.redirect("/settings/editkelas?kd="+kelas);
                    }
                });
            }else{
                res.redirect('/logout');
            }
        });
    } catch (error) {
        console.log(error);
    }
}

const editSelectedSiswa = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                var kd = req.query.kd;
                var nis = req.query.nis;
                var nama = req.body.editNama;
                return appSiswa.editSiswa(kd,nis,nama, function(data) {
                    if (data.status === "ok") {
                        res.redirect("/settings/editkelas?kd="+kd)
                    }
                });
            }else{
                res.redirect('/logout');
            }
        });
    } catch (error) {
        console.log(error);
    }
}
//create menu sidebar
const addNewMenu = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
              //from id or name form
                //request dari url action from method dimulai setelah tanda tanya
                // menu -> kolom kd
                var menu = req.query.menu;
                //no -> kolom sub
                var no = req.body.menuNomor;
                //nama  -> kolom nama
                var nama = req.body.menuNama;
                //
                var dess = req.body.menuDes;
                //buat variabel kosong
                var dbs = "";
                //buat kondisi jika id menu = 1 gunakan dbsiswa in jika 2 gunakan dbsiswaout
                if (menu === "1") {
                    dbs = req.body.dbSiswaIn;
                }else if (menu === "2") {
                    dbs = req.body.dbSiswaOut;
                }
                // from data/addmenu.js
                return appMenu.addNew(no,nama,dess,menu,dbs, function(data) {
                    if (data.status === 'ok') {
                        res.redirect('/settings/menu');
                    }else if (data.status === 'no') {
                        res.redirect('/settings/menu');
                    }
                });
            }else{
                res.redirect('/logout');
            }
        });
    } catch (error) {
        console.log(error);
    }
}

const delMenu = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                var kd = req.query.kd;
                var id = req.query.id;
                return appMenu.deleteMenu(kd,id, function(data) {
                    if (data.status === 'ok') {
                        res.redirect('/settings/menu');
                    }else if (data.status === 'no') {
                        res.redirect('/settings/menu');
                    }
                });
            }else{
                res.redirect('/logout');
            }
        });
    } catch (error) {
        console.log(error);
    }
}
//appmenu from data/addmenu
const editMenu = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                var kd = req.query.kd;
                var id = req.query.id;
                var nama = req.body.editNama;
                var dess = req.body.editDess;
                let dbs = '';

                if (kd === "1") {
                    dbs = req.body['dbSiswaEditIn'+id]
                }else if (kd === "2") {
                    dbs = req.body['dbSiswaEditOut'+id]
                }

                return appMenu.getEdit(kd,id,nama,dess,dbs, function(data) {
                    if (data.status === 'ok') {
                        res.redirect('/settings/menu');
                    }else if (data.status === 'no') {
                        res.redirect('/settings/menu');
                    }
                });
            }else{
                res.redirect('/logout');
            }
        });
    } catch (error) {
        console.log(error);
    }
}

const addNewDana = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                const sd = req.body.SumberDana;
                return appKas.addSumberDana(sd, function(data) {
                    if (data.status === "ok") {
                        res.redirect('/settings/kas');
                    }
                });
            }else{
                res.redirect('/logout');
            }
        });
    } catch (error) {
        console.log(error);
    }
}

const delDana = async (req,res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                var id = req.query.id;
                var nama = req.query.nama;
                if (id, nama) {
                    return appKas.delSumberDana(id,nama, function(data) {
                        if (data.status === "ok") {
                            res.redirect('/settings/kas');
                        }
                    });
                }
            }else{
                res.redirect('/logout');
            }
        });
    } catch (error) {
        console.log(error);
    }
}

//list siswa
const getListSiswa = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                var kelas = req.params.kelas;
                //panggil fungsi dari data/siswa.js yang mengandung parameter callback
                return appSiswa.getSiswa(kelas, function(data) {
                  //lempar kemana ?  
                  res.send({
                        status:'ok',
                        data
                    })
                });
            }else{
                res.redirect('/logout');
            }
        });
    } catch (error) {
        console.log(error);
    }
}

//upload template excel


const uploadTemplate = async function(req, res, next){
    // var fileup = req.file;
      // console.log(req.file, req.body);
      //read excelfile
      readXlsxFile('uploads/formFileTemplate.xlsx').then((rows) => {
        rows.shift();
        let data = [];
        rows.map(row => {
          const tutorial = {
            Nis: row[0],
            Nama: row[1],
            Kelas: row[2],
          };
          data.push(tutorial);
        });
        //  const tes =  data.map(item => ("(" + item.Nis + ", " + item.Nama + ", " + item.Kelas + ")"))
        let form = []
        for (let i = 0; i < data.length; i++) {
          const nis = data[i].Nis
          const nama = data[i].Nama
          const kd = data[i].Kelas

          const masuk = appSiswa.addSiswa(kd,nis,nama, function(data) {
            if (data.status === "ok") {
                res.redirect("/settings/editkelas?kd="+kd);
            }else{
                res.redirect("/settings/editkelas?kd="+kd);
            }
            return masuk
        });
          // const format = `(${nis},${nama},${kd},)`
          // form.push(format).toString()
        }

          console.log({
            // status:"ok",
            // message:"get data success",
            // tes
            // form
          })
      })
      next()
    // console.log(fileup);
}

//CHECK LOGIN
async function cekLogin(status) {
    try {
        if (status == true) {
            return true;
        }else{
            return false;
        }
    } catch (error) {
        console.log(error);
    }    
}

//MENU -> data/getmenu.js (function yang akan di render di setiap halaman)
async function getmenu(callback) {
    try {
        //getMenu merupakan function dari data/getmenu.js yang dimana diisikan parameter bernama data yang difilter berdasarkan kd
        await menu.getMenu(function(data) {
          //filter item yang dimana datanya sudah di inisialisasi di data/getMenu(callback)
            const inmenu = data.filter(item => item.kd === 1);
            const outmenu = data.filter(item => item.kd === 2);
            
            //buat json yang ditampung di variable allmenu yang akan di resolve
            const allmenu = {
                in: inmenu,
                out: outmenu
            }
            //buat fungsi callback yang akan di render setiap halaman
            callback(allmenu);
        });
    } catch (error) {
        console.log();
    }    
}

module.exports = {
    getSetting,
    getSetAkun,
    getSetKas,
    getSetMenu,
    getSetSiswa,
    addNewKelas,
    getEditKelas,
    postEditKelas,
    postDeleteKelas,
    addDataSiswa,
    delAllSiswa,
    delSelectedSiswa,
    editSelectedSiswa,
    addNewMenu,
    delMenu,
    editMenu,
    addNewDana,
    delDana,
    getListSiswa,
    uploadTemplate
}
