cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.apache.cordova.camera/www/CameraConstants.js",
        "id": "org.apache.cordova.camera.Camera",
        "clobbers": [
            "Camera"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.camera/www/CameraPopoverOptions.js",
        "id": "org.apache.cordova.camera.CameraPopoverOptions",
        "clobbers": [
            "CameraPopoverOptions"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.camera/www/Camera.js",
        "id": "org.apache.cordova.camera.camera",
        "clobbers": [
            "navigator.camera"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.camera/www/CameraPopoverHandle.js",
        "id": "org.apache.cordova.camera.CameraPopoverHandle",
        "clobbers": [
            "CameraPopoverHandle"
        ]
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
        "file": "plugins/com.phonegap.plugins.backgroundservice/www/backgroundservice.js",
        "id": "com.phonegap.plugins.backgroundservice.BackgroundService",
        "clobbers": [
            "BackgroundService"
        ]
    },
    {
         "file": "plugins/com.phonegap.plugins.webintent/www/webintent.js",
         "id": "com.phonegap.plugins.webintent.WebIntent",
         "clobbers": [
             "WebIntent"
         ]
    },
    {
         "file": "plugins/com.phonegap.plugins.expresso/www/ExpressoPlugin.js",
         "id": "com.phonegap.plugins.expresso.ExpressoPlugin",
         "clobbers": [
             "ExpressoPlugin"
         ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "org.apache.cordova.camera": "0.3.6",
    "org.apache.cordova.network-information": "0.2.15",
    "com.phonegap.plugins.backgroundservice": "2.0.0",
    "com.phonegap.plugins.webintent": "1.0.0",
    "com.phonegap.plugins.expresso": "1.0.0"
}
// BOTTOM OF METADATA
});