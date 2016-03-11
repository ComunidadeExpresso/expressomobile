

//SOURCE - PLATFORM.

var intent_auth = null;
var IS_PHONEGAP = false;
var IS_BUILTINEXPRESSO = false;
var ENVIROMENT = 'DEV';

window.define = System.amdDefine; 
window.require = window.requirejs = System.amdRequire;

System.config({
    baseURL: '/'
});

loadMainComponents([
	[	
		// 'bower_components/polymer/polymer.html!',
		// 'elements/elements.html!',
	],
	'js/main.js'
]);

if (ENVIROMENT == 'DEV') {
	document.write('<script src="http://localhost:35729/livereload.js?snipver=1"></' + 'script>');
} 

// document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>');