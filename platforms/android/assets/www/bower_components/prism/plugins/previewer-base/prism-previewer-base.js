(function(){if(typeof self=="undefined"||!self.Prism||!self.document)return;var e=function(e){var t=0,n=0,r=e;if(r.parentNode){do t+=r.offsetLeft,n+=r.offsetTop;while((r=r.offsetParent)&&r.nodeType<9);r=e;do t-=r.scrollLeft,n-=r.scrollTop;while((r=r.parentNode)&&!/body/i.test(r.nodeName))}return{top:n,right:innerWidth-t-e.offsetWidth,bottom:innerHeight-n-e.offsetHeight,left:t}},t=/(?:^|\s)token(?=$|\s)/,n=/(?:^|\s)active(?=$|\s)/g,r=/(?:^|\s)flipped(?=$|\s)/g,i=function(e,t,n,r){this._elt=null,this._type=e,this._clsRegexp=RegExp("(?:^|\\s)"+e+"(?=$|\\s)"),this._token=null,this.updater=t,this._mouseout=this.mouseout.bind(this),this.initializer=r;var s=this;n||(n=["*"]),Prism.util.type(n)!=="Array"&&(n=[n]),n.forEach(function(e){typeof e!="string"&&(e=e.lang),i.byLanguages[e]||(i.byLanguages[e]=[]),i.byLanguages[e].indexOf(s)<0&&i.byLanguages[e].push(s)}),i.byType[e]=this};i.prototype.init=function(){if(this._elt)return;this._elt=document.createElement("div"),this._elt.className="prism-previewer prism-previewer-"+this._type,document.body.appendChild(this._elt),this.initializer&&this.initializer()},i.prototype.check=function(e){do if(t.test(e.className)&&this._clsRegexp.test(e.className))break;while(e=e.parentNode);e&&e!==this._token&&(this._token=e,this.show())},i.prototype.mouseout=function(){this._token.removeEventListener("mouseout",this._mouseout,!1),this._token=null,this.hide()},i.prototype.show=function(){this._elt||this.init();if(!this._token)return;if(this.updater.call(this._elt,this._token.textContent)){this._token.addEventListener("mouseout",this._mouseout,!1);var t=e(this._token);this._elt.className+=" active",t.top-this._elt.offsetHeight>0?(this._elt.className=this._elt.className.replace(r,""),this._elt.style.top=t.top+"px",this._elt.style.bottom=""):(this._elt.className+=" flipped",this._elt.style.bottom=t.bottom+"px",this._elt.style.top=""),this._elt.style.left=t.left+Math.min(200,this._token.offsetWidth/2)+"px"}else this.hide()},i.prototype.hide=function(){this._elt.className=this._elt.className.replace(n,"")},i.byLanguages={},i.byType={},i.initEvents=function(e,t){var n=[];i.byLanguages[t]&&(n=n.concat(i.byLanguages[t])),i.byLanguages["*"]&&(n=n.concat(i.byLanguages["*"])),e.addEventListener("mouseover",function(e){var t=e.target;n.forEach(function(e){e.check(t)})},!1)},Prism.plugins.Previewer=i,Prism.hooks.add("after-highlight",function(e){(i.byLanguages["*"]||i.byLanguages[e.language])&&i.initEvents(e.element,e.language)})})();