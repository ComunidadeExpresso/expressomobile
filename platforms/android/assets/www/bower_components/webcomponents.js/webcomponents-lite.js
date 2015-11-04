/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

window.WebComponents=window.WebComponents||{},function(e){var t=e.flags||{},n="webcomponents.js",r=document.querySelector('script[src*="'+n+'"]');if(!t.noOpts){location.search.slice(1).split("&").forEach(function(e){e=e.split("="),e[0]&&(t[e[0]]=e[1]||!0)});if(r)for(var i=0,s;s=r.attributes[i];i++)s.name!=="src"&&(t[s.name]=s.value||!0);if(t.log){var o=t.log.split(",");t.log={},o.forEach(function(e){t.log[e]=!0})}else t.log={}}t.shadow=t.shadow||t.shadowdom||t.polyfill,t.shadow==="native"?t.shadow=!1:t.shadow=t.shadow||!HTMLElement.prototype.createShadowRoot,t.register&&(window.CustomElements=window.CustomElements||{flags:{}},window.CustomElements.flags.register=t.register),e.flags=t}(WebComponents),function(e){function u(e){o.push(e),s||(s=!0,n(f))}function a(e){return window.ShadowDOMPolyfill&&window.ShadowDOMPolyfill.wrapIfNeeded(e)||e}function f(){s=!1;var e=o;o=[],e.sort(function(e,t){return e.uid_-t.uid_});var t=!1;e.forEach(function(e){var n=e.takeRecords();l(e),n.length&&(e.callback_(n,e),t=!0)}),t&&f()}function l(e){e.nodes_.forEach(function(n){var r=t.get(n);if(!r)return;r.forEach(function(t){t.observer===e&&t.removeTransientObservers()})})}function c(e,n){for(var r=e;r;r=r.parentNode){var i=t.get(r);if(i)for(var s=0;s<i.length;s++){var o=i[s],u=o.options;if(r!==e&&!u.subtree)continue;var a=n(u);a&&o.enqueue(a)}}}function p(e){this.callback_=e,this.nodes_=[],this.records_=[],this.uid_=++h}function d(e,t){this.type=e,this.target=t,this.addedNodes=[],this.removedNodes=[],this.previousSibling=null,this.nextSibling=null,this.attributeName=null,this.attributeNamespace=null,this.oldValue=null}function v(e){var t=new d(e.type,e.target);return t.addedNodes=e.addedNodes.slice(),t.removedNodes=e.removedNodes.slice(),t.previousSibling=e.previousSibling,t.nextSibling=e.nextSibling,t.attributeName=e.attributeName,t.attributeNamespace=e.attributeNamespace,t.oldValue=e.oldValue,t}function y(e,t){return m=new d(e,t)}function b(e){return g?g:(g=v(m),g.oldValue=e,g)}function w(){m=g=undefined}function E(e){return e===g||e===m}function S(e,t){return e===t?e:g&&E(e)?g:null}function x(e,t,n){this.observer=e,this.target=t,this.options=n,this.transientObservedNodes=[]}var t=new WeakMap,n;if(/Trident|Edge/.test(navigator.userAgent))n=setTimeout;else if(window.setImmediate)n=window.setImmediate;else{var r=[],i=String(Math.random());window.addEventListener("message",function(e){if(e.data===i){var t=r;r=[],t.forEach(function(e){e()})}}),n=function(e){r.push(e),window.postMessage(i,"*")}}var s=!1,o=[],h=0;p.prototype={observe:function(e,n){e=a(e);if(!n.childList&&!n.attributes&&!n.characterData||n.attributeOldValue&&!n.attributes||n.attributeFilter&&n.attributeFilter.length&&!n.attributes||n.characterDataOldValue&&!n.characterData)throw new SyntaxError;var r=t.get(e);r||t.set(e,r=[]);var i;for(var s=0;s<r.length;s++)if(r[s].observer===this){i=r[s],i.removeListeners(),i.options=n;break}i||(i=new x(this,e,n),r.push(i),this.nodes_.push(e)),i.addListeners()},disconnect:function(){this.nodes_.forEach(function(e){var n=t.get(e);for(var r=0;r<n.length;r++){var i=n[r];if(i.observer===this){i.removeListeners(),n.splice(r,1);break}}},this),this.records_=[]},takeRecords:function(){var e=this.records_;return this.records_=[],e}};var m,g;x.prototype={enqueue:function(e){var t=this.observer.records_,n=t.length;if(t.length>0){var r=t[n-1],i=S(r,e);if(i){t[n-1]=i;return}}else u(this.observer);t[n]=e},addListeners:function(){this.addListeners_(this.target)},addListeners_:function(e){var t=this.options;t.attributes&&e.addEventListener("DOMAttrModified",this,!0),t.characterData&&e.addEventListener("DOMCharacterDataModified",this,!0),t.childList&&e.addEventListener("DOMNodeInserted",this,!0),(t.childList||t.subtree)&&e.addEventListener("DOMNodeRemoved",this,!0)},removeListeners:function(){this.removeListeners_(this.target)},removeListeners_:function(e){var t=this.options;t.attributes&&e.removeEventListener("DOMAttrModified",this,!0),t.characterData&&e.removeEventListener("DOMCharacterDataModified",this,!0),t.childList&&e.removeEventListener("DOMNodeInserted",this,!0),(t.childList||t.subtree)&&e.removeEventListener("DOMNodeRemoved",this,!0)},addTransientObserver:function(e){if(e===this.target)return;this.addListeners_(e),this.transientObservedNodes.push(e);var n=t.get(e);n||t.set(e,n=[]),n.push(this)},removeTransientObservers:function(){var e=this.transientObservedNodes;this.transientObservedNodes=[],e.forEach(function(e){this.removeListeners_(e);var n=t.get(e);for(var r=0;r<n.length;r++)if(n[r]===this){n.splice(r,1);break}},this)},handleEvent:function(e){e.stopImmediatePropagation();switch(e.type){case"DOMAttrModified":var t=e.attrName,n=e.relatedNode.namespaceURI,r=e.target,i=new y("attributes",r);i.attributeName=t,i.attributeNamespace=n;var s=e.attrChange===MutationEvent.ADDITION?null:e.prevValue;c(r,function(e){if(!e.attributes)return;if(e.attributeFilter&&e.attributeFilter.length&&e.attributeFilter.indexOf(t)===-1&&e.attributeFilter.indexOf(n)===-1)return;return e.attributeOldValue?b(s):i});break;case"DOMCharacterDataModified":var r=e.target,i=y("characterData",r),s=e.prevValue;c(r,function(e){if(!e.characterData)return;return e.characterDataOldValue?b(s):i});break;case"DOMNodeRemoved":this.addTransientObserver(e.target);case"DOMNodeInserted":var o=e.target,u,a;e.type==="DOMNodeInserted"?(u=[o],a=[]):(u=[],a=[o]);var f=o.previousSibling,l=o.nextSibling,i=y("childList",e.target.parentNode);i.addedNodes=u,i.removedNodes=a,i.previousSibling=f,i.nextSibling=l,c(e.relatedNode,function(e){if(!e.childList)return;return i})}w()}},e.JsMutationObserver=p,e.MutationObserver||(e.MutationObserver=p)}(this),typeof WeakMap=="undefined"&&function(){var e=Object.defineProperty,t=Date.now()%1e9,n=function(){this.name="__st"+(Math.random()*1e9>>>0)+(t++ +"__")};n.prototype={set:function(t,n){var r=t[this.name];return r&&r[0]===t?r[1]=n:e(t,this.name,{value:[t,n],writable:!0}),this},get:function(e){var t;return(t=e[this.name])&&t[0]===e?t[1]:undefined},"delete":function(e){var t=e[this.name];return!t||t[0]!==e?!1:(t[0]=t[1]=undefined,!0)},has:function(e){var t=e[this.name];return t?t[0]===e:!1}},window.WeakMap=n}(),window.HTMLImports=window.HTMLImports||{flags:{}},function(e){function a(e,t){t=t||s,h(function(){d(e,t)},t)}function c(e){return e.readyState==="complete"||e.readyState===f}function h(e,t){if(!c(t)){var n=function(){if(t.readyState==="complete"||t.readyState===f)t.removeEventListener(l,n),h(e,t)};t.addEventListener(l,n)}else e&&e()}function p(e){e.target.__loaded=!0}function d(e,t){function s(t){r==i&&e&&e()}function o(e){p(e),r++,s()}var n=t.querySelectorAll("link[rel=import]"),r=0,i=n.length;if(i)for(var u=0,a;u<i&&(a=n[u]);u++)v(a)?o.call(a,{target:a}):(a.addEventListener("load",o),a.addEventListener("error",o));else s()}function v(e){return n?e.__loaded||e.import&&e.import.readyState!=="loading":e.__importParsed}var t="import",n=Boolean(t in document.createElement("link")),r=Boolean(window.ShadowDOMPolyfill),i=function(e){return r?ShadowDOMPolyfill.wrapIfNeeded(e):e},s=i(document),o={get:function(){var e=HTMLImports.currentScript||document.currentScript||(document.readyState!=="complete"?document.scripts[document.scripts.length-1]:null);return i(e)},configurable:!0};Object.defineProperty(document,"_currentScript",o),Object.defineProperty(s,"_currentScript",o);var u=/Trident|Edge/.test(navigator.userAgent),f=u?"complete":"interactive",l="readystatechange";if(n){(new MutationObserver(function(e){for(var t=0,n=e.length,r;t<n&&(r=e[t]);t++)r.addedNodes&&m(r.addedNodes)})).observe(document.head,{childList:!0});function m(e){for(var t=0,n=e.length,r;t<n&&(r=e[t]);t++)g(r)&&y(r)}function g(e){return e.localName==="link"&&e.rel==="import"}function y(e){var t=e.import;t?p({target:e}):(e.addEventListener("load",p),e.addEventListener("error",p))}(function(){if(document.readyState==="loading"){var e=document.querySelectorAll("link[rel=import]");for(var t=0,n=e.length,r;t<n&&(r=e[t]);t++)y(r)}})()}a(function(){HTMLImports.ready=!0,HTMLImports.readyTime=(new Date).getTime();var e=s.createEvent("CustomEvent");e.initCustomEvent("HTMLImportsLoaded",!0,!0,{}),s.dispatchEvent(e)}),e.IMPORT_LINK_TYPE=t,e.useNative=n,e.rootDocument=s,e.whenReady=a,e.isIE=u}(HTMLImports),function(e){var t=[],n=function(e){t.push(e)},r=function(){t.forEach(function(t){t(e)})};e.addModule=n,e.initializeModules=r}(HTMLImports),HTMLImports.addModule(function(e){var t=/(url\()([^)]*)(\))/g,n=/(@import[\s]+(?!url\())([^;]*)(;)/g,r={resolveUrlsInStyle:function(e){var t=e.ownerDocument,n=t.createElement("a");return e.textContent=this.resolveUrlsInCssText(e.textContent,n),e},resolveUrlsInCssText:function(e,r){var i=this.replaceUrls(e,r,t);return i=this.replaceUrls(i,r,n),i},replaceUrls:function(e,t,n){return e.replace(n,function(e,n,r,i){var s=r.replace(/["']/g,"");return t.href=s,s=t.href,n+"'"+s+"'"+i})}};e.path=r}),HTMLImports.addModule(function(e){var t={async:!0,ok:function(e){return e.status>=200&&e.status<300||e.status===304||e.status===0},load:function(n,r,i){var s=new XMLHttpRequest;if(e.flags.debug||e.flags.bust)n+="?"+Math.random();return s.open("GET",n,t.async),s.addEventListener("readystatechange",function(e){if(s.readyState===4){var n=s.getResponseHeader("Location"),o=null;if(n)var o=n.substr(0,1)==="/"?location.origin+n:n;r.call(i,!t.ok(s)&&s,s.response||s.responseText,o)}}),s.send(),s},loadDocument:function(e,t,n){this.load(e,t,n).responseType="document"}};e.xhr=t}),HTMLImports.addModule(function(e){var t=e.xhr,n=e.flags,r=function(e,t){this.cache={},this.onload=e,this.oncomplete=t,this.inflight=0,this.pending={}};r.prototype={addNodes:function(e){this.inflight+=e.length;for(var t=0,n=e.length,r;t<n&&(r=e[t]);t++)this.require(r);this.checkDone()},addNode:function(e){this.inflight++,this.require(e),this.checkDone()},require:function(e){var t=e.src||e.href;e.__nodeUrl=t,this.dedupe(t,e)||this.fetch(t,e)},dedupe:function(e,t){if(this.pending[e])return this.pending[e].push(t),!0;var n;return this.cache[e]?(this.onload(e,t,this.cache[e]),this.tail(),!0):(this.pending[e]=[t],!1)},fetch:function(e,r){n.load&&console.log("fetch",e,r);if(!e)setTimeout(function(){this.receive(e,r,{error:"href must be specified"},null)}.bind(this),0);else if(e.match(/^data:/)){var i=e.split(","),s=i[0],o=i[1];s.indexOf(";base64")>-1?o=atob(o):o=decodeURIComponent(o),setTimeout(function(){this.receive(e,r,null,o)}.bind(this),0)}else{var u=function(t,n,i){this.receive(e,r,t,n,i)}.bind(this);t.load(e,u)}},receive:function(e,t,n,r,i){this.cache[e]=r;var s=this.pending[e];for(var o=0,u=s.length,a;o<u&&(a=s[o]);o++)this.onload(e,a,r,n,i),this.tail();this.pending[e]=null},tail:function(){--this.inflight,this.checkDone()},checkDone:function(){this.inflight||this.oncomplete()}},e.Loader=r}),HTMLImports.addModule(function(e){var t=function(e){this.addCallback=e,this.mo=new MutationObserver(this.handler.bind(this))};t.prototype={handler:function(e){for(var t=0,n=e.length,r;t<n&&(r=e[t]);t++)r.type==="childList"&&r.addedNodes.length&&this.addedNodes(r.addedNodes)},addedNodes:function(e){this.addCallback&&this.addCallback(e);for(var t=0,n=e.length,r,i;t<n&&(r=e[t]);t++)r.children&&r.children.length&&this.addedNodes(r.children)},observe:function(e){this.mo.observe(e,{childList:!0,subtree:!0})}},e.Observer=t}),HTMLImports.addModule(function(e){function a(e){return e.localName==="link"&&e.rel===s}function f(e){var t=l(e);return"data:text/javascript;charset=utf-8,"+encodeURIComponent(t)}function l(e){return e.textContent+c(e)}function c(e){var t=e.ownerDocument;t.__importedScripts=t.__importedScripts||0;var n=e.ownerDocument.baseURI,r=t.__importedScripts?"-"+t.__importedScripts:"";return t.__importedScripts++,"\n//# sourceURL="+n+r+".js\n"}function h(e){var n=e.ownerDocument.createElement("style");return n.textContent=e.textContent,t.resolveUrlsInStyle(n),n}var t=e.path,n=e.rootDocument,r=e.flags,i=e.isIE,s=e.IMPORT_LINK_TYPE,o="link[rel="+s+"]",u={documentSelectors:o,importsSelectors:[o,"link[rel=stylesheet]","style","script:not([type])",'script[type="text/javascript"]'].join(","),map:{link:"parseLink",script:"parseScript",style:"parseStyle"},dynamicElements:[],parseNext:function(){var e=this.nextToParse();e&&this.parse(e)},parse:function(e){if(this.isParsed(e)){r.parse&&console.log("[%s] is already parsed",e.localName);return}var t=this[this.map[e.localName]];t&&(this.markParsing(e),t.call(this,e))},parseDynamic:function(e,t){this.dynamicElements.push(e),t||this.parseNext()},markParsing:function(e){r.parse&&console.log("parsing",e),this.parsingElement=e},markParsingComplete:function(e){e.__importParsed=!0,this.markDynamicParsingComplete(e),e.__importElement&&(e.__importElement.__importParsed=!0,this.markDynamicParsingComplete(e.__importElement)),this.parsingElement=null,r.parse&&console.log("completed",e)},markDynamicParsingComplete:function(e){var t=this.dynamicElements.indexOf(e);t>=0&&this.dynamicElements.splice(t,1)},parseImport:function(e){HTMLImports.__importsParsingHook&&HTMLImports.__importsParsingHook(e),e.import&&(e.import.__importParsed=!0),this.markParsingComplete(e),e.__resource&&!e.__error?e.dispatchEvent(new CustomEvent("load",{bubbles:!1})):e.dispatchEvent(new CustomEvent("error",{bubbles:!1}));if(e.__pending){var t;while(e.__pending.length)t=e.__pending.shift(),t&&t({target:e})}this.parseNext()},parseLink:function(e){a(e)?this.parseImport(e):(e.href=e.href,this.parseGeneric(e))},parseStyle:function(e){var t=e;e=h(e),e.__importElement=t,this.parseGeneric(e)},parseGeneric:function(e){this.trackElement(e),this.addElementToDocument(e)},rootImportForElement:function(e){var t=e;while(t.ownerDocument.__importLink)t=t.ownerDocument.__importLink;return t},addElementToDocument:function(e){var t=this.rootImportForElement(e.__importElement||e);t.parentNode.insertBefore(e,t)},trackElement:function(e,t){var n=this,r=function(r){t&&t(r),n.markParsingComplete(e),n.parseNext()};e.addEventListener("load",r),e.addEventListener("error",r);if(i&&e.localName==="style"){var s=!1;if(e.textContent.indexOf("@import")==-1)s=!0;else if(e.sheet){s=!0;var o=e.sheet.cssRules,u=o?o.length:0;for(var a=0,f;a<u&&(f=o[a]);a++)f.type===CSSRule.IMPORT_RULE&&(s=s&&Boolean(f.styleSheet))}s&&e.dispatchEvent(new CustomEvent("load",{bubbles:!1}))}},parseScript:function(t){var n=document.createElement("script");n.__importElement=t,n.src=t.src?t.src:f(t),e.currentScript=t,this.trackElement(n,function(t){n.parentNode.removeChild(n),e.currentScript=null}),this.addElementToDocument(n)},nextToParse:function(){return this._mayParse=[],!this.parsingElement&&(this.nextToParseInDoc(n)||this.nextToParseDynamic())},nextToParseInDoc:function(e,t){if(e&&this._mayParse.indexOf(e)<0){this._mayParse.push(e);var n=e.querySelectorAll(this.parseSelectorsForNode(e));for(var r=0,i=n.length,s=0,o;r<i&&(o=n[r]);r++)if(!this.isParsed(o)){if(this.hasResource(o))return a(o)?this.nextToParseInDoc(o.import,o):o;return}}return t},nextToParseDynamic:function(){return this.dynamicElements[0]},parseSelectorsForNode:function(e){var t=e.ownerDocument||e;return t===n?this.documentSelectors:this.importsSelectors},isParsed:function(e){return e.__importParsed},needsDynamicParsing:function(e){return this.dynamicElements.indexOf(e)>=0},hasResource:function(e){return a(e)&&e.import===undefined?!1:!0}};e.parser=u,e.IMPORT_SELECTOR=o}),HTMLImports.addModule(function(e){function l(e){return c(e,n)}function c(e,t){return e.localName==="link"&&e.getAttribute("rel")===t}function h(e){return!!Object.getOwnPropertyDescriptor(e,"baseURI")}function p(e,t){var r=document.implementation.createHTMLDocument(n);r._URL=t;var i=r.createElement("base");i.setAttribute("href",t),!r.baseURI&&!h(r)&&Object.defineProperty(r,"baseURI",{value:t});var s=r.createElement("meta");return s.setAttribute("charset","utf-8"),r.head.appendChild(s),r.head.appendChild(i),r.body.innerHTML=e,window.HTMLTemplateElement&&HTMLTemplateElement.bootstrap&&HTMLTemplateElement.bootstrap(r),r}var t=e.flags,n=e.IMPORT_LINK_TYPE,r=e.IMPORT_SELECTOR,i=e.rootDocument,s=e.Loader,o=e.Observer,u=e.parser,a={documents:{},documentPreloadSelectors:r,importsPreloadSelectors:[r].join(","),loadNode:function(e){f.addNode(e)},loadSubtree:function(e){var t=this.marshalNodes(e);f.addNodes(t)},marshalNodes:function(e){return e.querySelectorAll(this.loadSelectorsForNode(e))},loadSelectorsForNode:function(e){var t=e.ownerDocument||e;return t===i?this.documentPreloadSelectors:this.importsPreloadSelectors},loaded:function(e,n,r,i,s){t.load&&console.log("loaded",e,n),n.__resource=r,n.__error=i;if(l(n)){var o=this.documents[e];o===undefined&&(o=i?null:p(r,s||e),o&&(o.__importLink=n,this.bootDocument(o)),this.documents[e]=o),n.import=o}u.parseNext()},bootDocument:function(e){this.loadSubtree(e),this.observer.observe(e),u.parseNext()},loadedAll:function(){u.parseNext()}},f=new s(a.loaded.bind(a),a.loadedAll.bind(a));a.observer=new o;if(!document.baseURI){var d={get:function(){var e=document.querySelector("base");return e?e.href:window.location.href},configurable:!0};Object.defineProperty(document,"baseURI",d),Object.defineProperty(i,"baseURI",d)}e.importer=a,e.importLoader=f}),HTMLImports.addModule(function(e){var t=e.parser,n=e.importer,r={added:function(e){var r,i,s;for(var o=0,u=e.length,a;o<u&&(a=e[o]);o++)r||(r=a.ownerDocument,i=t.isParsed(r)),s=this.shouldLoadNode(a),s&&n.loadNode(a),this.shouldParseNode(a)&&i&&t.parseDynamic(a,s)},shouldLoadNode:function(e){return e.nodeType===1&&i.call(e,n.loadSelectorsForNode(e))},shouldParseNode:function(e){return e.nodeType===1&&i.call(e,t.parseSelectorsForNode(e))}};n.observer.addCallback=r.added.bind(r);var i=HTMLElement.prototype.matches||HTMLElement.prototype.matchesSelector||HTMLElement.prototype.webkitMatchesSelector||HTMLElement.prototype.mozMatchesSelector||HTMLElement.prototype.msMatchesSelector}),function(e){function i(){HTMLImports.importer.bootDocument(r)}var t=e.initializeModules,n=e.isIE;if(e.useNative)return;n&&typeof window.CustomEvent!="function"&&(window.CustomEvent=function(e,t){t=t||{};var n=document.createEvent("CustomEvent");return n.initCustomEvent(e,Boolean(t.bubbles),Boolean(t.cancelable),t.detail),n},window.CustomEvent.prototype=window.Event.prototype),t();var r=e.rootDocument;document.readyState==="complete"||document.readyState==="interactive"&&!window.attachEvent?i():document.addEventListener("DOMContentLoaded",i)}(HTMLImports),window.CustomElements=window.CustomElements||{flags:{}},function(e){var t=e.flags,n=[],r=function(e){n.push(e)},i=function(){n.forEach(function(t){t(e)})};e.addModule=r,e.initializeModules=i,e.hasNative=Boolean(document.registerElement),e.useNative=!t.register&&e.hasNative&&!window.ShadowDOMPolyfill&&(!window.HTMLImports||HTMLImports.useNative)}(CustomElements),CustomElements.addModule(function(e){function n(e,t){r(e,function(e){if(t(e))return!0;i(e,t)}),i(e,t)}function r(e,t,n){var i=e.firstElementChild;if(!i){i=e.firstChild;while(i&&i.nodeType!==Node.ELEMENT_NODE)i=i.nextSibling}while(i)t(i,n)!==!0&&r(i,t,n),i=i.nextElementSibling;return null}function i(e,t){var r=e.shadowRoot;while(r)n(r,t),r=r.olderShadowRoot}function o(e,t){s=[],u(e,t),s=null}function u(e,n){e=wrap(e);if(s.indexOf(e)>=0)return;s.push(e);var r=e.querySelectorAll("link[rel="+t+"]");for(var i=0,o=r.length,a;i<o&&(a=r[i]);i++)a.import&&u(a.import,n);n(e)}var t=window.HTMLImports?HTMLImports.IMPORT_LINK_TYPE:"none",s;e.forDocumentTree=o,e.forSubtree=n}),CustomElements.addModule(function(e){function i(e){return s(e)||o(e)}function s(t){if(e.upgrade(t))return!0;p(t)}function o(e){n(e,function(e){if(s(e))return!0})}function u(e){p(e),y(e)&&n(e,function(e){p(e)})}function c(e){l.push(e),f||(f=!0,setTimeout(h))}function h(){f=!1;var e=l;for(var t=0,n=e.length,r;t<n&&(r=e[t]);t++)r();l=[]}function p(e){a?c(function(){d(e)}):d(e)}function d(e){e.__upgraded__&&(e.attachedCallback||e.detachedCallback)&&!e.__attached&&y(e)&&(e.__attached=!0,e.attachedCallback&&e.attachedCallback())}function v(e){m(e),n(e,function(e){m(e)})}function m(e){a?c(function(){g(e)}):g(e)}function g(e){e.__upgraded__&&(e.attachedCallback||e.detachedCallback)&&e.__attached&&!y(e)&&(e.__attached=!1,e.detachedCallback&&e.detachedCallback())}function y(e){var t=e,n=wrap(document);while(t){if(t==n)return!0;t=t.parentNode||t.host}}function b(e){if(e.shadowRoot&&!e.shadowRoot.__watched){t.dom&&console.log("watching shadow-root for: ",e.localName);var n=e.shadowRoot;while(n)x(n),n=n.olderShadowRoot}}function w(e){if(t.dom){var n=e[0];if(n&&n.type==="childList"&&n.addedNodes&&n.addedNodes){var r=n.addedNodes[0];while(r&&r!==document&&!r.host)r=r.parentNode;var s=r&&(r.URL||r._URL||r.host&&r.host.localName)||"";s=s.split("/?").shift().split("/").pop()}console.group("mutations (%d) [%s]",e.length,s||"")}e.forEach(function(e){e.type==="childList"&&(S(e.addedNodes,function(e){if(!e.localName)return;i(e)}),S(e.removedNodes,function(e){if(!e.localName)return;v(e)}))}),t.dom&&console.groupEnd()}function E(e){e=wrap(e),e||(e=wrap(document));while(e.parentNode)e=e.parentNode;var t=e.__observer;t&&(w(t.takeRecords()),h())}function x(e){if(e.__observer)return;var t=new MutationObserver(w);t.observe(e,{childList:!0,subtree:!0}),e.__observer=t}function T(e){e=wrap(e),t.dom&&console.group("upgradeDocument: ",e.baseURI.split("/").pop()),i(e),x(e),t.dom&&console.groupEnd()}function N(e){r(e,T)}var t=e.flags,n=e.forSubtree,r=e.forDocumentTree,a=!window.MutationObserver||window.MutationObserver===window.JsMutationObserver;e.hasPolyfillMutations=a;var f=!1,l=[],S=Array.prototype.forEach.call.bind(Array.prototype.forEach),C=Element.prototype.createShadowRoot;C&&(Element.prototype.createShadowRoot=function(){var e=C.call(this);return CustomElements.watchShadow(this),e}),e.watchShadow=b,e.upgradeDocumentTree=N,e.upgradeSubtree=o,e.upgradeAll=i,e.attachedNode=u,e.takeRecords=E}),CustomElements.addModule(function(e){function n(t){if(!t.__upgraded__&&t.nodeType===Node.ELEMENT_NODE){var n=t.getAttribute("is"),i=e.getRegisteredDefinition(n||t.localName);if(i){if(n&&i.tag==t.localName)return r(t,i);if(!n&&!i.extends)return r(t,i)}}}function r(n,r){return t.upgrade&&console.group("upgrade:",n.localName),r.is&&n.setAttribute("is",r.is),i(n,r),n.__upgraded__=!0,o(n),e.attachedNode(n),e.upgradeSubtree(n),t.upgrade&&console.groupEnd(),n}function i(e,t){Object.__proto__?e.__proto__=t.prototype:(s(e,t.prototype,t.native),e.__proto__=t.prototype)}function s(e,t,n){var r={},i=t;while(i!==n&&i!==HTMLElement.prototype){var s=Object.getOwnPropertyNames(i);for(var o=0,u;u=s[o];o++)r[u]||(Object.defineProperty(e,u,Object.getOwnPropertyDescriptor(i,u)),r[u]=1);i=Object.getPrototypeOf(i)}}function o(e){e.createdCallback&&e.createdCallback()}var t=e.flags;e.upgrade=n,e.upgradeWithDefinition=r,e.implementPrototype=i}),CustomElements.addModule(function(e){function o(n,r){var i=r||{};if(!n)throw new Error("document.registerElement: first argument `name` must not be empty");if(n.indexOf("-")<0)throw new Error("document.registerElement: first argument ('name') must contain a dash ('-'). Argument provided was '"+String(n)+"'.");if(f(n))throw new Error("Failed to execute 'registerElement' on 'Document': Registration failed for type '"+String(n)+"'. The type name is invalid.");if(m(n))throw new Error("DuplicateDefinitionError: a type with name '"+String(n)+"' is already registered");return i.prototype||(i.prototype=Object.create(HTMLElement.prototype)),i.__name=n.toLowerCase(),i.lifecycle=i.lifecycle||{},i.ancestry=c(i.extends),h(i),p(i),u(i.prototype),g(i.__name,i),i.ctor=y(i),i.ctor.prototype=i.prototype,i.prototype.constructor=i.ctor,e.ready&&t(document),i.ctor}function u(e){if(e.setAttribute._polyfilled)return;var t=e.setAttribute;e.setAttribute=function(e,n){a.call(this,e,n,t)};var n=e.removeAttribute;e.removeAttribute=function(e){a.call(this,e,null,n)},e.setAttribute._polyfilled=!0}function a(e,t,n){e=e.toLowerCase();var r=this.getAttribute(e);n.apply(this,arguments);var i=this.getAttribute(e);this.attributeChangedCallback&&i!==r&&this.attributeChangedCallback(e,r,i)}function f(e){for(var t=0;t<l.length;t++)if(e===l[t])return!0}function c(e){var t=m(e);return t?c(t.extends).concat([t]):[]}function h(e){var t=e.extends;for(var n=0,r;r=e.ancestry[n];n++)t=r.is&&r.tag;e.tag=t||e.__name,t&&(e.is=e.__name)}function p(e){if(!Object.__proto__){var t=HTMLElement.prototype;if(e.is){var n=document.createElement(e.tag),r=Object.getPrototypeOf(n);r===e.prototype&&(t=r)}var i=e.prototype,s;while(i&&i!==t)s=Object.getPrototypeOf(i),i.__proto__=s,i=s;e.native=t}}function d(e){return r(x(e.tag),e)}function m(e){if(e)return v[e.toLowerCase()]}function g(e,t){v[e]=t}function y(e){return function(){return d(e)}}function w(e,t,n){return e===b?E(t,n):T(e,t)}function E(e,t){var n=m(t||e);if(n){if(e==n.tag&&t==n.is)return new n.ctor;if(!t&&!n.is)return new n.ctor}var r;return t?(r=E(e),r.setAttribute("is",t),r):(r=x(e),e.indexOf("-")>=0&&i(r,HTMLElement),r)}function S(e){var t=N.call(this,e);return n(t),t}var t=e.upgradeDocumentTree,n=e.upgrade,r=e.upgradeWithDefinition,i=e.implementPrototype,s=e.useNative,l=["annotation-xml","color-profile","font-face","font-face-src","font-face-uri","font-face-format","font-face-name","missing-glyph"],v={},b="http://www.w3.org/1999/xhtml",x=document.createElement.bind(document),T=document.createElementNS.bind(document),N=Node.prototype.cloneNode,C;!Object.__proto__&&!s?C=function(e,t){var n=e;while(n){if(n===t.prototype)return!0;n=n.__proto__}return!1}:C=function(e,t){return e instanceof t},document.registerElement=o,document.createElement=E,document.createElementNS=w,Node.prototype.cloneNode=S,e.registry=v,e.instanceof=C,e.reservedTagList=l,e.getRegisteredDefinition=m,document.register=document.registerElement}),function(e){function o(){s(wrap(document)),window.HTMLImports&&(HTMLImports.__importsParsingHook=function(e){s(wrap(e.import))}),CustomElements.ready=!0,setTimeout(function(){CustomElements.readyTime=Date.now(),window.HTMLImports&&(CustomElements.elapsed=CustomElements.readyTime-HTMLImports.readyTime),document.dispatchEvent(new CustomEvent("WebComponentsReady",{bubbles:!0}))})}var t=e.useNative,n=e.initializeModules,r=/Trident/.test(navigator.userAgent);if(t){var i=function(){};e.watchShadow=i,e.upgrade=i,e.upgradeAll=i,e.upgradeDocumentTree=i,e.upgradeSubtree=i,e.takeRecords=i,e.instanceof=function(e,t){return e instanceof t}}else n();var s=e.upgradeDocumentTree;window.wrap||(window.ShadowDOMPolyfill?(window.wrap=ShadowDOMPolyfill.wrapIfNeeded,window.unwrap=ShadowDOMPolyfill.unwrapIfNeeded):window.wrap=window.unwrap=function(e){return e}),r&&typeof window.CustomEvent!="function"&&(window.CustomEvent=function(e,t){t=t||{};var n=document.createEvent("CustomEvent");return n.initCustomEvent(e,Boolean(t.bubbles),Boolean(t.cancelable),t.detail),n},window.CustomEvent.prototype=window.Event.prototype);if(document.readyState==="complete"||e.flags.eager)o();else if(document.readyState==="interactive"&&!window.attachEvent&&(!window.HTMLImports||window.HTMLImports.ready))o();else{var u=window.HTMLImports&&!HTMLImports.ready?"HTMLImportsLoaded":"DOMContentLoaded";window.addEventListener(u,o)}}(window.CustomElements),typeof HTMLTemplateElement=="undefined"&&function(){var e="template";HTMLTemplateElement=function(){},HTMLTemplateElement.prototype=Object.create(HTMLElement.prototype),HTMLTemplateElement.decorate=function(e){if(!e.content){e.content=e.ownerDocument.createDocumentFragment();var t;while(t=e.firstChild)e.content.appendChild(t)}},HTMLTemplateElement.bootstrap=function(t){var n=t.querySelectorAll(e);for(var r=0,i=n.length,s;r<i&&(s=n[r]);r++)HTMLTemplateElement.decorate(s)},addEventListener("DOMContentLoaded",function(){HTMLTemplateElement.bootstrap(document)})}(),function(e){var t=document.createElement("style");t.textContent="body {transition: opacity ease-in 0.2s; } \nbody[unresolved] {opacity: 0; display: block; overflow: hidden; position: relative; } \n";var n=document.querySelector("head");n.insertBefore(t,n.firstChild)}(window.WebComponents);