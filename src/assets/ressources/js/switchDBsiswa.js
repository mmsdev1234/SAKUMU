'use strict';
//ambil id dari hidden input di halaman setmenu bagian Inmenu
var inmenu = document.getElementById('inmenu');
//ambil id dari hidden input di halaman setmenu bagian Outmenu
var outmenu = document.getElementById('outmenu');

//in switch
//ambil dari id switch dari form tambah menu penerima
var SwitchCheckIn = document.getElementById('SwitchCheckDBSiswaIn');
//ambil dari id input hidden form tembah mebu penerima
var DBsiswaIn = document.getElementById('dbSiswaIn');

//out switch
//ambil dari id switch from tambah menu pengeluaran
var SwitchCheckOut = document.getElementById('SwitchCheckDBSiswaOut');
//ambil dari id input hidden form tembah mebu pengeluaran
var DBsiswaOut = document.getElementById('dbSiswaOut');

//event in
// fungsi switchcheck dimana dimasukkan parameter check aktif
SwitchCheckIn.addEventListener('click',function(e) {
// panggil fungsi getCheckIn yang diberi parameter checked kemudian dimasukkan ke variable
    SwitchCheckIn = getCheckedIn(this.checked)
});
//event out
// fungsi switchcheck dimana keadaan default true /= sudah di cek list
SwitchCheckOut.addEventListener('click',function(e) {
  // panggil fungsi getCheckIn yang diberi parameter checked kemudian dimasukkan ke variable
    SwitchCheckOut = getCheckedOut(this.checked)
});

// fungsi dimana untuk cek kondisi check aktif=1 atau non=0
function getCheckedIn(status) {
    //console.log({in:status});
    // status diambil dari parameter
    if (status == true) {
        return DBsiswaIn.value = '1'
    }else if (status == false) {
        return DBsiswaIn.value = '0'
    }
}

// fungsi dimana untuk cek kondisi check aktif=1 atau non=0
function getCheckedOut(status) {
    //console.log({out:status});
    // status diambil dari parameter
    if (status == true) {
        return DBsiswaOut.value = '1'
    }else if (status == false) {
        return DBsiswaOut.value = '0'
    }
}

//ambil jumlahdata(value) dari inmenu yang diambil dari form tambah menu kemudian di looping
for (let i = 0; i < inmenu.value ; i++) {
  //ambil element id dari modal edit
    var switchEdit = document.getElementById('SwitchCheckIn'+(i+1));   
  // tambahkan event click pada did switch
    switchEdit.addEventListener('click',function(e) {
      // event target nama dari name di bagian edit default=(SwitcCheck)
        var name = e.target.name;
        // ditambah 'In' dengan split sehingga menjadi (SwitchCheckIn)
        var str = name.split('In');
        //what is this ?
        var getNumb = str[1];
        // panggil fungsi getCheckEdit yang diberi parameter status berupa target, no , menu
        getCheckedEdit(e.target.checked,getNumb, "In")
    })

}

for (let i = 0; i < outmenu.value; i++) {
    var switchEdit = document.getElementById('SwitchCheckOut'+(i+1));  

    switchEdit.addEventListener('click',function(e) {
        var name = e.target.name;        
        var str = name.split('Out');
        var getNumb = str[1];
        getCheckedEdit(e.target.checked,getNumb, "Out")
    })
}

//fungsi untuk mengedit switch database yang mengandung parameter status 
function getCheckedEdit(status, no, menu) {
  //  get id dbsiswaedit dari menu edit di tambah dengan parameter
    var dbSiswaEdit = document.getElementById('dbSiswaEdit'+menu+no);
    //buat statement jika status true maka value 1 jika false maka 0
    if (status == true) {
        dbSiswaEdit.value = '1'
    }else if (status == false) {
        dbSiswaEdit.value = '0'
    } 
}
