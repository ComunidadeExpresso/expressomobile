var core=require("../core");module.exports=function(){return function(e,t){if(e.data&&e.isImage){var n=new core.BaseTexture(e.data,null,core.utils.getResolutionOfUrl(e.url));n.imageUrl=e.url,e.texture=new core.Texture(n),core.utils.BaseTextureCache[e.url]=n,core.utils.TextureCache[e.url]=e.texture}t()}};