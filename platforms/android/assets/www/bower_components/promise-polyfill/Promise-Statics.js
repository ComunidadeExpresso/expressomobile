Promise.all=Promise.all||function(){var e=Array.prototype.slice.call(arguments.length===1&&Array.isArray(arguments[0])?arguments[0]:arguments);return new Promise(function(t,n){function i(s,o){try{if(o&&(typeof o=="object"||typeof o=="function")){var u=o.then;if(typeof u=="function"){u.call(o,function(e){i(s,e)},n);return}}e[s]=o,--r===0&&t(e)}catch(a){n(a)}}if(e.length===0)return t([]);var r=e.length;for(var s=0;s<e.length;s++)i(s,e[s])})},Promise.race=Promise.race||function(e){return new Promise(function(t,n){for(var r=0,i=e.length;r<i;r++)e[r].then(t,n)})};