/*
 * Util is a part of HTML GL library
 * Copyright (c) 2015 pixelscommander.com
 * Distributed under MIT license
 * http://htmlgl.com
 * */

(function(e){e.HTMLGL=e.HTMLGL||{},e.HTMLGL.util={getterSetter:function(e,t,n,r){Object.defineProperty?Object.defineProperty(e,t,{get:n,set:r}):document.__defineGetter__&&(e.__defineGetter__(t,n),e.__defineSetter__(t,r)),e["get"+t]=n,e["set"+t]=r},emitEvent:function(e,t){var n=new MouseEvent(t.type,t);n.dispatcher="html-gl",t.stopPropagation(),e.dispatchEvent(n)},debounce:function(e,t,n){var r;return function(){var i=this,s=arguments,o=function(){r=null,n||e.apply(i,s)},u=n&&!r;clearTimeout(r),r=setTimeout(o,t),u&&e.apply(i,s)}}}})(window);