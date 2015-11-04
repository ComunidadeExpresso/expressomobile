// RequireJS UnderscoreJS template plugin
// http://github.com/jfparadis/requirejs-tpl
//
// An alternative to http://github.com/ZeeAgency/requirejs-tpl
//
// Using UnderscoreJS micro-templates at http://underscorejs.org/#template
// Using and RequireJS text.js at http://requirejs.org/docs/api.html#text
// @author JF Paradis
// @version 0.0.2
//
// Released under the MIT license
//
// Usage:
//   require(['backbone', 'tpl!mytemplate'], function (Backbone, mytemplate) {
//     return Backbone.View.extend({
//       initialize: function(){
//         this.render();
//       },
//       render: function(){
//         this.$el.html(mytemplate({message: 'hello'}));
//     });
//   });
//
// Configuration: (optional)
//   require.config({
//     tpl: {
//       extension: '.tpl' // default = '.html'
//     }
//   });

define(["text","underscore"],function(e,t){"use strict";var n={},r="define('{pluginName}!{moduleName}', function () { return {source}; });\n";return{version:"0.0.2",load:function(r,i,s,o){if(n[r])s(n[r]);else{var u=o.tpl&&o.tpl.extension||".html",a=o.tpl&&o.tpl.path||"";e.load(a+r+u,i,function(e){n[r]=t.template(e),s(n[r])},o)}},write:function(e,t,i){var s=n[t],o=s&&s.source;o&&i.asModule(e+"!"+t,r.replace("{pluginName}",e).replace("{moduleName}",t).replace("{source}",o))}}});