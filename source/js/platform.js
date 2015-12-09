

//SOURCE - PLATFORM.

var intent_auth = null;
var IS_PHONEGAP = false;
var IS_BUILTINEXPRESSO = false;

window.define = System.amdDefine; 
window.require = window.requirejs = System.amdRequire;

System.config({
    baseURL: '/'
});

loadMainComponents([
	[	
		'bower_components/polymer/polymer.html!',
		'elements/elements.html!',
	],
	'js/main.js'
]);
