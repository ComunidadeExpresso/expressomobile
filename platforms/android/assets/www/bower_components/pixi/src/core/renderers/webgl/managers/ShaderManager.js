function ShaderManager(e){WebGLManager.call(this,e),this.maxAttibs=10,this.attribState=[],this.tempAttribState=[];for(var t=0;t<this.maxAttibs;t++)this.attribState[t]=!1;this.stack=[],this._currentId=-1,this.currentShader=null}var WebGLManager=require("./WebGLManager"),TextureShader=require("../shaders/TextureShader"),ComplexPrimitiveShader=require("../shaders/ComplexPrimitiveShader"),PrimitiveShader=require("../shaders/PrimitiveShader"),utils=require("../../../utils");ShaderManager.prototype=Object.create(WebGLManager.prototype),ShaderManager.prototype.constructor=ShaderManager,utils.pluginTarget.mixin(ShaderManager),module.exports=ShaderManager,ShaderManager.prototype.onContextChange=function(){this.initPlugins();var e=this.renderer.gl;this.maxAttibs=e.getParameter(e.MAX_VERTEX_ATTRIBS),this.attribState=[];for(var t=0;t<this.maxAttibs;t++)this.attribState[t]=!1;this.defaultShader=new TextureShader(this),this.primitiveShader=new PrimitiveShader(this),this.complexPrimitiveShader=new ComplexPrimitiveShader(this)},ShaderManager.prototype.setAttribs=function(e){var t;for(t=0;t<this.tempAttribState.length;t++)this.tempAttribState[t]=!1;for(var n in e)this.tempAttribState[e[n]]=!0;var r=this.renderer.gl;for(t=0;t<this.attribState.length;t++)this.attribState[t]!==this.tempAttribState[t]&&(this.attribState[t]=this.tempAttribState[t],this.attribState[t]?r.enableVertexAttribArray(t):r.disableVertexAttribArray(t))},ShaderManager.prototype.setShader=function(e){return this._currentId===e.uid?!1:(this._currentId=e.uid,this.currentShader=e,this.renderer.gl.useProgram(e.program),this.setAttribs(e.attributes),!0)},ShaderManager.prototype.destroy=function(){this.primitiveShader.destroy(),this.complexPrimitiveShader.destroy(),WebGLManager.prototype.destroy.call(this),this.destroyPlugins(),this.attribState=null,this.tempAttribState=null};