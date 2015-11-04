(function(){if(typeof self!="undefined"&&!self.Prism||typeof global!="undefined"&&!global.Prism)return;var e={css:!0,less:!0,sass:[{lang:"sass",inside:"inside",before:"punctuation",root:Prism.languages.sass&&Prism.languages.sass["variable-line"]},{lang:"sass",inside:"inside",root:Prism.languages.sass&&Prism.languages.sass["property-line"]}],scss:!0,stylus:[{lang:"stylus",before:"hexcode",inside:"rest",root:Prism.languages.stylus&&Prism.languages.stylus["property-declaration"].inside},{lang:"stylus",before:"hexcode",inside:"rest",root:Prism.languages.stylus&&Prism.languages.stylus["variable-declaration"].inside}]};Prism.hooks.add("before-highlight",function(t){if(t.language&&e[t.language]&&!e[t.language].initialized){var n=e[t.language];Prism.util.type(n)!=="Array"&&(n=[n]),n.forEach(function(n){var r,i,s,o;n===!0?(r="important",i=t.language,n=t.language):(r=n.before||"important",i=n.inside||n.lang,s=n.root||Prism.languages,o=n.skip,n=t.language),!o&&Prism.languages[n]&&(Prism.languages.insertBefore(i,r,{easing:/\bcubic-bezier\((?:-?\d*\.?\d+,\s*){3}-?\d*\.?\d+\)\B|\b(?:linear|ease(?:-in)?(?:-out)?)(?=\s|[;}]|$)/i},s),t.grammar=Prism.languages[n],e[t.language]={initialized:!0})})}}),Prism.plugins.Previewer&&new Prism.plugins.Previewer("easing",function(e){e={linear:"0,0,1,1",ease:".25,.1,.25,1","ease-in":".42,0,1,1","ease-out":"0,0,.58,1","ease-in-out":".42,0,.58,1"}[e]||e;var t=e.match(/-?\d*\.?\d+/g);if(t.length===4){t=t.map(function(e,t){return(t%2?1-e:e)*100}),this.querySelector("path").setAttribute("d","M0,100 C"+t[0]+","+t[1]+", "+t[2]+","+t[3]+", 100,0");var n=this.querySelectorAll("line");return n[0].setAttribute("x2",t[0]),n[0].setAttribute("y2",t[1]),n[1].setAttribute("x2",t[2]),n[1].setAttribute("y2",t[3]),!0}return!1},"*",function(){this._elt.innerHTML='<svg viewBox="-20 -20 140 140" width="100" height="100"><defs><marker id="prism-previewer-easing-marker" viewBox="0 0 4 4" refX="2" refY="2" markerUnits="strokeWidth"><circle cx="2" cy="2" r="1.5" /></marker></defs><path d="M0,100 C20,50, 40,30, 100,0" /><line x1="0" y1="100" x2="20" y2="50" marker-start="url('+location.href+'#prism-previewer-easing-marker)" marker-end="url('+location.href+'#prism-previewer-easing-marker)" />'+'<line x1="100" y1="0" x2="40" y2="30" marker-start="url('+location.href+'#prism-previewer-easing-marker)" marker-end="url('+location.href+'#prism-previewer-easing-marker)" />'+"</svg>"})})();