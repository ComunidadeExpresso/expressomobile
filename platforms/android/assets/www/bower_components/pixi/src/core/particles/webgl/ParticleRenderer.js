function ParticleRenderer(e){ObjectRenderer.call(this,e);var t=98304;this.indices=new Uint16Array(t);for(var n=0,r=0;n<t;n+=6,r+=4)this.indices[n+0]=r+0,this.indices[n+1]=r+1,this.indices[n+2]=r+2,this.indices[n+3]=r+0,this.indices[n+4]=r+2,this.indices[n+5]=r+3;this.shader=null,this.indexBuffer=null,this.properties=null,this.tempMatrix=new math.Matrix}var ObjectRenderer=require("../../renderers/webgl/utils/ObjectRenderer"),WebGLRenderer=require("../../renderers/webgl/WebGLRenderer"),ParticleShader=require("./ParticleShader"),ParticleBuffer=require("./ParticleBuffer"),math=require("../../math");ParticleRenderer.prototype=Object.create(ObjectRenderer.prototype),ParticleRenderer.prototype.constructor=ParticleRenderer,module.exports=ParticleRenderer,WebGLRenderer.registerPlugin("particle",ParticleRenderer),ParticleRenderer.prototype.onContextChange=function(){var e=this.renderer.gl;this.shader=new ParticleShader(this.renderer.shaderManager),this.indexBuffer=e.createBuffer(),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.indexBuffer),e.bufferData(e.ELEMENT_ARRAY_BUFFER,this.indices,e.STATIC_DRAW),this.properties=[{attribute:this.shader.attributes.aVertexPosition,size:2,uploadFunction:this.uploadVertices,offset:0},{attribute:this.shader.attributes.aPositionCoord,size:2,uploadFunction:this.uploadPosition,offset:0},{attribute:this.shader.attributes.aRotation,size:1,uploadFunction:this.uploadRotation,offset:0},{attribute:this.shader.attributes.aTextureCoord,size:2,uploadFunction:this.uploadUvs,offset:0},{attribute:this.shader.attributes.aColor,size:1,uploadFunction:this.uploadAlpha,offset:0}]},ParticleRenderer.prototype.start=function(){var e=this.renderer.gl;e.activeTexture(e.TEXTURE0),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.indexBuffer);var t=this.shader;this.renderer.shaderManager.setShader(t)},ParticleRenderer.prototype.render=function(e){var t=e.children,n=t.length,r=e._maxSize,i=e._batchSize;if(n===0)return;n>r&&(n=r),e._buffers||(e._buffers=this.generateBuffers(e)),this.renderer.blendModeManager.setBlendMode(e.blendMode);var s=this.renderer.gl,o=e.worldTransform.copy(this.tempMatrix);o.prepend(this.renderer.currentRenderTarget.projectionMatrix),s.uniformMatrix3fv(this.shader.uniforms.projectionMatrix._location,!1,o.toArray(!0)),s.uniform1f(this.shader.uniforms.uAlpha._location,e.worldAlpha);var u=t[0]._texture.baseTexture;if(!u._glTextures[s.id]){if(!this.renderer.updateTexture(u))return;if(!e._properties[0]||!e._properties[3])e._bufferToUpdate=0}else s.bindTexture(s.TEXTURE_2D,u._glTextures[s.id]);for(var a=0,f=0;a<n;a+=i,f+=1){var l=n-a;l>i&&(l=i);var c=e._buffers[f];c.uploadDynamic(t,a,l),e._bufferToUpdate===f&&(c.uploadStatic(t,a,l),e._bufferToUpdate=f+1),c.bind(this.shader),s.drawElements(s.TRIANGLES,l*6,s.UNSIGNED_SHORT,0),this.renderer.drawCount++}},ParticleRenderer.prototype.generateBuffers=function(e){var t=this.renderer.gl,n=[],r=e._maxSize,i=e._batchSize,s=e._properties,o;for(o=0;o<r;o+=i)n.push(new ParticleBuffer(t,this.properties,s,i));return n},ParticleRenderer.prototype.uploadVertices=function(e,t,n,r,i,s){var o,u,a,f,l,c,h,p,d;for(var v=0;v<n;v++)o=e[t+v],u=o._texture,f=o.scale.x,l=o.scale.y,u.trim?(a=u.trim,h=a.x-o.anchor.x*a.width,c=h+u.crop.width,d=a.y-o.anchor.y*a.height,p=d+u.crop.height):(c=u._frame.width*(1-o.anchor.x),h=u._frame.width*-o.anchor.x,p=u._frame.height*(1-o.anchor.y),d=u._frame.height*-o.anchor.y),r[s]=h*f,r[s+1]=d*l,r[s+i]=c*f,r[s+i+1]=d*l,r[s+i*2]=c*f,r[s+i*2+1]=p*l,r[s+i*3]=h*f,r[s+i*3+1]=p*l,s+=i*4},ParticleRenderer.prototype.uploadPosition=function(e,t,n,r,i,s){for(var o=0;o<n;o++){var u=e[t+o].position;r[s]=u.x,r[s+1]=u.y,r[s+i]=u.x,r[s+i+1]=u.y,r[s+i*2]=u.x,r[s+i*2+1]=u.y,r[s+i*3]=u.x,r[s+i*3+1]=u.y,s+=i*4}},ParticleRenderer.prototype.uploadRotation=function(e,t,n,r,i,s){for(var o=0;o<n;o++){var u=e[t+o].rotation;r[s]=u,r[s+i]=u,r[s+i*2]=u,r[s+i*3]=u,s+=i*4}},ParticleRenderer.prototype.uploadUvs=function(e,t,n,r,i,s){for(var o=0;o<n;o++){var u=e[t+o]._texture._uvs;u?(r[s]=u.x0,r[s+1]=u.y0,r[s+i]=u.x1,r[s+i+1]=u.y1,r[s+i*2]=u.x2,r[s+i*2+1]=u.y2,r[s+i*3]=u.x3,r[s+i*3+1]=u.y3,s+=i*4):(r[s]=0,r[s+1]=0,r[s+i]=0,r[s+i+1]=0,r[s+i*2]=0,r[s+i*2+1]=0,r[s+i*3]=0,r[s+i*3+1]=0,s+=i*4)}},ParticleRenderer.prototype.uploadAlpha=function(e,t,n,r,i,s){for(var o=0;o<n;o++){var u=e[t+o].alpha;r[s]=u,r[s+i]=u,r[s+i*2]=u,r[s+i*3]=u,s+=i*4}},ParticleRenderer.prototype.destroy=function(){this.renderer.gl&&this.renderer.gl.deleteBuffer(this.indexBuffer),ObjectRenderer.prototype.destroy.apply(this,arguments),this.shader.destroy(),this.indices=null,this.tempMatrix=null};