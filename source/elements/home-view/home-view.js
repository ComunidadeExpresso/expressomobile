

import $ from 'jquery';
import Shared from 'shared';
import jquery_migrate from 'jquery_migrate';
import jqueryui from 'jqueryui';
import wijmo from 'wijmo';
import wijdialog from 'wijdialog';
import tinysort from 'tinysort';
import linkify from 'linkify';
import im from 'im';
import page from 'page';
import AppPageBehavior from 'AppPageBehavior';
import SharedBehavior from 'SharedBehavior';

Polymer({
      is: 'home-view',
      properties: {

        behaviors: [
          AppPageBehavior,
          SharedBehavior,
        ],

        currentFolderId: {
          type: String,
          value: 'INBOX'
        },

        searchActive: {
          type: Number,
          value: false
        },

        refreshFolders: {
          type: Number,
          value: false,
          // notify: true,
          // reflectAttribute: true,
          observer: 'refreshFoldersChanged',
        },

        isLogged: {
          type: Boolean,
          value: false
        },

      },

      listeners: {
        'evt-click-menu-fab-item': 'clickFabMenu',
        'evt-open-folder': '_openFolder',
        'evt-create-message': '_createMessage',
        'evt-open-message': '_openMessage',
        'evt-open-contacts': '_openContacts',
        'evt-open-contact-detail' : '_openContactDetail',
        'evt-open-contact-edit' : '_openContactEdit',
        'evt-open-events-list' : '_openEventsList',
        'evt-open-event-edit' : '_openEventEdit',
        'evt-toolbar-search': '_openSearch',
        'user-has-logged-in': '_userLoggedIn',
        'user-has-logged-out': '_userLoggedOut',
      },

      ready: function() {
        var that = this;
        var isLoggedFunction = function(isLogged) {
          if (isLogged) {
            that.loginToIm();
            that.refreshMailFolders();
            that.updateExpressoVersion();
          }
        };
        this.isLoggedIn(isLoggedFunction);
      },


      /* BEGIN - AppPageBehavior Signals */
      _pageTitle : function(event,data) {
        this.pageTitle = data.title;
        this.pageSubTitle = data.subtitle;
      },

      _backButtonChange: function(event,data) {
        this.backButtonEnabled = data.enabled;
      },

      _refreshButtonChange: function(event,data) {
        this.refreshButtonEnabled = data.enabled;
        this.refreshButtonSignal = data.signal;
      },

      _isLoading: function(event,data) {
        if (data.enabled) {
          this.$.appHeaderLayout.style.backgroundImage = 'none';
        }
        this.isLoading = data.enabled;
      },

      _computeShowLoadingNextPageStyle: function(isLoadingActive) {
        if (isLoadingActive) {
          return '';
        } else {
          return 'display: none;';
        }
      },

      backButtonClicked: function() {
        window.history.back();
      },

      refreshButtonClicked: function() {
        this.fire('iron-signal', {
          name: this.refreshButtonSignal,
          data: {
            signal: this.refreshButtonSignal,
          }
        });
      },

      /* END - AppPageBehavior Signals */

      

      clickFabMenu: function(e) {
        e.stopPropagation();
        var route = e.target.get("currentMenu").get("item.route");

        var type = e.target.get("currentMenu").get("item.type");

        var extraData = e.target.get("currentMenu").get("item.data");

        var app = document.querySelector('#app');

        if (type == 'route') {
          console.log('route: ' + route);
          page(app.baseUrl + route);
        }

        if (type == 'signal') {
          console.log('signal: ' + route);
          this.fire('iron-signal', {
            name: route,
            data: {
              signal: route,
              data: extraData
            }
          });
          app.fire('iron-signal')
        }
        
      },

      _userLoggedIn: function(e) {
        console.log('_userLoggedIn');
        this.isLogged = true;
        this.loginToIm();
        this.refreshMailFolders();
        this.updateExpressoVersion();
        page(this.baseUrl + 'mail-messages/INBOX');
      },
      _userLoggedOut: function(e) {
        console.log('_userLoggedOut');
        this.isLogged = false;
        $("#chatDesktop").empty();
      },

      refreshFoldersChanged: function(value) {
          //console.log('refreshFoldersChanged');
          if (value == true) {
              this.refreshFolders = false;
          }
      },

      refreshMailFolders: function() {
        this.refreshFolders = true;
      },

      loginToIm: function() {
        console.log("loginToIm");
        if (Shared.userHasModule("chat")) {

          Shared.api.resource('Services/Chat').params({}).done(function(resultChat) {

              Shared.im_resource = resultChat.A;
              Shared.im_url = resultChat.B;
              Shared.im_domain = resultChat.C;
              var im_userName = resultChat.D;
              var im_password = resultChat.E + "==";

              $("#chatDesktop").im({
                  "resource": "JABBER_IM_PR",
                  "url": Shared.im_url,
                  "domain": Shared.im_domain,
                  "username": im_userName,
                  "password": im_password,
                  "debug": false,
                  "soundPath": "libs/messenger/",
                  "height": $("#chatContactsWindow").height() - $(".chat-title").height() - 30,
                  "minimizeZone": "minimizedWindows",
              });

          }).execute();

        }
      },

      updateExpressoVersion: function() {
        Shared.api.resource('ExpressoVersion').params({}).done(function(resultExpressoVersion) {

          Shared.apiVersion = resultExpressoVersion.apiVersion;
          Shared.expressoVersion = resultExpressoVersion.expressoVersion;

          Shared.refreshSettings();

        }).execute();
      },

      toolbarChange: function(e, detail, sender) {
        console.log('toolbarChange');
        console.log(detail);
        this.pageTitle = detail.title;
        this.pageSubTitle = detail.subtitle;
      },

      _openSearch: function(e) {
        if (this.isLogged) {
          console.log("_openSearch");
          this.searchActive = true;
        }
      },

      closeSearch: function() {
        if (this.searchActive) {
          this.searchActive = false;
        }
      },

      _createMessage: function(e) {
        if (this.isLogged) {
          var mailCreate = this.$.mailCreate;
          mailCreate.refresh();
        }
      },

      _openFolder: function(e) { 
        if (this.isLogged) {
          var folder = e.detail.folder;
          this.currentFolderId = folder.folderID;
          this.loadFolder(folder.folderID);
        }
        
      },
      _openMessage: function(e) { 
        if (this.isLogged) {
          var folderid = e.detail.folderid;
          var msgid = e.detail.msgid;

          var mailDetail = document.querySelector('#mailDetail');
          mailDetail.folder = folderid;
          mailDetail.msg = msgid;

          mailDetail.loadMessage();
        }
      },

      _updateBackgroundImage: function() {

        var number = Math.floor((Math.random() * 12) + 1);
        var image = 'bkg_' + number + '.jpg';

        // var card = Shared.getRandomCardBackground('../../imgs/paper-card-backgrounds/');
        this.$.appHeaderLayout.style.backgroundImage = 'url(../../imgs/material_backgrounds/' + image + ')';
        //this.cardImage = card;
      },


      _openContacts: function() {
        var contactList = document.querySelector('#contactList');
        contactList.reloadContent(false);
      },

      _openContactDetail: function(e) { 

        // console.log("_openContactDetail");
        // console.log(e.detail);

        this.closeSearch();

        var contactCard = this.$.contactCard;

        contactCard.contactType = e.detail.contactType;
        contactCard.contactId = e.detail.contactId;
        contactCard.refresh();

      },

      _openContactEdit: function(e) { 

        console.log("_openContactEdit");

        this.closeSearch();

        var contactCard = this.$.contactEdit;

        contactCard.contactType = e.detail.contactType;
        contactCard.contactId = e.detail.contactId;
        contactCard.refresh();

      },

      _openEventsList: function(e) {
        var eventsList = this.$.eventsList;
        console.log('_openEventsList');
        console.log(e.detail);

        if (e.detail.curDate != undefined) {
          eventsList.curDate = moment(e.detail.curDate,["DD-MM-YYYY"]);
        } else {
          eventsList.curDate = moment();
        }
        if (e.detail.eventID != undefined) {
          eventsList.eventID = e.detail.eventID;
        } else {
          eventsList.eventID = '';
        }
        if (e.detail.selected != undefined) {
          eventsList.selected = e.detail.selected;
        } else {
          eventsList.selected = 0;
        }
        if (e.detail.selectedPage != undefined) {
          eventsList.selectedPage = e.detail.selectedPage;
        } else {
          eventsList.selectedPage = 0;
        }
        eventsList.refresh();
      },

      _openEventEdit: function(e) {
        var eventCard = this.$.eventCard;
        console.log('_openEventEdit');
        console.log(e.detail);
        eventCard.eventID = e.detail.eventID;
        eventCard.refresh();
      },

      loadFolder: function(folderId) {
        this.currentFolderId = folderId;
        // console.log(this.$.mailMessages);
        var mailMessages = document.querySelector('#mailMessages');
        mailMessages.folderId = folderId;
        mailMessages.reloadFirstPage(false);
      },


      isLoggedIn: function(callback) {
        var that = this;
        Shared.api.getLocalStorageValue("expresso",function(expressoValue) {
          if (expressoValue != null) {
            var authValue = expressoValue.auth;

            if (authValue != null) {
              Shared.api.auth(authValue);
            }

            Shared.profile = expressoValue.profile;

          }

          if ((Shared.api.auth())) {
            that.isLogged = true;
          } else {
            that.isLogged = false;
          }

          callback(that.isLogged);

          // console.log("isLoggedIn: " + that.isLogged);

        });

      },

      _logoutUser: function(forceLogout) {

        // $("#mainAppPageContent").empty();

        // if (forceLogout == undefined) {
        //     forceLogout = true;
        // }

        // Shared.forceLogout = forceLogout;

        var that = this;

        var sucessFunction = function (result) { 

        };

        var errorFunction = function (error) { 
          that.handleErrors(error);
        };


        Shared.api.resource('Logout').done(sucessFunction).fail(errorFunction).execute();

        Shared.api.getLocalStorageValue("expresso", function(expressoValue) {

            var isPhoneGap = Shared.api.phoneGap();

            expressoValue.auth = "";
            expressoValue.profile = "";
            expressoValue.username = "";
            expressoValue.password = "";
            expressoValue.phoneGap = isPhoneGap;
            expressoValue.serverAPI = "";

            if (Shared.isAndroid()) {
                Shared.service.disableTimer();
                Shared.service.stopService();
            }

            Shared.api.setLocalStorageValue("expresso", expressoValue);

            that._userLoggedOut();

        });

        },



    });