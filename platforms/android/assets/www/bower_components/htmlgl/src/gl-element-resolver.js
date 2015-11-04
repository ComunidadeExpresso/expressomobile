/*
 * GLElementResolver is a part of HTML GL library for resolving elements by coordinates given
 * Copyright (c) 2015 pixelscommander.com
 * Distributed under MIT license
 * http://htmlgl.com
 * */

(function(e){var t=function(e){},n=t.prototype;n.getElementByCoordinates=function(t,n){var r,i=this,s;return e.HTMLGL.elements.forEach(function(e){r=document.elementFromPoint(t-parseInt(e.transformObject.translateX||0),n-parseInt(e.transformObject.translateY||0)),i.isChildOf(r,e)&&(s=r)}),s},n.isChildOf=function(e,t){var n=e;while(n){if(n===t)return!0;n=n.parentNode}return!1},e.HTMLGL.GLElementResolver=t})(window);