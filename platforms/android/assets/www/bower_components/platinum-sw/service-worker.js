/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function(e){function n(e){return new Map(e.split("&").map(function(e){var t=e.split("="),n=decodeURIComponent(t[0]),r=decodeURIComponent(t[1]);return r.indexOf(",")>=0&&(r=r.split(",")),[n,r]}))}var t="1.0";e.params=n(location.search.substring(1));if(e.params.get("version")!==t)throw"The registered script is version "+t+" and cannot be used with <platinum-sw-register> version "+e.params.get("version");if(e.params.has("importscript")){var r=e.params.get("importscript");Array.isArray(r)?importScripts.apply(null,r):importScripts(r)}e.params.get("skipWaiting")==="true"&&e.skipWaiting&&e.addEventListener("install",function(t){t.waitUntil(e.skipWaiting())}),e.params.get("clientsClaim")==="true"&&e.clients&&e.clients.claim&&e.addEventListener("activate",function(t){t.waitUntil(e.clients.claim())})})(self);