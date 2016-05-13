cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.raynetcrm.janiczek.fork.externalfileutil/www/ExternalFileUtil.js",
        "id": "com.raynetcrm.janiczek.fork.externalfileutil.ExternalFileUtil",
        "clobbers": [
            "window.ExternalFileUtil"
        ]
    },
    {
        "file": "plugins/com.phonegap.plugins.expresso/www/ExpressoPlugin.js",
        "id": "com.phonegap.plugins.expresso.ExpressoPlugin"
    },
    {
        "file": "plugins/com.phonegap.plugins.webintent/www/webintent.js",
        "id": "com.phonegap.plugins.webintent.WebIntent"
    },
    {
        "file": "plugins/org.apache.cordova.network-information/www/network.js",
        "id": "org.apache.cordova.network-information.network",
        "clobbers": [
            "navigator.connection",
            "navigator.network.connection"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.network-information/www/Connection.js",
        "id": "org.apache.cordova.network-information.Connection",
        "clobbers": [
            "Connection"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/www/CameraConstants.js",
        "id": "cordova-plugin-camera.Camera",
        "clobbers": [
            "Camera"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/www/CameraPopoverOptions.js",
        "id": "cordova-plugin-camera.CameraPopoverOptions",
        "clobbers": [
            "CameraPopoverOptions"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/www/Camera.js",
        "id": "cordova-plugin-camera.camera",
        "clobbers": [
            "navigator.camera"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/www/CameraPopoverHandle.js",
        "id": "cordova-plugin-camera.CameraPopoverHandle",
        "clobbers": [
            "CameraPopoverHandle"
        ]
    },
    {
        "file": "plugins/com.red_folder.phonegap.plugin.backgroundservice/www/backgroundService.js",
        "id": "com.red_folder.phonegap.plugin.backgroundservice.BackgroundService"
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.raynetcrm.janiczek.fork.externalfileutil": "1.0.0",
    "com.phonegap.plugins.expresso": "2.0.0",
    "com.phonegap.plugins.webintent": "2.0.0",
    "org.apache.cordova.network-information": "0.2.15",
    "cordova-plugin-whitelist": "1.2.2",
    "cordova-plugin-camera": "2.2.0",
    "com.red_folder.phonegap.plugin.backgroundservice": "2.0.0",
    "cordova-plugin-compat": "1.0.0"
}
// BOTTOM OF METADATA
});