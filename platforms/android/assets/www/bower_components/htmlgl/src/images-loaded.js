/*
 * ImagesLoaded is a part of HTML GL library which is a robust solution for determining "are images loaded or not?"
 * Copyright (c) 2015 pixelscommander.com
 * Distributed under MIT license
 * http://htmlgl.com
 * */

(function(e){var t=function(e,t){this.element=e,this.images=this.element.querySelectorAll("img"),this.callback=t,this.imagesLoaded=this.getImagesLoaded(),this.images.length===this.imagesLoaded?this.onImageLoaded():this.addListeners()},n=t.prototype;n.getImagesLoaded=function(){var e=0;for(var t=0;t<this.images.length;t++)this.images[t].complete===!0&&e++;return e},n.addListeners=function(){var e=0;for(var t=0;t<this.images.length;t++)this.images[t].complete!==!0&&(this.images[t].addEventListener("load",this.onImageLoaded.bind(this)),this.images[t].addEventListener("error",this.onImageLoaded.bind(this)));return e},n.onImageLoaded=function(){this.imagesLoaded++,this.images.length-this.imagesLoaded<=0&&setTimeout(this.callback,0)},e.HTMLGL.ImagesLoaded=t})(window);