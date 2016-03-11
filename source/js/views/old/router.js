// Filename: router.js
import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';
import LoginView from 'LoginView';
import HomeView from 'HomeView';
// import OfflineView from 'OfflineView';
// import DetailMessageView from 'DetailMessageView';
// import ComposeMessageView from 'ComposeMessageView';
// import EditFolderView from 'EditFolderView';
// import SettingsListView from 'SettingsListView';
// import ContactsListView from 'ContactsListView';

// import CalendarListView from 'CalendarListView';
// import CalendarView from 'CalendarView';
// import CalendarDetailsView from 'CalendarDetailsView';
// import CalendarEditEventView from 'CalendarEditEventView';
// import CalendarDeleteEventView from 'CalendarDeleteEventView';
// import CalendarFullDayListView from 'CalendarFullDayListView';
// import ChatListView from 'ChatListView';
  
  var router = Backbone.Router.extend({

    routes: {

      'Home' : 'homeView',
      'Login' : 'loginView',
      // 'Logout' : 'logoutView',
      'AutomaticLogin': 'automaticLoginView',
      '*actions': 'defaultAction'

    },
    start: function() {
      if (Shared.isBuiltInExpresso()) {
        Backbone.history.start({pushState: true,root: "/email/"});
      } else {
        Backbone.history.start({pushState: true});
      }
    },

    setupRouter: function() {
      var app_router = this;

        app_router.on('route:homeView', function (actions) {  

            Shared.homeView = new HomeView();
            Shared.homeView.render();

        });

        app_router.on('route:loginView', function (actions) {

           var loginView = new LoginView();
           loginView.render();

        });

        app_router.on('route:automaticLoginView', function (actions) {

           var loginView = new LoginView();
           loginView.automaticLogin();

        });


        app_router.on('route:logoutView', function (actions) {

          var loginView = new LoginView();
          loginView.logoutUser();
      
        });

        app_router.on('route:defaultAction', function (actions) {

          if (Shared.versionIsActive) {

            Shared.api.getLocalStorageValue("expresso",function(expressoValue) {

              if (expressoValue != null) {

                var authValue = expressoValue.auth;

                if (authValue != null) {
                  Shared.api.auth(authValue);
                }

                Shared.profile = expressoValue.profile;

              }

            });

            if ((Shared.api.auth())) {
              app_router.navigate("Home",{ trigger: true });
            } else {
              //Shared.gotoRoute
              app_router.navigate("Login",{ trigger: true });
            }

          } else {
            app_router.navigate("Offline",{ trigger: true });
          }

        });


      return app_router;

    }
    
  });

  export default router;



