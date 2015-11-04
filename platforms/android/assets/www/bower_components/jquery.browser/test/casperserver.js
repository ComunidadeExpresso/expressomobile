var fs=require("fs"),webserver=require("webserver");exports.create=function(t,n){"use strict";var r=new Server(t,n);return t.server=r,r};var Server=function(t,n){"use strict";this.casper=t,n=n||{},this.options={},this.options.port=n.port||8008,this.options.defaultStatusCode=n.defaultStatusCode||200,this.options.responsesDir=n.responsesDir||"./",this.watchedPaths={"^/(\\?.*)?$":{filePath:"test/index.html",permanent:!0},"/src/jquery.browser.js":{filePath:"test/src/jquery.browser.js",permanent:!0},"/src/jquery-1.10.2.min.js":{filePath:"test/src/jquery-1.10.2.min.js",permanent:!0}},this.watchedRequests={}};exports.Server=Server,Server.prototype.start=function(){"use strict";this.webserver=webserver.create();var t=this;this.service=this.webserver.listen(this.options.port,function(e,n){t._serve(e,n)}),this.log("server started")},Server.prototype.end=function(){"use strict";this.webserver.close(),this.log("server closed")},Server.prototype._serve=function(t,n){"use strict";n.statusCode=this.options.defaultStatusCode,this.log("handling "+t.method+" on "+t.url,"debug"),typeof this.watchedRequests[t.url]!="undefined"&&(t.headers["Content-Type"]!="application/x-www-form-urlencoded"&&this._splitFormData(t),this.watchedRequests[t.url]=t);var r={};for(var i in this.watchedPaths)if(t.url.search(i)!==-1){r=this.watchedPaths[i],this.log("Build response from watched path "+t.url),r.permanent||this.unwatchPath(i);break}r._request=t,this._buildResponse(n,r)},Server.prototype._buildResponse=function(t,n){var r,i,s,n=n||{};n.content?typeof n.content=="function"?r=n.content(n._request):r=n.content:(n.filePath?typeof n.filePath=="function"?s=n.filePath(n._request):s=n.filePath:s=n._request.url,/^(\.|\/)/.test(s)||(s=this.options.responsesDir+s),fs.exists(s)?(this.log("Getting content from "+s),r=fs.read(s)):this.log("File not found: "+s,"error")),n.statusCode&&(t.statusCode=n.statusCode),r||(t.statusCode=404,r="No handler for the url "+n._request.url),t.write(r),t.close()},Server.prototype.log=function(t,n){typeof n=="undefined"&&(n="debug"),this.casper.log("[casperserver] "+t,n)},Server.prototype._splitFormData=function(t){var n={},r=t.post.trim(),i="--"+t.headers["Content-Type"].split("boundary=")[1],s=r.split(i),o,u,a;for(var f=1,l=s.length;f<l;f++){if(!s[f]||s[f]=="--")continue;o=s[f].split("\r\n"),a=o[3],u=o[1].match(/name="(\S+)"/i)[1],n[u]=a}return t.post=n,t},Server.prototype.watchPath=function(e,t){this.watchedPaths[e]=t},Server.prototype.unwatchPath=function(e){delete this.watchedPaths[e]},Server.prototype.watchRequest=function(e){this.watchedRequests[e]=null},Server.prototype.unwatchRequest=function(e){delete this.watchedRequests[e]},Server.prototype.getWatchedRequest=function(e){if(!e){this.log("Can't retrieve watchedRequest for null path");return}var t=this.watchedRequests[e];return delete this.watchedRequests[e],t};