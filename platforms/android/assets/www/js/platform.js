

var intent_auth = null;
var IS_PHONEGAP = true;
var IS_BUILTINEXPRESSO = false;

window.define = System.amdDefine; 
window.require = window.requirejs = System.amdRequire;

System.config({
    baseURL: '/android_asset/www/'
});

System.import('js/main.js');
