// Filename: router.js
import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';
import LoginView from 'LoginView';
import HomeView from 'HomeView';
import OfflineView from 'OfflineView';
import DetailMessageView from 'DetailMessageView';
import ComposeMessageView from 'ComposeMessageView';
import EditFolderView from 'EditFolderView';
import SettingsListView from 'SettingsListView';
import ContactsListView from 'ContactsListView';
import DetailsContactView from 'DetailsContactView';
import AddContactView from 'AddContactView';
import DeleteContactView from 'DeleteContactView';
import CalendarListView from 'CalendarListView';
import CalendarDetailsView from 'CalendarDetailsView';
import CalendarEditEventView from 'CalendarEditEventView';
import CalendarDeleteEventView from 'CalendarDeleteEventView';
import CalendarFullDayListView from 'CalendarFullDayListView';
import ChatListView from 'ChatListView';
  
  var router = Backbone.Router.extend({

    routes: {

      'Home' : 'homeView',
      'Login' : 'loginView',
      'AutomaticLogin': 'automaticLoginView',
      'Offline' : 'offlineView',
      'Switch/*accountName' : 'switchAccount',
      'Mail/CleanTrash/*PfolderID' : 'cleanTrashView',
      'Mail/AddFolder/*PfolderID' : 'newFolderView',
      'Mail/RenameFolder/*PfolderID' : 'renameFolderView',
      'Mail/DeleteFolder/*PfolderID' : 'deleteFolderView',
      'Mail/Message/:secondViewName/:msgID/*folderID' : 'composeMessageView',
      'Mail/Message/:secondViewName/:emailTo' : 'composeMessageTo',
      'Mail/Message/:secondViewName' : 'composeMessageView',
      'Mail/Messages/:forceReload/:msgID/*folderID' : 'detailMessageView',
      'Contacts' : 'contactsListView',
      'Contacts/Add/:contactID' : 'addContactView',
      'Contacts/Delete/:contactID' : 'deleteContactView',
      'Contacts/:secondViewName/OK' : 'deleteContactsListView',
      'Contacts/:secondViewName/:contactID/:status' : 'detailsContactView',
      'Contacts/:secondViewName/:contactID' : 'detailsContactView',
      'Contacts/:secondViewName' : 'contactsListView',
      'Calendar/FullDay/:year/:month/:day' : 'calendarFullDayView',
      'Calendar/Events/Add/:year/:month/:day' : 'calendarAddEventView',
      'Calendar/Events/Edit/:eventID' : 'calendarEditEventView',
      'Calendar/Events/Delete/:eventID/:year/:month/:day' : 'calendarDeleteEventView',
      'Calendar/Events/:eventID/:status' : 'calendarDetailsView',
      'Calendar/Events/:eventID' : 'calendarDetailsView',
      'Calendar/:year/:month/:day/:status' : 'calendarListView',
      'Calendar/:year/:month/:day' : 'calendarListView',
      'Calendar' : 'calendarListView',
      'ChatReconnect' : 'chatReconnectView',
      'Chat' : 'chatListView',
      'Chat/:secondViewName' : 'chatListView',
      'Settings' : 'settingsListView',
      'Settings/:secondViewName' : 'settingsListView',
      'Logout' : 'logoutView',
      'ContextMenu' : 'contextMenuView',
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

        app_router.on('route:switchAccount', function (PaccountName) {

          Shared.forceAutomaticLoginInAccountName = PaccountName;

          var loginView = new LoginView();
          loginView.logoutUser(false);

        });

        app_router.on('route:newFolderView', function (PfolderID) {

          if (PfolderID == undefined) {
            PfolderID = "INBOX";
          }

          PfolderID = PfolderID.replace("#","");

          var editFolderView = new EditFolderView();
          editFolderView.action = "addFolder";
          editFolderView.parentFolderID = PfolderID;
          editFolderView.render();

          Shared.menuView.closeMenu();

        });

        app_router.on('route:cleanTrashView', function (PfolderID) {

          if (PfolderID == undefined) {
            PfolderID = "INBOX";
          }

          PfolderID = PfolderID.replace("#","");

          var editFolderView = new EditFolderView();
          editFolderView.cleanTrash(PfolderID);

          Shared.menuView.closeMenu();

        });

        app_router.on('route:renameFolderView', function (PfolderID) {

          if (PfolderID == undefined) {
            PfolderID = "INBOX";
          }

          PfolderID = PfolderID.replace("#","");

          var editFolderView = new EditFolderView();
          editFolderView.action = "renameFolder";
          editFolderView.folderID = PfolderID;
          editFolderView.render();

          Shared.menuView.closeMenu();

        });

        app_router.on('route:deleteFolderView', function (PfolderID) {

          PfolderID = PfolderID.replace("#","");

          var editFolderView = new EditFolderView();
          editFolderView.deleteFolder(PfolderID);

          Shared.menuView.closeMenu();

        });


        app_router.on('route:loginView', function (actions) {

           var loginView = new LoginView();
           loginView.render();

        });

        app_router.on('route:automaticLoginView', function (actions) {

           var loginView = new LoginView();
           loginView.automaticLogin();

        });

        app_router.on('route:offlineView', function (actions) {

           var offlineView = new OfflineView();
           offlineView.render();

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

        app_router.on('route:detailMessageView', function (PforceReload,PmsgID,PfolderID) {

          PfolderID = PfolderID.replace("#","");
          // console.log("detailMessageView");
          Shared.homeView.folderID = PfolderID;
          Shared.homeView.loadMessagesInFolder(PfolderID,'',PmsgID,PforceReload);


        });

        app_router.on('route:composeMessageView', function (secondViewName,msgID,folderID) {

          var composeMessageView = new ComposeMessageView();

          composeMessageView.secondViewName = secondViewName;
          composeMessageView.msgID = msgID;
          composeMessageView.folderID = folderID;
          composeMessageView.render();
          
        });

        app_router.on('route:composeMessageTo', function (secondViewName, emailTo) {

          var composeMessageView = new ComposeMessageView();
          composeMessageView.secondViewName = secondViewName;
          composeMessageView.emailTo = emailTo;

          var elementIndex = Shared.homeView.addTab(secondViewName,true);
          var elementID = "#content_" + elementIndex;
          

          composeMessageView.render(elementID);
          // Shared.menuView.closeMenu();

          // Shared.deviceType(Shared.isSmartPhoneResolution());
      
        });

        app_router.on('route:settingsListView', function (secondViewName) {

          var settingsListView = new SettingsListView();
          settingsListView.secondViewName = secondViewName;
          

          var elementIndex = Shared.homeView.addTab("Preferências",true);
          var elementID = "#content_" + elementIndex;

          settingsListView.render(elementID);

        });

        app_router.on('route:contactsListView', function (secondViewName) {

          var contListView = new ContactsListView();
          contListView.secondViewName = secondViewName;
          contListView.render();          
      
        });

        app_router.on('route:deleteContactsListView', function (secondViewName) {

          var contactsListView = new ContactsListView();
          contactsListView.secondViewName = secondViewName;
          contactsListView.status = 'OK';
          contactsListView.render();

          Shared.menuView.selectMenu(3);

          Shared.deviceType(Shared.isSmartPhoneResolution());
      
        });

        app_router.on('route:detailsContactView', function (secondViewName, contactID, status) {

          var detailsContactView = new DetailsContactView();
          detailsContactView.secondViewName = secondViewName;
          detailsContactView.contactID = contactID;
          detailsContactView.status = status;
          detailsContactView.render();

          Shared.menuView.selectMenu(3);

          Shared.deviceType(Shared.isSmartPhoneResolution());
      
        });

        app_router.on('route:addContactView', function (contactID, email) {

          var addContactView = new AddContactView();
          addContactView.contactID = contactID;
          addContactView.email = email;
          addContactView.render();

          Shared.menuView.selectMenu(3);

          Shared.deviceType(Shared.isSmartPhoneResolution());
        });

        app_router.on('route:deleteContactView', function (contactID) {

          var deleteContactView = new DeleteContactView();
          deleteContactView.contactID = contactID;
          deleteContactView.render();

          Shared.menuView.selectMenu(3);

          Shared.deviceType(Shared.isSmartPhoneResolution());
        });

        app_router.on('route:calendarListView', function (year, month, day, status) {

          var calendarListView = new CalendarListView();
          calendarListView.year = year;
          calendarListView.month = month;
          calendarListView.day = day;
          calendarListView.fullDay = false;
          calendarListView.status = status;
          calendarListView.render();

          Shared.menuView.selectMenu(2);

          Shared.deviceType(Shared.isSmartPhoneResolution());
      
        });

        app_router.on('route:calendarFullDayView', function (year, month, day) {

          var calendarFullDayListView = new CalendarFullDayListView();
          calendarFullDayListView.year = year;
          calendarFullDayListView.month = month;
          calendarFullDayListView.day = day;
          calendarFullDayListView.fullDay = true;
          
          calendarFullDayListView.render();

          Shared.menuView.selectMenu(2);

          Shared.deviceType(Shared.isSmartPhoneResolution());
      
        });

        app_router.on('route:calendarDetailsView', function (eventID, status) {

          var calendarDetailsView = new CalendarDetailsView();
          calendarDetailsView.eventID = eventID;
          calendarDetailsView.status = status;
          calendarDetailsView.render();

          Shared.menuView.selectMenu(2);

          Shared.deviceType(Shared.isSmartPhoneResolution());
      
        });

        app_router.on('route:calendarEditEventView', function (eventID) {

          var calendarEditEventView = new CalendarEditEventView();
          calendarEditEventView.eventID = eventID;
          calendarEditEventView.render();

          Shared.menuView.selectMenu(2);

          Shared.deviceType(Shared.isSmartPhoneResolution());
      
        });

        app_router.on('route:calendarAddEventView', function (year, month, day) {

          var calendarAddEventView = new CalendarEditEventView({year: year, month: month, day: day});
              calendarAddEventView.render();

          Shared.menuView.selectMenu(2);

          Shared.deviceType(Shared.isSmartPhoneResolution());
      
        });

        app_router.on('route:calendarDeleteEventView', function (eventID, year, month, day) {

          var calendarDeleteEventView = new CalendarDeleteEventView();
          calendarDeleteEventView.eventID = eventID;
          calendarDeleteEventView.year = year;
          calendarDeleteEventView.month = month;
          calendarDeleteEventView.day = day;
          calendarDeleteEventView.render();

          Shared.menuView.selectMenu(2);

          Shared.deviceType(Shared.isSmartPhoneResolution());
        });

        app_router.on('route:chatListView', function (secondViewName) {

          // var chatListView = new ChatListView();
          // chatListView.secondViewName = secondViewName;
          // chatListView.render();

          // Shared.menuView.selectMenu(4);
          // Shared.deviceType(Shared.isSmartPhoneResolution());
      
        });

        app_router.on('route:contextMenuView', function () {

          Shared.menuView.context.toggleMenu();
      
        });

        app_router.on('route:chatReconnectView', function () {

          Shared.chatReconnect();
      
        });


      return app_router;

    }
    
  });

  export default router;



