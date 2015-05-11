
	var ExpressoPlugin = function() {

    };

    ExpressoPlugin.prototype.saveImage = function(b64String, params, win, fail) {
        return cordova.exec(win, fail, "ExpressoPlugin", "saveImage", [b64String, params]);
    };

    ExpressoPlugin.prototype.createAccount = function(params, win, fail) {
        return cordova.exec(win, fail, "ExpressoPlugin", "createAccount", [params]);
    };

    ExpressoPlugin.prototype.getAccounts = function(params, success, fail) {
        return cordova.exec(function(args) {
            success(args);
        }, function(args) {
            fail(args);
        }, 'ExpressoPlugin', 'getAccounts', [params]);
    };

    module.exports = new ExpressoPlugin();

