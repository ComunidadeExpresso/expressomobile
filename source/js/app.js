import webcomponents from 'webcomponents';
import jQuery from 'jquery';
import $ from 'jqueryui';
import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'Shared';
import Material from 'material';
import router from 'router';
  var initialize = function(){

    var startApp = function() {

      
      Shared.router = new router();

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

  export default { 
    initialize: initialize
  };


