'use strict';
const app_aktivasi = require('../data/aktivasi')
const appLogin = require('../data/login');
const appKas = require('../data/kas');
const appNeraca = require('../data/neraca');
const menu = require('../data/getMenu');
const rupiah = require('rupiah-format');

//GET
const getRoot = async (req,res) => {
    try {
        await getActive(function(status) {
            if (status == true) {
                res.redirect('/login');
            }else{
                res.redirect('/aktivasi');
            }
        });
    } catch (error) {
        console.log();
    }    
}

const getAktivasi = async (req,res) => {
    try {
        await getActive(function(status) {
            if (status == true) {
                res.redirect('/login');
            }else{
                res.render('./pages/aktivasi', {
                    title: 'Welcome',
                    layout: 'login-layout',
                    err: req.flash('err')
                });
            }
        });
    } catch (error) {
        console.log(error);
    }    
}

const getLogin = async (req, res) => {
    try {
        await getActive(function(status) {
            if (status == true) {
                const cek = cekLogin(req.session.loggedIn);
                Promise.resolve(cek).then(result =>{
                    if (result == true) {
                        res.redirect('/dashboard')
                    }else{
                        req.session.destroy();
                        res.render('./pages/login', {
                            title: 'Login',
                            layout: 'login-layout'
                        });
                    }                
                });            
            }else{
                res.redirect('/aktivasi');
            }
        });
    } catch (error) {
        console.log(error);
    }    
}

const getDashboard = async(req,res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result =>{
            if (result == true) {
                getmenu(function(listmenu) {
                    res.render('./pages/dashboard',{
                        title: 'Dashboard',
                        page: 'dashboard',
                        menu: 'dashboard',
                        layout: 'main-layout',
                        listmenu
                    });
                });
            }else{
                req.session.destroy();
                res.redirect('/login');
            }
        });
    } catch (error) {
        console.log(error);
    }    
}

const getProfile = async (req,res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result =>{
            if (result == true) {
                getmenu(function(listmenu) {
                    res.render('./pages/profilsekolah',{
                        title: 'Profile',
                        page: 'profile',
                        menu: 'profile',
                        layout: 'main-layout',
                        listmenu
                    });
                });
            }else{
                req.session.destroy();
                res.redirect('/login');
            }
        });
    } catch (error) {
        console.log(error);
    }   
}

const getKas = async (req,res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result =>{
            if (result == true) {            
                appKas.getSaldoKas(function(data) {
                    const inout = data['inout'];
                    const kas = data['kas'];
                    const newarray = [];
                    for (let i = 0; i < kas.length; i++) {
                        const totalkas = inout['in'+kas[i].id] - inout['out'+kas[i].id]
                        const newdata = {
                            id: kas[i].id,
                            nama: kas[i].nama,
                            total: rupiah.convert(totalkas)
                        }
                        newarray.push(newdata);
                    }
            
                    getmenu(function(listmenu) {
                        res.render('./pages/kas',{
                            title: 'Kas',
                            page: 'kas',
                            menu: 'kas',
                            layout: 'main-layout',
                            kas: newarray,
                            listmenu
                        })
                    });
                });            
            }else{
                req.session.destroy();
                res.redirect('/login');
            }
        });
    } catch (error) {
        console.log(error);
    }    
}

const getArusKas = async (req,res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result =>{
            if (result == true) {
                appNeraca.getLaporanLabarugi(function(data) {
                    if (data.status === "ok") {
                        const dataIn = data.data.filter(item => item.kategori === "penerimaan");
                        var finalIn = [];
                        let totalIn = 0;
                        for (let i = 0; i < dataIn.length; i++) {
                            finalIn.push({
                                sub:dataIn[i].sub,
                                dess:dataIn[i].dess,
                                total: rupiah.convert(dataIn[i].total)
                            })
                            totalIn += dataIn[i].total
                        }
            
                        const dataOut = data.data.filter(item => item.kategori === "pengeluaran");
                        var finalOut =[];
                        let totalOut = 0;
                        for (let i = 0; i < dataOut.length; i++) {
                            finalOut.push({
                                sub:dataOut[i].sub,
                                dess:dataOut[i].dess,
                                total: rupiah.convert(dataOut[i].total)
                            })
                            totalOut += dataOut[i].total
                        }
                        getmenu(function(listmenu) {
                            res.render('./pages/aruskas',{
                                title: 'Laba Rugi',
                                page: 'aruskas',
                                menu: 'aruskas',
                                layout: 'settings-layout',
                                listmenu,
                                penerimaan: finalIn,
                                total_penerimaan: rupiah.convert(totalIn),
                                pengeluaran: finalOut,
                                total_pengeluaran: rupiah.convert(totalOut) 
                            })
                        })
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

const getLogout = async(req,res) => {
    try {
        req.session.destroy();
        res.redirect('/login');
    } catch (error) {
        console.log(error);
    }    
}

const getSync = async(req, res) => {
    try {
        const cek = cekLogin(req.session.loggedIn);
        await Promise.resolve(cek).then(result =>{
            if (result == true) {
                getmenu(function(listmenu) {
                    res.render('./pages/sync',{
                        title: 'Sinkronisasi',
                        page: 'sync',
                        menu: 'sync',
                        layout: 'main-layout',
                        listmenu
                    });
                })
            }else{
                res.redirect('/logout');
            }            
        });
    } catch (error) {
        console.log(error);
    }
}

//POST
const postAktivasi = async (req,res) => {
    try {
        var kd_sekolah = req.body.kdsekolah;
        var kd_aktivasi = req.body.kdaktivasi;
        await app_aktivasi.submit(kd_sekolah, kd_aktivasi, function(data) {
            if (data.status === "ok") {
                res.redirect('/login');
            }else if (data.status === "no") {
                req.flash('err',data.msg);
                res.redirect('/aktivasi');
            }
        });
    } catch (error) {
        console.log(error);
    }
}

const postLogin = async (req,res) => {
    try {
        var username = req.body.inpUser;
        var password = req.body.inpPass;
        const result = await appLogin.Login(username, password);
        if(result['status'] === 'ok'){
            req.session.cookie.expires = new Date(Date.now() + 3600000);
            req.session.loggedIn = true;
            res.redirect('/dashboard');
        }else{
            res.redirect('/')
        }
    } catch (error) {
        console.log(error);
    }    
}

const postAddKas = async (req, res) => {
    var nama_kas = req.body.inpKas;
    var color = req.body.inpColor
    const cek = cekLogin(req.session.loggedIn);
    await Promise.resolve(cek).then(result =>{
        if (result == true) { 
            appKas.addKas(nama_kas,color, function(data) {
                if (data.status === "ok") {
                    res.redirect('/settings/kas');
                }
            });
        }else{
            res.redirect('/logout');
        }
    });
}

const postDelKas = async (req, res) => {
    var id = req.query.id;
    var nama = req.query.nama;
    const cek = cekLogin(req.session.loggedIn);
    await Promise.resolve(cek).then(result =>{
        if (result == true) { 

        }else{
            res.redirect('/logout');
        }
    });
}

//----------------------------------------------------//

//CHECK AKTIVASI
async function getActive(callback) {
    try {
        await app_aktivasi.check(function(data) {
            callback(data.active);
        });
    } catch (error) {
        console.log(error);
    }
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
    getRoot,
    getAktivasi,
    postAktivasi,
    getLogin,
    postLogin,
    getLogout,
    getDashboard,
    getProfile,
    getKas,
    getArusKas,
    postAddKas,
    postDelKas,
    getSync
}