/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function(e){var t=(new URL("../sw-toolbox/sw-toolbox.js",e.params.get("baseURI"))).href;importScripts(t);var n=e.params.get("cacheId");n&&(e.toolbox.options.cacheName=n+"$$$"+e.registration.scope);if(e.params.has("defaultCacheStrategy")){var r=e.params.get("defaultCacheStrategy");e.toolbox.router.default=e.toolbox[r]||e[r]}var i;e.params.has("precacheFingerprint")&&e.params.has("cacheConfigFile")?i=e.fetch(e.params.get("cacheConfigFile")).then(function(e){return e.json()}).then(function(e){return e.precache||[]}).catch(function(e){return[]}).then(function(t){return t.concat(e.params.get("precache"))}):i=Promise.resolve(e.params.get("precache")),e.toolbox.precache(i);if(e.params.has("route")){var s=e.params.get("route");while(s.length>0){var o=s.splice(0,3),u;o[2]&&(u={origin:new RegExp(o[2])});var a=e.toolbox[o[1]]||e[o[1]];typeof a=="function"?e.toolbox.router.get(o[0],a,u):console.error("Unable to register sw-toolbox route: ",o)}}})(self);