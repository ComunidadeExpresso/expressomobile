/*!
 * jQuery Browser Plugin 0.0.8
 * https://github.com/gabceb/jquery-browser-plugin
 *
 * Original jquery-browser code Copyright 2005, 2015 jQuery Foundation, Inc. and other contributors
 * http://jquery.org/license
 *
 * Modifications Copyright 2015 Gabriel Cebrian
 * https://github.com/gabceb
 *
 * Released under the MIT license
 *
 * Date: 05-07-2015
 */

(function(e){typeof define=="function"&&define.amd?define(["jquery"],function(t){return e(t)}):typeof module=="object"&&typeof module.exports=="object"?module.exports=e(require("jquery")):e(window.jQuery)})(function(e){"use strict";function t(e){e===undefined&&(e=window.navigator.userAgent),e=e.toLowerCase();var t=/(edge)\/([\w.]+)/.exec(e)||/(opr)[\/]([\w.]+)/.exec(e)||/(chrome)[ \/]([\w.]+)/.exec(e)||/(version)(applewebkit)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(e)||/(webkit)[ \/]([\w.]+).*(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(e)||/(webkit)[ \/]([\w.]+)/.exec(e)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e)||/(msie) ([\w.]+)/.exec(e)||e.indexOf("trident")>=0&&/(rv)(?::| )([\w.]+)/.exec(e)||e.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e)||[],n=/(ipad)/.exec(e)||/(ipod)/.exec(e)||/(iphone)/.exec(e)||/(kindle)/.exec(e)||/(silk)/.exec(e)||/(android)/.exec(e)||/(windows phone)/.exec(e)||/(win)/.exec(e)||/(mac)/.exec(e)||/(linux)/.exec(e)||/(cros)/.exec(e)||/(playbook)/.exec(e)||/(bb)/.exec(e)||/(blackberry)/.exec(e)||[],r={},i={browser:t[5]||t[3]||t[1]||"",version:t[2]||t[4]||"0",versionNumber:t[4]||t[2]||"0",platform:n[0]||""};i.browser&&(r[i.browser]=!0,r.version=i.version,r.versionNumber=parseInt(i.versionNumber,10)),i.platform&&(r[i.platform]=!0);if(r.android||r.bb||r.blackberry||r.ipad||r.iphone||r.ipod||r.kindle||r.playbook||r.silk||r["windows phone"])r.mobile=!0;if(r.cros||r.mac||r.linux||r.win)r.desktop=!0;if(r.chrome||r.opr||r.safari)r.webkit=!0;if(r.rv||r.edge){var s="msie";i.browser=s,r[s]=!0}if(r.safari&&r.blackberry){var o="blackberry";i.browser=o,r[o]=!0}if(r.safari&&r.playbook){var u="playbook";i.browser=u,r[u]=!0}if(r.bb){var a="blackberry";i.browser=a,r[a]=!0}if(r.opr){var f="opera";i.browser=f,r[f]=!0}if(r.safari&&r.android){var l="android";i.browser=l,r[l]=!0}if(r.safari&&r.kindle){var c="kindle";i.browser=c,r[c]=!0}if(r.safari&&r.silk){var h="silk";i.browser=h,r[h]=!0}return r.name=i.browser,r.platform=i.platform,r}return window.jQBrowser=t(window.navigator.userAgent),window.jQBrowser.uaMatch=t,e&&(e.browser=window.jQBrowser),window.jQBrowser});