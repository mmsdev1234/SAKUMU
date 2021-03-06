'use strict';
const express = require('express');
const router = express.Router();

//controllers
const mainControll = require('../controllers/mainController');
const appControll = require('../controllers/appController');

//GET
router.get('/', mainControll.getRoot);
router.get('/aktivasi', mainControll.getAktivasi);
router.get('/login', mainControll.getLogin);
router.get('/dashboard', mainControll.getDashboard);
router.get('/profile', mainControll.getProfile);
router.get('/kas',mainControll.getKas);
router.get('/aruskas', mainControll.getArusKas);
router.get('/logout', mainControll.getLogout);
router.get('/settings', appControll.getSetting);
router.get('/settings/akun', appControll.getSetAkun);
router.get('/settings/kas', appControll.getSetKas);
router.get('/settings/menu', appControll.getSetMenu);
router.get('/settings/siswa', appControll.getSetSiswa);
router.get('/app/sync', mainControll.getSync);

//POST
router.post('/aktivasi', mainControll.postAktivasi);
router.post('/login', mainControll.postLogin);
router.post('/settings/addkas', mainControll.postAddKas);
router.post('/settings/delkas', mainControll.postDelKas);
router.post('/settings/addmenu', appControll.addNewMenu);
router.post('/settings/delmenu', appControll.delMenu);
router.post('/settings/editmenu', appControll.editMenu);
router.post('/settings/addsumberdana', appControll.addNewDana);
router.post('/settings/delsumberdana', appControll.delDana);
router.post('/settings/addkelas', appControll.addNewKelas);
router.get('/settings/editkelas', appControll.getEditKelas);
router.post('/settings/editkelas', appControll.postEditKelas);
router.post('/settings/delete/kelas', appControll.postDeleteKelas);
router.post('/settings/addsiswa', appControll.addDataSiswa);
router.post('/settings/delsiswa/all', appControll.delAllSiswa);
router.post('/settings/delsiswa', appControll.delSelectedSiswa);
router.post('/settings/editsiswa', appControll.editSelectedSiswa);

//------------------------------------------------------------------//
//upload file

// const multer = require('multer');
// const upload = multer({dest: '/filepath'});

// router.post('/settings/editkelas/upload',upload.single('formFileTemplate'), function(req, res) {
//     console.log(req.file, req.body);
// });

//get list siswa
router.get('/siswa/:kelas', appControll.getListSiswa);

module.exports = {
    routes: router
}