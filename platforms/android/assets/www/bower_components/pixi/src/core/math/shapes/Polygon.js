function Polygon(e){var t=e;if(!Array.isArray(t)){t=new Array(arguments.length);for(var n=0;n<t.length;++n)t[n]=arguments[n]}if(t[0]instanceof Point){var r=[];for(var i=0,s=t.length;i<s;i++)r.push(t[i].x,t[i].y);t=r}this.closed=!0,this.points=t,this.type=CONST.SHAPES.POLY}var Point=require("../Point"),CONST=require("../../const");Polygon.prototype.constructor=Polygon,module.exports=Polygon,Polygon.prototype.clone=function(){return new Polygon(this.points.slice())},Polygon.prototype.contains=function(e,t){var n=!1,r=this.points.length/2;for(var i=0,s=r-1;i<r;s=i++){var o=this.points[i*2],u=this.points[i*2+1],a=this.points[s*2],f=this.points[s*2+1],l=u>t!=f>t&&e<(a-o)*(t-u)/(f-u)+o;l&&(n=!n)}return n};