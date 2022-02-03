'use strict';
const outData = require('../data/outData.js');
const outNew = require('../data/outNew.js');
const rupiah = require('rupiah-format');
const replaceAll = require('replaceall');
const menu = require('../data/getMenu');

// getmenu is dinamic sidebar loaded every menu in each function
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

//---

// loaded blank page pengeluaran -> pages/out-menu-null
const noMenu = async (req,res) => {
    getmenu(function(listmenu) {
        res.render('./pages/out-menu-null',{
            title: 'Pengeluaran',
            page: 'pengeluaran',
            menu: 'pengeluaran',
            layout: 'main-layout',
            listmenu    
        });
    });

}


const get = async (req,res) => {
    const no = req.params.no;
    const getdate = req.query.date;
    const result = await outData.getData(no,getdate,function(data) {
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
            })
        }
        
        getmenu(function(listmenu) {
            const getsub = listmenu.out.filter(item => item.sub === parseInt(no));
            const dbs = getsub[0].dbsiswa;
            res.render('./pages/pengeluaran',{
                title: getsub[0].nama,
                dess: getsub[0].dess,
                page: '2'+no,
                menu: 'pengeluaran',
                layout: 'main-layout',
                sub: no,
                data: listdata,
                listmenu,
                dbs,
                filter: data.filter,
                msg: req.flash('msg')
            });
        })

    });
    return result
}

const getAll = async (req, res) => {
    const no = req.params.no;    
    const result = await outData.getAllData(no,function(data) {
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
            })
        }
        
        getmenu(function(listmenu) {
            const getsub = listmenu.out.filter(item => item.sub === parseInt(no));
            const dbs = getsub[0].dbsiswa;
            res.render('./pages/pengeluaran',{
                title: getsub[0].nama,
                dess: getsub[0].dess,
                page: '2'+no,
                menu: 'pengeluaran',
                layout: 'main-layout',
                sub: no,
                data: listdata,
                listmenu,
                dbs,
                filter: data.filter,
                msg: req.flash('msg')
            });
        })

    });
    return result
}

const getTunggakan = async (req, res) => {
    try {
        const no = req.params.no;
        const month = req.query.filter;
        await outData.tunggakan(no,month,function(data) {
            if (data.status === "ok") {
                getmenu(function(listmenu) {
                    const getsub = listmenu.out.filter(item => item.sub === parseInt(no));
                    const dbs = getsub[0].dbsiswa;
                    res.render('./pages/tunggakan-siswa',{
                        title: getsub[0].dess,
                        subtitle: 'Daftar siswa yang belum mendapatkan',
                        page: '2'+no,
                        menu: 'pengeluaran',
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

const outSearch = async (req,res) => {
    const no = req.params.no;
    const keyword = req.body.search;
    if (keyword) {
        res.redirect("/pengeluaran/"+no+"/search?keyword="+keyword);
    }else{
        res.redirect("/pengeluaran/"+no);
    }
}

const getSearch = async (req,res) => {
    const no = req.params.no;
    const keyword = req.query.keyword;
    await outData.searchFilter(no,keyword, function(data) {
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
            const getsub = listmenu.out.filter(item => item.sub === parseInt(no));
            res.render('./pages/pengeluaran',{
                title: getsub[0].nama,
                dess: getsub[0].dess,
                page: '1'+no,
                menu: 'pengeluaran',
                layout: 'main-layout',
                sub: no,
                data: listdata,
                listmenu,
                filter: '',
                msg: req.flash('msg')
            });
        })
    });
}

const addNew = async (req, res) => {
    const no = req.params.no;
    await outNew.addData(function(data) {
        if (data.status === "ok") {
            getmenu(function(listmenu) {
                const getsub = listmenu.out.filter(item => item.sub === parseInt(no));
                const dbs = getsub[0].dbsiswa;
                if (dbs == 0) {
                    res.render('./pages/out-tambah',{
                        title : 'Input Baru',
                        subtitle: getsub[0].nama,
                        page: '2'+no,
                        menu: 'pengeluaran',
                        layout: 'main-layout',
                        sub: no,
                        listmenu,
                        sd:data.sd
                    });
                }else if (dbs == 1) {
                    res.render('./pages/out-tambah-dbs',{
                        title: 'Input Baru',
                        subtitle: getsub[0].nama,
                        page: '1'+no,
                        menu: 'pengeluaran',
                        layout: 'main-layout',
                        sub: no,
                        listmenu,
                        sd:data.sd,
                        kelas:data.kls,
                        err: req.flash('err')
                    })
                }
            })
        }
    })

}

const getNewsubmit = async (req,res) => {
    const no = req.params.no
    const uraian = req.body.inpUraian;
    const satuanrp = req.body.inpSatuan;
    const satuan = replaceAll(".","", satuanrp);
    const jumlah = req.body.inpJumlah;
    const dana = req.body.inpSDana;
    const kas = req.body.inpKas;
    if (typeof uraian !== "undefined") {
        const result = await outNew.addNew(no,uraian,satuan,jumlah,dana,kas, function(data) {
            if(data['status'] === 'ok'){
                res.redirect(301,'/pengeluaran/'+no);
            }
        });
        return result;
    }else{
        req.flash('err','Pastikan kelas dan nama siswa tidak kosong!');
        res.redirect('/pengeluaran/'+no+'/add')
    }
}

const edit = async (req,res) => {
    const no = req.params.no
    const id = req.query.id
    const result = await outData.getEdit(no,id,function(data) {
        getmenu(function(listmenu) {
            const getsub = listmenu.out.filter(item => item.sub === parseInt(no));
            res.render('./pages/out-edit',{
                title : 'Edit',
                subtitle: getsub[0].dess,
                page: '1'+no,
                menu: 'pengeluaran',
                layout: 'main-layout',
                sub: no,
                data,
                listmenu
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
    const result = await outNew.updateData(no,id,uraian,satuan,jumlah,dana,kas, function(data) {
        if(data['status'] === 'ok'){
            res.redirect(301,'/pengeluaran/'+no);
        }
    });
    return result;
}

const getDelete = async (req,res) => {
    const no = req.params.no;
    const id = req.query.id;
    const result = await outNew.deleteData(no,id, function(data) {
        if(data['status'] === 'ok'){
            res.redirect(301,'/pengeluaran/'+no);
        }
    });
    return result;
}

module.exports = {
    noMenu,
    get,
    getAll,
    getTunggakan,
    outSearch,
    getSearch,
    addNew,
    getNewsubmit,
    edit,
    update,
    getDelete
}