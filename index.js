'use strict';
const express = require('express');
const axios = require('axios');
const helmet = require('helmet');
const open = require('open');
const compression = require('compression');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const appRoutes = require('./src/routes/appRoutes');
const inRoutes = require('./src/routes/inRoutes');
const outRoutes = require('./src/routes/outRoutes');

const app = express();
app.use(helmet());
app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'ejs');

//flash config
app.use(cookieParser('secretMMSPObyrikiyukie2022'));
app.use(
    session({
        cookie: {expires: 6000},
        secret: 'secretMMSPObyrikiyukie2022',
        resave: false,
        saveUninitialized: false
    })
);
app.use(flash());

//layouts
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));

//route
app.use("/", appRoutes.routes);
//routes
app.use("/penerimaan", inRoutes.inroutes);
app.use("/pengeluaran", outRoutes.outroutes);

//static
app.use("/styles", express.static(path.join(__dirname + "/src/assets/bootstrap")));
app.use("/icon", express.static(path.join(__dirname + "/src/assets/bootstrap-icons")));
app.use("/ressources", express.static(path.join(__dirname + "/src/assets/ressources")));
app.use("/filepath", express.static(path.join(__dirname + "/upload")));

//server
app.listen(8080, ()=>{
    console.log("");
    console.log(" =====================================");
    console.log("                (SAKUMU)              ");
    console.log(" Sistem Aplikasi Keuangan Muhammadiyah");
    console.log(" =====================================");
    console.log("");
    console.log(" Powered by :");
    console.log(" PT BPRS Mitra Mentari Sejahtera");
    console.log("");
    console.log(" url : http://localhost:8080");
    console.log("");
    console.log(" app version 1.0");
    console.log(" _________________________________");
    console.log("");

    //openlink();
});



async function openlink() {
    await open('http://localhost:8080', {app: {name: 'chrome'}});
}
module.exports = {
    app
};