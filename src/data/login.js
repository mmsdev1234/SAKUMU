'use strict';
const db = require('./database').db
const key = require('./secret').security_key;

const getLogin = async() => {
    return {
        title: 'Login',
        layout: 'login-layout'
    }
}

const Login = async(username, password) => {
    
    //var encrypted = cipher.update(username, 'utf8', 'base64') + cipher.final('base64');
    //var decrypted = decipher.update(encrypted, 'base64', 'utf8') + decipher.final('utf8');

    if(username === 'admin' && password === 'admin'){
        return {status: 'ok'}
    }else{
        return {status: 'no'}
    }

}

module.exports = {
    getLogin,
    Login
}