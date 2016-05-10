//import webcomponents from 'webcomponents';
import $ from 'jquery';
// import  from 'jqueryui';
import _ from 'underscore';
import moment from 'moment';
import momentRange from 'momentRange';
import Backbone from 'backbone';
import Shared from 'Shared';
import HomeView from 'HomeView';
// import Material from 'material';
// import router from 'router';
import page from 'page';

var initialize = function(){

  var startApp = function() {

    Shared.homeView = new HomeView();
    Shared.homeView.render();

    // Grab a reference to our auto-binding template
    // and give it some initial binding values
    // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
    var app = document.querySelector('#app');

    // Sets app default base URL
    app.baseUrl = '/';
    if (window.location.port === '') {  // if production
      // Uncomment app.baseURL below and
      // set app.baseURL to '/your-pathname/' if running from folder in production
      // app.baseUrl = '/polymer-starter-kit/';
    }

    app.displayInstalledToast = function() {
      // Check to make sure caching is actually enabled—it won't be in the dev environment.
      // if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
      //   Polymer.dom(document).querySelector('#caching-complete').show();
      // }
    };

    // Listen for template bound event to know when bindings
    // have resolved and content has been stamped to the page
    app.addEventListener('dom-change', function() {
      // console.log('Our app is ready to rock!');
    });

    // See https://github.com/Polymer/polymer/issues/1381
    window.addEventListener('WebComponentsReady', function() {
      // imports are loaded and elements have been registered
    });

    // Scroll page to top and expand header
    app.scrollPageToTop = function() {
      if (app.$.headerPanelMain != undefined) {
        app.$.headerPanelMain.scrollToTop(true);
      }
      
    };


    app.closeDrawer = function() {
      if (app.$.paperDrawerPanel != undefined) {
        app.$.paperDrawerPanel.closeDrawer();
      }
      
    };
    

    // $( document ).ready(function() {
    //   window.addEventListener('paper-header-transform', function(e) {

    //     var detail = e.detail;
    //     var heightDiff = detail.height - detail.condensedHeight;
    //     var yRatio = Math.min(1, detail.y / heightDiff);
    //     var maxMiddleScale = 0.50;
    //     var auxHeight = heightDiff - detail.y;
    //     var auxScale = heightDiff / (1 - maxMiddleScale);
    //     var scaleMiddle = Math.max(maxMiddleScale, auxHeight / auxScale + maxMiddleScale);
    //     var scaleBottom = 1 - yRatio;

    //     $("#mainToolbar .middle-container").css({"transform": "translate3d(0, " + yRatio * 100 + "%, 0)"});

    //     $("#mainToolbar .bottom-container").css({"transform": "scale(" + scaleBottom + ") translateZ(0)"});

    //     $("#mainToolbar .app-name").css({"transform": "scale(" + scaleMiddle + ") translateZ(0)"});

    //     // console.log('yRatio:' + yRatio);
    //     // console.log('scaleBottom:' + scaleBottom);
    //     // console.log('scaleMiddle:' + scaleMiddle);

    //   });
    // });

    window.addEventListener('WebComponentsReady', function() {

        // We use Page.js for routing. This is a Micro
        // client-side router inspired by the Express router
        // More info: https://visionmedia.github.io/page.js/

        // Removes end / from app.baseUrl which page.base requires for production
        if (window.location.port === '') {  // if production
          if (app != null) {
            page.base(app.baseUrl.replace(/\/$/, ''));
          }
        }

        // Middleware
        function scrollToTop(ctx, next) {
          app.scrollPageToTop();
          next();
        }

        function closeDrawer(ctx, next) {
          app.closeDrawer();
          next();
        }

        // Routes
        page('*', scrollToTop, closeDrawer, function(ctx, next) {
          next();
        });

        page('/', function() {
          // app.route = 'mail-messages';
          // app.fire('evt-open-folder', { folder: { folderID: "INBOX" } });
        });

        page(app.baseUrl, function() {
          app.route = 'mail-messages';
          app.fire('evt-open-folder', { folder: { folderID: "INBOX" } });
        });

        page('/mail-messages/*', function(data) {
          app.route = 'mail-messages';
          app.fire('evt-open-folder', { folder: { folderID: data.params[0] } });
        });

        page('/search', function() {  app.fire('evt-toolbar-search'); });

        page('/mail-detail/:msgid/*', function(data) {
          app.route = 'mail-detail';
          // console.log(data);
          var params =  { folderid: data.params[0], msgid: data.params.msgid };
          app.params = params;
          app.fire('evt-open-message', params);
        });

        page('/mail-compose/*', function(data) {
          app.params = { 'action' : 'create' , emails: data.params[0] };
          app.route = 'mail-create';
          console.log(data.params);
          
          app.fire('evt-create-message', app.params);
        });

        page('/mail-create', function(data) {
          app.route = 'mail-create';
          app.params = { 'action' : 'create' };
          app.fire('evt-create-message', app.params);
        });

        page('/mail-reply/:msgid/*', function(data) {
          app.route = 'mail-create';
          var params =  { 'action' : 'reply', folderid: data.params[0], msgid: data.params.msgid };
          app.params = params;
          app.fire('evt-create-message', params);
        });

        page('/mail-reply-all/:msgid/*', function(data) {
          app.route = 'mail-create';
          var params =  { 'action' : 'reply-all', folderid: data.params[0], msgid: data.params.msgid };
          app.params = params;
          app.fire('evt-create-message', params);
        });

        page('/mail-forward/:msgid/*', function(data) {
          app.route = 'mail-create';
          var params =  { 'action' : 'forward', folderid: data.params[0], msgid: data.params.msgid };
          app.params = params;
          app.fire('evt-create-message', params);
        });

        // page('/users', function() {
        //   app.route = 'users';
        // });

        // page('/users/:name', function(data) {
        //   app.route = 'user-info';
        //   app.params = data.params;

        // });

        page('/contact-list', function(data) {
          app.route = 'contact-list';
          app.fire('evt-open-contacts');
        });

        page('/contact-detail/:contactType/:contactId', function(data) {
          app.route = 'contact-detail';
          var params =  { contactType: data.params.contactType, contactId: data.params.contactId };
          app.fire('evt-open-contact-detail',params);
        });

        page('/contact-edit/:contactType/:contactId', function(data) {
          app.route = 'contact-edit';
          var params =  { contactType: data.params.contactType, contactId: data.params.contactId };
          app.fire('evt-open-contact-edit',params);
        });

        page('/contact-edit', function(data) {
          app.route = 'contact-edit';
          var params =  { };
          app.fire('evt-open-contact-edit',params);
        });

        page('/events-list', function(data) {
          app.route = 'events-list';
          var params =  { };
          app.fire('evt-open-events-list',params);
        });

        page('/events-list/:curDate/:selected', function(data) {
          app.route = 'events-list';
          var params = { curDate: data.params.curDate, selected: data.params.selected, selectedPage: 0 };
          app.fire('evt-open-events-list',params);
        });

        page('/event/:eventID', function(data) {
          app.route = 'event-detail';
          var params = { eventID: data.params.eventID, selectedPage: 1 };
          app.fire('evt-open-event-edit',params);
        });


        // 404
        page('*', function() {

          app.fire('iron-signal', {
            name: 'toaster-bake',
            data: {
              text: 'Não foi possível encontrar: ' + window.location.href  + '. Você foi redirecionado para a página inicial.',
              type: 'warn',
            }
          });

          page.redirect(app.baseUrl);
        });

        // add #! before urls
        page({
          hashbang: true
        });


    });
  
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
