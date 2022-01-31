'use strict';
const menu = require('../data/getMenu');
const appMenu = require('../data/addmenu');
const appKas = require('../data/kas');
const appSiswa = require('../data/siswa');

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

const getSetMenu = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                getmenu(function(listmenu) {
                    res.render('./pages/set-menu', {
                        title: 'Pengaturan Menu',
                        page: 'setting',
                        menu: 'menu',
                        layout: 'settings-layout',
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

const addNewMenu = async (req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result => {
            if (result == true) {
                var no = req.body.menuNomor;
                var nama = req.body.menuNama;
                var dess = req.body.menuDes;
                var menu = req.query.menu;
                var dbs = "";
                if (menu === "1") {
                    dbs = req.body.dbSiswaIn;
                }else if (menu === "2") {
                    dbs = req.body.dbSiswaOut;
                }
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
                return appSiswa.getSiswa(kelas, function(data) {
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

const uploadTemplate = async (req, res) => {
    var fileup = req.file;
    console.log(fileup);
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

//MENU
async function getmenu(callback) {
    try {
        await menu.getMenu(function(data) {
            const inmenu = data.filter(item => item.kd === 1);
            const outmenu = data.filter(item => item.kd === 2);
            
            const allmenu = {
                in: inmenu,
                out: outmenu
            }
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
