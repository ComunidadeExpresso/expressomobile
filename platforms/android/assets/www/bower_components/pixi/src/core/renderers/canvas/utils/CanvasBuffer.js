function CanvasBuffer(e,t){this.canvas=document.createElement("canvas"),this.context=this.canvas.getContext("2d"),this.canvas.width=e,this.canvas.height=t}CanvasBuffer.prototype.constructor=CanvasBuffer,module.exports=CanvasBuffer,Object.defineProperties(CanvasBuffer.prototype,{width:{get:function(){return this.canvas.width},set:function(e){this.canvas.width=e}},height:{get:function(){return this.canvas.height},set:function(e){this.canvas.height=e}}}),CanvasBuffer.prototype.clear=function(){this.context.setTransform(1,0,0,1,0,0),this.context.clearRect(0,0,this.canvas.width,this.canvas.height)},CanvasBuffer.prototype.resize=function(e,t){this.canvas.width=e,this.canvas.height=t},CanvasBuffer.prototype.destroy=function(){this.context=null,this.canvas=null};