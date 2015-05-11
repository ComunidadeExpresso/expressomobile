
// function WebIntentFactory() { }

// WebIntentFactory.prototype.create = function (serviceName) {

	// var exec = require("cordova/exec");

	var WebIntent = function() {

    };

    WebIntent.prototype.ACTION_SEND = "android.intent.action.SEND";
    WebIntent.prototype.ACTION_VIEW= "android.intent.action.VIEW";
    WebIntent.prototype.EXTRA_TEXT = "android.intent.extra.TEXT";
    WebIntent.prototype.EXTRA_SUBJECT = "android.intent.extra.SUBJECT";
    WebIntent.prototype.EXTRA_STREAM = "android.intent.extra.STREAM";
    WebIntent.prototype.EXTRA_EMAIL = "android.intent.extra.EMAIL";

    WebIntent.prototype.startActivity = function(params, success, fail) {
        return cordova.exec(function(args) {
            success(args);
        }, function(args) {
            fail(args);
        }, 'WebIntentPlugin', 'startActivity', [params]);
    };

    WebIntent.prototype.hasExtra = function(params, success, fail) {
        return cordova.exec(function(args) {
            success(args);
        }, function(args) {
            fail(args);
        }, 'WebIntentPlugin', 'hasExtra', [params]);
    };

    WebIntent.prototype.saveImage = function(b64String, params, win, fail) {
        return cordova.exec(win, fail, "WebIntentPlugin", "saveImage", [b64String, params]);
    };

    WebIntent.prototype.createAccount = function(params, win, fail) {
        return cordova.exec(win, fail, "WebIntentPlugin", "createAccount", [params]);
    };

    WebIntent.prototype.getUri = function(success, fail) {
        return cordova.exec(function(args) {
            success(args);
        }, function(args) {
            fail(args);
        }, 'WebIntentPlugin', 'getUri', []);
    };

    WebIntent.prototype.getExtra = function(params, success, fail) {
        return cordova.exec(function(args) {
            success(args);
        }, function(args) {
            fail(args);
        }, 'WebIntentPlugin', 'getExtra', [params]);
    };

    WebIntent.prototype.getAccounts = function(params, success, fail) {
        return cordova.exec(function(args) {
            success(args);
        }, function(args) {
            fail(args);
        }, 'WebIntentPlugin', 'getAccounts', [params]);
    };

    WebIntent.prototype.clearCookies = function(params, success, fail) {
        return cordova.exec(function(args) {
            success(args);
        }, function(args) {
            fail(args);
        }, 'WebIntentPlugin', 'clearCookies', [params]);
    };


    WebIntent.prototype.onNewIntent = function(callback) {
        return cordova.exec(function(args) {
            callback(args);
        }, function(args) {
        }, 'WebIntentPlugin', 'onNewIntent', []);
    };

    WebIntent.prototype.sendBroadcast = function(params, success, fail) {
        return cordova.exec(function(args) {
            success(args);
        }, function(args) {
            fail(args);
        }, 'WebIntentPlugin', 'sendBroadcast', [params]);
    };


// 	var webintent = new WebIntent();
// 	return webintent;
// };

module.exports = new WebIntent();

