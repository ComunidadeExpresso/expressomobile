/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function(e){e.flushAsynchronousOperations=function(){Polymer.dom.flush(),window.CustomElements&&window.CustomElements.takeRecords()},e.forceXIfStamp=function(t){var n=Polymer.dom(t.root).querySelectorAll("template[is=dom-if]");for(var r,i=0;r=n[i];i++)r.render();e.flushAsynchronousOperations()},e.fireEvent=function(e,t,n){var r=new CustomEvent(e,{bubbles:!0,cancelable:!0});for(p in t)r[p]=t[p];n.dispatchEvent(r)}})(this);