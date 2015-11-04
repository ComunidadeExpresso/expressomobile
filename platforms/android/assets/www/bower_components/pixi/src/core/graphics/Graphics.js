function Graphics(){Container.call(this),this.fillAlpha=1,this.lineWidth=0,this.lineColor=0,this.graphicsData=[],this.tint=16777215,this._prevTint=16777215,this.blendMode=CONST.BLEND_MODES.NORMAL,this.currentPath=null,this._webGL={},this.isMask=!1,this.boundsPadding=0,this._localBounds=new math.Rectangle(0,0,1,1),this.dirty=!0,this.glDirty=!1,this.boundsDirty=!0,this.cachedSpriteDirty=!1}var Container=require("../display/Container"),Texture=require("../textures/Texture"),CanvasBuffer=require("../renderers/canvas/utils/CanvasBuffer"),CanvasGraphics=require("../renderers/canvas/utils/CanvasGraphics"),GraphicsData=require("./GraphicsData"),math=require("../math"),CONST=require("../const"),tempPoint=new math.Point;Graphics.prototype=Object.create(Container.prototype),Graphics.prototype.constructor=Graphics,module.exports=Graphics,Graphics.prototype.clone=function(){var e=new Graphics;e.renderable=this.renderable,e.fillAlpha=this.fillAlpha,e.lineWidth=this.lineWidth,e.lineColor=this.lineColor,e.tint=this.tint,e.blendMode=this.blendMode,e.isMask=this.isMask,e.boundsPadding=this.boundsPadding,e.dirty=!0,e.glDirty=!0,e.cachedSpriteDirty=this.cachedSpriteDirty;for(var t=0;t<this.graphicsData.length;++t)e.graphicsData.push(this.graphicsData[t].clone());return e.currentPath=e.graphicsData[e.graphicsData.length-1],e.updateLocalBounds(),e},Graphics.prototype.lineStyle=function(e,t,n){this.lineWidth=e||0,this.lineColor=t||0,this.lineAlpha=n===undefined?1:n;if(this.currentPath)if(this.currentPath.shape.points.length){var r=new math.Polygon(this.currentPath.shape.points.slice(-2));r.closed=!1,this.drawShape(r)}else this.currentPath.lineWidth=this.lineWidth,this.currentPath.lineColor=this.lineColor,this.currentPath.lineAlpha=this.lineAlpha;return this},Graphics.prototype.moveTo=function(e,t){var n=new math.Polygon([e,t]);return n.closed=!1,this.drawShape(n),this},Graphics.prototype.lineTo=function(e,t){return this.currentPath.shape.points.push(e,t),this.dirty=!0,this},Graphics.prototype.quadraticCurveTo=function(e,t,n,r){this.currentPath?this.currentPath.shape.points.length===0&&(this.currentPath.shape.points=[0,0]):this.moveTo(0,0);var i,s,o=20,u=this.currentPath.shape.points;u.length===0&&this.moveTo(0,0);var a=u[u.length-2],f=u[u.length-1],l=0;for(var c=1;c<=o;++c)l=c/o,i=a+(e-a)*l,s=f+(t-f)*l,u.push(i+(e+(n-e)*l-i)*l,s+(t+(r-t)*l-s)*l);return this.dirty=this.boundsDirty=!0,this},Graphics.prototype.bezierCurveTo=function(e,t,n,r,i,s){this.currentPath?this.currentPath.shape.points.length===0&&(this.currentPath.shape.points=[0,0]):this.moveTo(0,0);var o=20,u,a,f,l,c,h=this.currentPath.shape.points,p=h[h.length-2],d=h[h.length-1],v=0;for(var m=1;m<=o;++m)v=m/o,u=1-v,a=u*u,f=a*u,l=v*v,c=l*v,h.push(f*p+3*a*v*e+3*u*l*n+c*i,f*d+3*a*v*t+3*u*l*r+c*s);return this.dirty=this.boundsDirty=!0,this},Graphics.prototype.arcTo=function(e,t,n,r,i){this.currentPath?this.currentPath.shape.points.length===0&&this.currentPath.shape.points.push(e,t):this.moveTo(e,t);var s=this.currentPath.shape.points,o=s[s.length-2],u=s[s.length-1],a=u-t,f=o-e,l=r-t,c=n-e,h=Math.abs(a*c-f*l);if(h<1e-8||i===0)(s[s.length-2]!==e||s[s.length-1]!==t)&&s.push(e,t);else{var p=a*a+f*f,d=l*l+c*c,v=a*l+f*c,m=i*Math.sqrt(p)/h,g=i*Math.sqrt(d)/h,y=m*v/p,b=g*v/d,w=m*c+g*f,E=m*l+g*a,S=f*(g+y),x=a*(g+y),T=c*(m+b),N=l*(m+b),C=Math.atan2(x-E,S-w),k=Math.atan2(N-E,T-w);this.arc(w+e,E+t,i,C,k,f*l>c*a)}return this.dirty=this.boundsDirty=!0,this},Graphics.prototype.arc=function(e,t,n,r,i,s){s=s||!1;if(r===i)return this;!s&&i<=r?i+=Math.PI*2:s&&r<=i&&(r+=Math.PI*2);var o=s?(r-i)*-1:i-r,u=Math.ceil(Math.abs(o)/(Math.PI*2))*40;if(o===0)return this;var a=e+Math.cos(r)*n,f=t+Math.sin(r)*n;this.currentPath?this.currentPath.shape.points.push(a,f):this.moveTo(a,f);var l=this.currentPath.shape.points,c=o/(u*2),h=c*2,p=Math.cos(c),d=Math.sin(c),v=u-1,m=v%1/v;for(var g=0;g<=v;g++){var y=g+m*g,b=c+r+h*y,w=Math.cos(b),E=-Math.sin(b);l.push((p*w+d*E)*n+e,(p*-E+d*w)*n+t)}return this.dirty=this.boundsDirty=!0,this},Graphics.prototype.beginFill=function(e,t){return this.filling=!0,this.fillColor=e||0,this.fillAlpha=t===undefined?1:t,this.currentPath&&this.currentPath.shape.points.length<=2&&(this.currentPath.fill=this.filling,this.currentPath.fillColor=this.fillColor,this.currentPath.fillAlpha=this.fillAlpha),this},Graphics.prototype.endFill=function(){return this.filling=!1,this.fillColor=null,this.fillAlpha=1,this},Graphics.prototype.drawRect=function(e,t,n,r){return this.drawShape(new math.Rectangle(e,t,n,r)),this},Graphics.prototype.drawRoundedRect=function(e,t,n,r,i){return this.drawShape(new math.RoundedRectangle(e,t,n,r,i)),this},Graphics.prototype.drawCircle=function(e,t,n){return this.drawShape(new math.Circle(e,t,n)),this},Graphics.prototype.drawEllipse=function(e,t,n,r){return this.drawShape(new math.Ellipse(e,t,n,r)),this},Graphics.prototype.drawPolygon=function(e){var t=e,n=!0;t instanceof math.Polygon&&(n=t.closed,t=t.points);if(!Array.isArray(t)){t=new Array(arguments.length);for(var r=0;r<t.length;++r)t[r]=arguments[r]}var i=new math.Polygon(t);return i.closed=n,this.drawShape(i),this},Graphics.prototype.clear=function(){return this.lineWidth=0,this.filling=!1,this.dirty=!0,this.clearDirty=!0,this.graphicsData=[],this},Graphics.prototype.generateTexture=function(e,t,n){t=t||1;var r=this.getLocalBounds(),i=new CanvasBuffer(r.width*t,r.height*t),s=Texture.fromCanvas(i.canvas,n);return s.baseTexture.resolution=t,i.context.scale(t,t),i.context.translate(-r.x,-r.y),CanvasGraphics.renderGraphics(this,i.context),s},Graphics.prototype._renderWebGL=function(e){this.glDirty&&(this.dirty=!0,this.glDirty=!1),e.setObjectRenderer(e.plugins.graphics),e.plugins.graphics.render(this)},Graphics.prototype._renderCanvas=function(e){if(this.isMask===!0)return;this._prevTint!==this.tint&&(this.dirty=!0);var t=e.context,n=this.worldTransform,r=e.blendModes[this.blendMode];r!==t.globalCompositeOperation&&(t.globalCompositeOperation=r);var i=e.resolution;t.setTransform(n.a*i,n.b*i,n.c*i,n.d*i,n.tx*i,n.ty*i),CanvasGraphics.renderGraphics(this,t)},Graphics.prototype.getBounds=function(e){if(!this._currentBounds){if(!this.renderable)return math.Rectangle.EMPTY;this.boundsDirty&&(this.updateLocalBounds(),this.glDirty=!0,this.cachedSpriteDirty=!0,this.boundsDirty=!1);var t=this._localBounds,n=t.x,r=t.width+t.x,i=t.y,s=t.height+t.y,o=e||this.worldTransform,u=o.a,a=o.b,f=o.c,l=o.d,c=o.tx,h=o.ty,p=u*r+f*s+c,d=l*s+a*r+h,v=u*n+f*s+c,m=l*s+a*n+h,g=u*n+f*i+c,y=l*i+a*n+h,b=u*r+f*i+c,w=l*i+a*r+h,E=p,S=d,x=p,T=d;x=v<x?v:x,x=g<x?g:x,x=b<x?b:x,T=m<T?m:T,T=y<T?y:T,T=w<T?w:T,E=v>E?v:E,E=g>E?g:E,E=b>E?b:E,S=m>S?m:S,S=y>S?y:S,S=w>S?w:S,this._bounds.x=x,this._bounds.width=E-x,this._bounds.y=T,this._bounds.height=S-T,this._currentBounds=this._bounds}return this._currentBounds},Graphics.prototype.containsPoint=function(e){this.worldTransform.applyInverse(e,tempPoint);var t=this.graphicsData;for(var n=0;n<t.length;n++){var r=t[n];if(!r.fill)continue;if(r.shape&&r.shape.contains(tempPoint.x,tempPoint.y))return!0}return!1},Graphics.prototype.updateLocalBounds=function(){var e=Infinity,t=-Infinity,n=Infinity,r=-Infinity;if(this.graphicsData.length){var i,s,o,u,a,f;for(var l=0;l<this.graphicsData.length;l++){var c=this.graphicsData[l],h=c.type,p=c.lineWidth;i=c.shape;if(h===CONST.SHAPES.RECT||h===CONST.SHAPES.RREC)o=i.x-p/2,u=i.y-p/2,a=i.width+p,f=i.height+p,e=o<e?o:e,t=o+a>t?o+a:t,n=u<n?u:n,r=u+f>r?u+f:r;else if(h===CONST.SHAPES.CIRC)o=i.x,u=i.y,a=i.radius+p/2,f=i.radius+p/2,e=o-a<e?o-a:e,t=o+a>t?o+a:t,n=u-f<n?u-f:n,r=u+f>r?u+f:r;else if(h===CONST.SHAPES.ELIP)o=i.x,u=i.y,a=i.width+p/2,f=i.height+p/2,e=o-a<e?o-a:e,t=o+a>t?o+a:t,n=u-f<n?u-f:n,r=u+f>r?u+f:r;else{s=i.points;for(var d=0;d<s.length;d+=2)o=s[d],u=s[d+1],e=o-p<e?o-p:e,t=o+p>t?o+p:t,n=u-p<n?u-p:n,r=u+p>r?u+p:r}}}else e=0,t=0,n=0,r=0;var v=this.boundsPadding;this._localBounds.x=e-v,this._localBounds.width=t-e+v*2,this._localBounds.y=n-v,this._localBounds.height=r-n+v*2},Graphics.prototype.drawShape=function(e){this.currentPath&&this.currentPath.shape.points.length<=2&&this.graphicsData.pop(),this.currentPath=null;var t=new GraphicsData(this.lineWidth,this.lineColor,this.lineAlpha,this.fillColor,this.fillAlpha,this.filling,e);return this.graphicsData.push(t),t.type===CONST.SHAPES.POLY&&(t.shape.closed=t.shape.closed||this.filling,this.currentPath=t),this.dirty=this.boundsDirty=!0,t},Graphics.prototype.destroy=function(){Container.prototype.destroy.apply(this,arguments);for(var e=0;e<this.graphicsData.length;++e)this.graphicsData[e].destroy();for(var t in this._webgl)for(var n=0;n<this._webgl[t].data.length;++n)this._webgl[t].data[n].destroy();this.graphicsData=null,this.currentPath=null,this._webgl=null,this._localBounds=null};