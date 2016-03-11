

import $ from 'jquery';
// import _ from 'underscore';
// import Backbone from 'backbone';
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

Polymer({
      is: 'home-view',
      properties: {

        behaviors: [
          AppPageBehavior
        ],

        // pageTitle: {
        //   type: String,
        //   value: ''
        // },

        // pageSubTitle: {
        //   type: String,
        //   value: ''
        // },

        currentFolderId: {
          type: String,
          value: 'INBOX'
        },

        // menuItems: {
        //   type: Array,
        //   value: [{iconClass: "create", route: "mail-create",title: "Escrever Email"}],
        // },

        searchActive: {
          type: Number,
          value: false
        },

        isLogged: {
          type: Boolean,
          value: false
        },

      },

      ready: function() {
        var that = this;
        var isLoggedFunction = function(isLogged) {
          if (isLogged) {
            that.loginToIm();
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


      listeners: {
        'evt-click-menu-fab-item': 'clickFabMenu',
        'evt-open-folder': '_openFolder',
        'evt-open-message': '_openMessage',
        'evt-open-contacts': '_openContacts',
        'evt-open-contact-detail' : '_openContactDetail',
        'evt-toolbar-search': '_openSearch',
        'user-has-logged-in': '_userLoggedIn',
        'user-has-logged-out': '_userLoggedOut',
      },

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
        this.updateExpressoVersion();
        page(this.baseUrl + 'mail-messages/INBOX');
      },
      _userLoggedOut: function(e) {
        console.log('_userLoggedOut');
        this.isLogged = false;
        $("#chatDesktop").empty();
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

             // if (Shared.isDesktop()) {

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

              // } else {
              //     Shared.im.resource("EXPRESSO_MOBILE").url(Shared.im_url).domain(Shared.im_domain);

              //     Shared.im
              //         .username(im_userName)
              //         .password(im_password)
              //         .connect();
              // }


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
        //this.currentFolderId = folder.folderID;
        //this.loadFolder(folder.folderID);
      },


      _openContacts: function() {
        var contactList = document.querySelector('#contactList');
        contactList.ignoreCache = false;
        contactList.reloadContent();
      },

      _openContactDetail: function(e) { 
        var folderid = e.detail.contactType;
        var msgid = e.detail.contactId;

        var mailDetail = document.querySelector('#contactDetail');
        mailDetail.folder = folderid;
        mailDetail.msg = msgid;

        mailDetail.loadMessage();
        //this.currentFolderId = folder.folderID;
        //this.loadFolder(folder.folderID);
      },

      loadFolder: function(folderId) {
        this.currentFolderId = folderId;
        // console.log(this.$.mailMessages);
        var mailMessages = document.querySelector('#mailMessages');
        mailMessages.folderId = folderId;

        // mailMessages.folderId = folderId;
        mailMessages.reloadFirstPage(false);
      },

      _onTapSearchButton: function(e) {
        e.stopPropagation();
        // console.log("evt-search-view");
        this.fire('evt-search-view', {view: this});
      },

      _onTapRefreshButton: function(e) {

        e.stopPropagation();
        console.log("Toolbar Refresh");
        this.fire('evt-toolbar-refresh');

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

      logoutUser: function(forceLogout) {

            $("#mainAppPageContent").empty();

            if (forceLogout == undefined) {
                forceLogout = true;
            }

            Shared.forceLogout = forceLogout;

            Shared.api.resource('Logout')
            .done(function(result) {

            })
            .fail(function(error) {

                Shared.handleErrors(error);

            })
            .execute();

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

            });

            Shared.router.navigate('Login', true);

        },

    });