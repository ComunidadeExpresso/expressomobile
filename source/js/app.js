define([
  'jquery', 
  'underscore', 
  'backbone',
  'shared',
  'material',
  'router', 
], function($, _, Backbone, Shared, Material ,AppRouter){
  var initialize = function(){

    var startApp = function() {

      
      Shared.router = new AppRouter();

      Shared.router.setupRouter();

      Shared.router.start();
    };

    if (IS_PHONEGAP) {
      document.addEventListener('deviceready', function () {
        startApp();
      });

    } else {
      startApp();
    }


  };

  return { 
    initialize: initialize
  };
});
