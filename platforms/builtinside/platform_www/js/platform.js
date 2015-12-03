
//BUILTIN - PLATFORM.

var intent_auth = null;
var IS_PHONEGAP = false;
var IS_BUILTINEXPRESSO = true;

window.define = System.amdDefine; 
window.require = window.requirejs = System.amdRequire;

System.config({
    baseURL: '/'
});

System.import('js/main.js');
