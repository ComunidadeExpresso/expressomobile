function SmartBlurFilter(){core.AbstractFilter.call(this,null,fs.readFileSync(__dirname+"/smartBlur.frag","utf8"),{delta:{type:"v2",value:{x:.1,y:0}}})}var core=require("../../core"),fs=require("fs");SmartBlurFilter.prototype=Object.create(core.AbstractFilter.prototype),SmartBlurFilter.prototype.constructor=SmartBlurFilter,module.exports=SmartBlurFilter;