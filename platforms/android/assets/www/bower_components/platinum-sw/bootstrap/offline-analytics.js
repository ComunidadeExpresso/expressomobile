/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function(e){function i(){e.simpleDB.open(t).then(function(t){t.forEach(function(r,i){var s=Date.now()-i,o=r+"&qt="+s;console.log("About to replay:",o),e.fetch(o).then(function(e){if(e.status>=500)return Response.error();console.log("Replay succeeded:",o),t.delete(r)}).catch(function(e){s>n?(console.error("Replay failed, but the original request is too old to retry any further. Error:",e),t.delete(r)):console.error("Replay failed, and will be retried the next time the service worker starts. Error:",e)})})})}function s(n){console.log("Queueing failed request:",n),e.simpleDB.open(t).then(function(e){e.set(n.url,Date.now())})}function o(t){return e.fetch(t).then(function(e){return e.status>=500?Response.error():e}).catch(function(){s(t)})}var t="offline-analytics",n=864e5,r=/https?:\/\/((www|ssl)\.)?google-analytics\.com/;e.toolbox.router.get("/collect",o,{origin:r}),e.toolbox.router.get("/analytics.js",e.toolbox.networkFirst,{origin:r}),i()})(self);