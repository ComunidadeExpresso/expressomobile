
//WEB - PLATFORM.

var intent_auth = null;
var IS_PHONEGAP = false;
var IS_BUILTINEXPRESSO = false;

window.define = System.amdDefine; 
window.require = window.requirejs = System.amdRequire;

System.config({
    baseURL: '/'
});

loadMainComponents([
	'js/main.js'
]);

document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>');