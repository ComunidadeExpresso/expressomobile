function MovieClip(e){core.Sprite.call(this,e[0]instanceof core.Texture?e[0]:e[0].texture),this._textures=null,this._durations=null,this.textures=e,this.animationSpeed=1,this.loop=!0,this.onComplete=null,this._currentTime=0,this.playing=!1}var core=require("../core");MovieClip.prototype=Object.create(core.Sprite.prototype),MovieClip.prototype.constructor=MovieClip,module.exports=MovieClip,Object.defineProperties(MovieClip.prototype,{totalFrames:{get:function(){return this._textures.length}},textures:{get:function(){return this._textures},set:function(e){if(e[0]instanceof core.Texture)this._textures=e,this._durations=null;else{this._textures=[],this._durations=[];for(var t=0;t<e.length;t++)this._textures.push(e[t].texture),this._durations.push(e[t].time)}}},currentFrame:{get:function(){var e=Math.floor(this._currentTime)%this._textures.length;return e<0&&(e+=this._textures.length),e}}}),MovieClip.prototype.stop=function(){if(!this.playing)return;this.playing=!1,core.ticker.shared.remove(this.update,this)},MovieClip.prototype.play=function(){if(this.playing)return;this.playing=!0,core.ticker.shared.add(this.update,this)},MovieClip.prototype.gotoAndStop=function(e){this.stop(),this._currentTime=e,this._texture=this._textures[this.currentFrame]},MovieClip.prototype.gotoAndPlay=function(e){this._currentTime=e,this.play()},MovieClip.prototype.update=function(e){var t=this.animationSpeed*e;if(this._durations!==null){var n=this._currentTime%1*this._durations[this.currentFrame];n+=t/60*1e3;while(n<0)this._currentTime--,n+=this._durations[this.currentFrame];var r=Math.sign(this.animationSpeed*e);this._currentTime=Math.floor(this._currentTime);while(n>=this._durations[this.currentFrame])n-=this._durations[this.currentFrame]*r,this._currentTime+=r;this._currentTime+=n/this._durations[this.currentFrame]}else this._currentTime+=t;this._currentTime<0&&!this.loop?(this.gotoAndStop(0),this.onComplete&&this.onComplete()):this._currentTime>=this._textures.length&&!this.loop?(this.gotoAndStop(this._textures.length-1),this.onComplete&&this.onComplete()):this._texture=this._textures[this.currentFrame]},MovieClip.prototype.destroy=function(){this.stop(),core.Sprite.prototype.destroy.call(this)},MovieClip.fromFrames=function(e){var t=[];for(var n=0;n<e.length;++n)t.push(new core.Texture.fromFrame(e[n]));return new MovieClip(t)},MovieClip.fromImages=function(e){var t=[];for(var n=0;n<e.length;++n)t.push(new core.Texture.fromImage(e[n]));return new MovieClip(t)};