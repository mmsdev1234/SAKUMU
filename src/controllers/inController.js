'use strict';
const inData = require('../data/inData.js');
const inNew = require('../data/inNew.js');
const rupiah = require('rupiah-format');
const replaceAll = require('replaceall');
const menu = require('../data/getMenu');

//function blank page -> /pages/in-menu-null.ejs => '/'
const noMenu = async (req,res) => {
    getmenu(function(listmenu) {
        res.render('./pages/in-menu-null',{
            title: 'Penerimaan',
            page: 'penerimaan',
            menu: 'penerimaan',
            layout: 'main-layout',
            listmenu    
        });
    });

}

//function get data siswa from inData.js(getData) -> /pages/penerimaan
const get = async (req,res) => {
    const no = req.params.no;
    const getdate = req.query.date;
    await inData.getData(no,getdate,function(data) {
        let listdata = [];
        for(let i=0;i<data.rows.length;i++){
            let time = data.rows[i].timestamp;
            let str = time.toString();
            let year = str.substring(0,4);
            let month = str.substring(4,6);
            let day = str.substring(6,8);
            let tanggal = day+"/"+month+"/"+year;
            listdata.push({
                kd: data.rows[i].kd,
                no: data.rows[i].no,
                timestamp: data.rows[i].timestamp,
                tanggal: tanggal,
                uraian: data.rows[i].uraian,
                satuan: data.rows[i].satuan,
                satuanrp: rupiah.convert(data.rows[i].satuan),
                jumlah: data.rows[i].jumlah,
                total: data.rows[i].total,
                totalrp: rupiah.convert(data.rows[i].total),
                sumber: data.rows[i].sumber,
                kas: data.rows[i].kas                
            });
        }

        getmenu(function(listmenu) {
            const getsub = listmenu.in.filter(item => item.sub === parseInt(no));
            const dbs = getsub[0].dbsiswa;
            res.render('./pages/penerimaan',{
                title: getsub[0].nama,
                dess: getsub[0].dess,
                page: '1'+no,
                menu: 'penerimaan',
                layout: 'main-layout',
                sub: no,
                data: listdata,
                listmenu,
                dbs,
                filter: data.filter,
                msg: req.flash('msg')
            });
        });
    });
}
//get semua data penerimaan
const getAll = async (req, res) => {
    const no = req.params.no;
    await inData.getAllData(no,function(data) {
        let listdata = [];
        for(let i=0;i<data.rows.length;i++){
            let time = data.rows[i].timestamp;
            let str = time.toString();
            let year = str.substring(0,4);
            let month = str.substring(4,6);
            let day = str.substring(6,8);
            let tanggal = day+"/"+month+"/"+year;
            listdata.push({
                kd: data.rows[i].kd,
                no: data.rows[i].no,
                timestamp: data.rows[i].timestamp,
                tanggal: tanggal,
                uraian: data.rows[i].uraian,
                satuan: data.rows[i].satuan,
                satuanrp: rupiah.convert(data.rows[i].satuan),
                jumlah: data.rows[i].jumlah,
                total: data.rows[i].total,
                totalrp: rupiah.convert(data.rows[i].total),
                sumber: data.rows[i].sumber,
                kas: data.rows[i].kas                
            });
        }

        getmenu(function(listmenu) {
            const getsub = listmenu.in.filter(item => item.sub === parseInt(no));
            const dbs = getsub[0].dbsiswa;
            res.render('./pages/penerimaan',{
                title: getsub[0].nama,
                dess: getsub[0].dess,
                page: '1'+no,
                menu: 'penerimaan',
                layout: 'main-layout',
                sub: no,
                data: listdata,
                listmenu,
                dbs,
                filter: data.filter,
                msg: req.flash('msg')
            });
        });

    });
}
//get tunggakan from inData(tunggakan) -> /pages/tunggakan-siswa
const getTunggakan = async (req, res) => {
    try {
        const no = req.params.no;
        const month = req.query.filter;
        await inData.tunggakan(no,month,function(data) {
            if (data.status === "ok") {
                getmenu(function(listmenu) {
                    const getsub = listmenu.in.filter(item => item.sub === parseInt(no));
                    const dbs = getsub[0].dbsiswa;
                    res.render('./pages/tunggakan-siswa',{
                        title: getsub[0].dess,
                        subtitle: 'Daftar siswa yang belum bayar',
                        page: '1'+no,
                        menu: 'penerimaan',
                        layout: 'main-layout',
                        sub: no,
                        listmenu,
                        list: data.list,
                        filter: data.filter
                    });
                });
            };
        });
    } catch (error) {
        console.log(error);
    }    
}

const inSearch = async (req,res) => {
    const no = req.params.no;
    const keyword = req.body.search;
    if (keyword) {
        res.redirect("/penerimaan/"+no+"/search?keyword="+keyword);
    }else{
        res.redirect("/penerimaan/"+no);
    }
}

const getSearch = async (req,res) => {
    const no = req.params.no;
    const keyword = req.query.keyword;
    await inData.searchFilter(no,keyword, function(data) {
        let listdata = [];
        for(let i=0;i<data.length;i++){
            let time = data[i].timestamp;
            let str = time.toString();
            let year = str.substring(0,4);
            let month = str.substring(4,6);
            let day = str.substring(6,8);
            let tanggal = day+"/"+month+"/"+year;
            listdata.push({
                kd: data[i].kd,
                no: data[i].no,
                timestamp: data[i].timestamp,
                tanggal: tanggal,
                uraian: data[i].uraian,
                satuan: data[i].satuan,
                satuanrp: rupiah.convert(data[i].satuan),
                jumlah: data[i].jumlah,
                total: data[i].total,
                totalrp: rupiah.convert(data[i].total),
                sumber: data[i].sumber,
                kas: data[i].kas
            })
        }

        getmenu(function(listmenu) {
            const getsub = listmenu.in.filter(item => item.sub === parseInt(no));
            const dbs = getsub[0].dbsiswa;
            res.render('./pages/penerimaan',{
                title: getsub[0].nama,
                dess: getsub[0].dess,
                page: '1'+no,
                menu: 'penerimaan',
                layout: 'main-layout',
                sub: no,
                data: listdata,
                listmenu,
                dbs,
                filter: '',
                msg: req.flash('msg')
            });
        })
    });
}

//get function from inNew.js(addData) -> /pages/in-tambah
const addNew = async (req,res) => {
    const no = req.params.no
    await inNew.addData(function(data) {
        if (data.status === "ok") {
            getmenu(function(listmenu) {
                const getsub = listmenu.in.filter(item => item.sub === parseInt(no));
                const dbs = getsub[0].dbsiswa;
                if (dbs == 0) {
                    res.render('./pages/in-tambah',{
                        title : 'Input Baru',
                        subtitle: getsub[0].nama,
                        page: '1'+no,
                        menu: 'penerimaan',
                        layout: 'main-layout',
                        sub: no,
                        listmenu,
                        kas:data.kas,
                        sd:data.sd                        
                    });                        
                }else if (dbs == 1) {
                    res.render('./pages/in-tambah-dbs',{
                        title: 'Input Baru',
                        subtitle: getsub[0].nama,
                        page: '1'+no,
                        menu: 'penerimaan',
                        layout: 'main-layout',
                        sub: no,
                        listmenu,
                        sd:data.sd,
                        kas:data.kas,
                        kelas:data.kls,
                        err: req.flash('err')
                    })
                }
            });
        }
    })
}

const newSubmit = async (req,res) => {
    const no = req.params.no
    const uraian = req.body.inpUraian;
    const satuanrp = req.body.inpSatuan;
    const satuan = replaceAll(".","", satuanrp);
    const jumlah = req.body.inpJumlah;
    const dana = req.body.inpSDana;
    const kas = req.body.inpKas;
    if (typeof uraian !== "undefined") {
        const result = await inNew.submitNew(no,uraian,satuan,jumlah,dana,kas, function(data) {
            if(data['status'] === 'ok'){
                var total = parseInt(satuan)*parseInt(jumlah);
                req.flash('msg','Data '+uraian+' sebesar '+rupiah.convert(total)+' berhasil ditambahkan!')
                res.redirect(301,'/penerimaan/'+no);
            }
        });
        return result;
    }else{
        req.flash('err','Pastikan kelas dan nama siswa tidak kosong!');
        res.redirect('/penerimaan/'+no+'/add')
    }
}

const edit = async (req,res) => {
    const no = req.params.no
    const id = req.query.id
    const result = await inData.getEdit(no,id,function(data) {
        getmenu(function(listmenu) {
            const getsub = listmenu.in.filter(item => item.sub === parseInt(no));
            res.render('./pages/in-edit',{
                title : 'Edit',
                subtitle: getsub[0].dess,
                page: '1'+no,
                menu: 'penerimaan',
                layout: 'main-layout',
                sub: no,
                data: data.field,
                listmenu,
                sd:data.sd
            });
        })
    });
    return result;
}

const update = async (req, res) => {
    const no = req.params.no;
    const id = req.query.id;
    const uraian = req.body.inpUraian;
    const satuanrp = req.body.inpSatuan;
    const satuan = replaceAll(".","", satuanrp)
    const jumlah = req.body.inpJumlah;
    const dana = req.body.inpSDana;
    const kas = req.body.inpKas;
    const result = await inNew.updateData(no,id,uraian,satuan,jumlah,dana,kas, function(data) {
        if(data['status'] === 'ok'){
            res.redirect(301,'/penerimaan/'+no);
        }
    });
    return result;
}

const getDelete = async (req,res) => {
    const no = req.params.no;
    const id = req.query.id;
    const result = await inNew.deleteData(no,id, function(data) {
        if(data['status'] === 'ok'){
            res.redirect(301,'/penerimaan/'+no);
        }
    });
    return result;
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
    await menu.getMenu(function(data) {
        const inmenu = data.filter(item => item.kd === 1);
        const outmenu = data.filter(item => item.kd === 2);
        
        const allmenu = {
            in: inmenu,
            out: outmenu
        }
        callback(allmenu);
    });
}

module.exports = {
    noMenu,
    get,
    getAll,
    getTunggakan,
    inSearch,
    getSearch,
    newSubmit,
    addNew,
    edit,
    update,
    getDelete
}