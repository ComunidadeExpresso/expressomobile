/*
 * GLEffectsManager is a part of HTML GL library for applying effects based on tag attributes
 * Copyright (c) 2015 pixelscommander.com
 * Distributed under MIT license
 * http://htmlgl.com
 * */

(function(e){var t=function(e){this.element=e,this.filters=[],this.updateFiltersFromAttribute()},n=t.prototype;n.updateFiltersFromAttribute=function(){var e=this.element.getAttribute("effects")||"",t=e.split(" "),n=this;t.forEach(function(e){HTMLGL.effects[e]&&new HTMLGL.effects[e](n.element)})},n.cleanFiltersFromAttribute=function(){},e.HTMLGL.GLEffectsManager=t,e.HTMLGL.elements.forEach(function(e){e.initEffects()})})(window);