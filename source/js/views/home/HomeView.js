define([
  'jquery',
  'underscore',
  'backbone',
  'shared',
  'collections/mail/MessagesCollection',
  'collections/home/ServersCollection',
  'views/mail/MessagesListView',
  'views/mail/DetailMessageView',
  'views/home/MenuView',
  'views/mail/PullToActionView',
  'text!templates/home/homeTemplate.html',
  'material',
  'jquery_migrate',
  'jqueryui',
  'wijmo',
  'tinysort',
  'contextmenu',
  'linkify',
  'im',
], function($, _, Backbone, Shared, MessagesCollection, ServersCollection, MessagesListView, DetailMessageView, MenuView,PullToActionView, homeTemplate,Material,jquery_migrate,jqueryui,wijmo,tinysort,contextmenu,linkify,im){


  var HomeView = Backbone.View.extend({

    folderID: 'INBOX',
    msgID: '0',
    search: '',
    page: '1',
    profile: null,

    menuView: null,
    menuOpen: false,


    initialize:function() {
      $(window).on("resize",this.refreshWindow);

      //CARREGA A VIEW DO MENU
      var mView = new MenuView();
      this.menuView = mView;

      //SALVA A VIEW DO MENU NO SHARED
      Shared.menuView = mView;

      //Shared.Popups = new PopupList();

    },

    remove: function() {
      $(window).off("resize",this.refreshWindow);
      //call the superclass remove method
      Backbone.View.prototype.remove.apply(this, arguments);
    },

    render: function(){

      var newData = {
        _: _,
        Shared: Shared
      };


      var htmlTemplate = _.template( homeTemplate );
      var compiledTemplate = htmlTemplate(newData);

      this.$el.html(compiledTemplate);
      this.$el.css("width","100%");
      this.$el.css("height","100%");
      $("#mainAppPageContent").empty().append(this.$el);

      

      window.componentHandler.upgradeDom();

      var that = this;

      Shared.api.getLocalStorageValue("expresso",function(expressoValue) {

        if (expressoValue != null) {

          Shared.profile = expressoValue.profile;

          var userName = expressoValue.username;
          var passwd = Shared.password;

          Shared.api.phoneGap(expressoValue.phoneGap);

          if (expressoValue.phoneGap) {
            Shared.api.context(expressoValue.serverAPI).crossdomain(expressoValue.serverAPI);
          } else {
            Shared.api.context(Shared.context).crossdomain(expressoValue.serverAPI);
          }

        }

        if (Shared.userHasModule("chat")) {


          Shared.api.resource('Services/Chat').params({}).done(function(resultChat){

            Shared.im_resource = resultChat.A;
            Shared.im_url = resultChat.B;
            Shared.im_domain = resultChat.C;
            var im_userName = resultChat.D;
            var im_password = resultChat.E + "==";

            if (Shared.isDesktop()) {

              $("#chatDesktop").im({
                "resource"  : "JABBER_IM_PR",
                "url"   :Shared.im_url,
                "domain"  : Shared.im_domain,
                "username"  : im_userName,
                "password"  : im_password,
                "debug"   : false,
                "soundPath" : "libs/messenger/",
                "height"  : $("#chatContactsWindow").height() - $(".chat-title").height() - 30,
                "minimizeZone" : "minimizedWindows",
              });




            } else {
              Shared.im.resource("EXPRESSO_MOBILE").url(Shared.im_url).domain(Shared.im_domain);

              Shared.im
              .username(im_userName)
              .password(im_password)
              .connect();
            }
            

          }).execute();

        }

        Shared.api.resource('ExpressoVersion').params({}).done(function(resultExpressoVersion){


          Shared.apiVersion = resultExpressoVersion.apiVersion;
          Shared.expressoVersion = resultExpressoVersion.expressoVersion;
        

          Shared.refreshSettings();

          that.menuView = new MenuView( { el : $("#scrollerMenu") });
          that.menuView.profile = that.profile;
          that.menuView.render();

          if (Shared.isDesktop()) {
            //$("#menuButton").hide();
            //that.menuView.openMenu();
            //that.toggleChat();
            that.refreshWindow();
          }


         
          Shared.setDefaultIMListeners();
          Shared.BlinkWindowTitle();

          
           if (Shared.gotoRoute == false) {

              if (Shared.userHasModule("mail")) {

                if ((Shared.isSmartPhoneResolution()) && (Shared.newMessageIntent == true)) {
         
                  Shared.newMessageIntent = false;
                  Shared.router.navigate("/Mail/Message/New", {trigger: true});

                } else {
                  that.menuView.selectMenu(1);
                  that.loadMessagesInFolder(that.folderID,that.search,'','1');
                  that.loaded();
                }
 
              } else {

                if (Shared.userHasModule("calendar")) {
                  that.menuView.selectMenu(2);
                  Shared.router.navigate("/Calendar",{ trigger: true });
                } else {
                  if (Shared.userHasModule("catalog")) {
                    that.menuView.selectMenu(3);
                    Shared.router.navigate("/Contacts/Personal",{ trigger: true });
                  } else {
                    if (Shared.userHasModule("chat")) {
                      that.menuView.selectMenu(4);
                      Shared.router.navigate("/Chat",{ trigger: true });
                    } else {
                      that.menuView.selectMenu(5);
                      Shared.router.navigate("/Settings",{ trigger: true });
                    }
                  }
                } 
              }


          } else {

            that.loaded();
          }

          Shared.scheduleCheckForNewMessages();

        }).execute();

    
      });

      
      
    },

    loadMessagesInFolder: function(Pfolder,Psearch,PmsgID,PforceReload) {

      this.msgID = PmsgID;

      Shared.menuView.setMailBadge(0);

      var messagesListView = new MessagesListView({ folderID: Pfolder, search: Psearch, page: this.page, msgID: PmsgID });
      messagesListView.folderID = Pfolder;
      messagesListView.msgID = PmsgID;
      messagesListView.forceReload = PforceReload;
      messagesListView.render();
      
    },

    events: {
      // "click #menuButton": "toggleMenu",
      // "click #menu_toggle": "toggleMenu",
      // "click .listFolderItemLink": "selectFolderItem",
      "click #chat_toggleRoster": "toggleChat",
      "click .menuLink": "selectMenuItem",
      "click .listItemLink": "selectListItem",
    },


	selectListItem: function(e){

      e.preventDefault();

      parent = $(e.target).parent();
      
      $('#scroller li').each(function() { 
          $(this).removeClass( 'selected' ); 
      }); 

      if (parent.hasClass("listItemLink")) {
        parent = parent.parent();
      }

      var rowid = e.currentTarget.getAttribute("rowid");
      // console.log(rowid);
      if (rowid != undefined) {
        $("#" + rowid).addClass("selected");
      }

      Shared.router.navigate(e.currentTarget.getAttribute("href"),{trigger: true});
      

    },

    selectMenuItem: function(e){
      e.preventDefault();
      Shared.router.navigate(e.currentTarget.getAttribute("href"),{trigger: true});
    },

    selectFolderItem: function(e){
      e.preventDefault();
      Shared.router.navigate(e.currentTarget.getAttribute("href"),{trigger: true});
    },

    toggleMenuDesktop: function(e) {
      if (e != undefined) {
        e.preventDefault();
      }

    },

    toggleMenu: function(e) {
      if (e != undefined) {
        e.preventDefault();
      }

    },

    toggleContextMenu: function() {
      this.menuView.context.toggleMenu();
    },

    toggleChat: function(e) {
      if (e != undefined) {
        e.preventDefault();
      }

      var chatWidth = 250;
      var menuWidth = 0;
      if (!$("#mainPage").hasClass("is-small-screen")) {
         menuWidth = $("#menu").width();
      }
      var newPageWidth = $(window).width() - menuWidth;

      if ($("#chatContactsWindow").width() != 0) {
        $("#chatContactsWindow").animate({width: "0px"}, 200);
        $("#pageContent").animate({width: newPageWidth}, 200);
        $(".expresso-fab-button").animate({ right: "16px" },200);
        
      } else {
        newPageWidth = newPageWidth - chatWidth;
        $("#chatContactsWindow").animate({width: chatWidth + "px"}, 200);
        $("#pageContent").animate({width: newPageWidth}, 200);
        $(".expresso-fab-button").animate({ right: "266px" },200);
      }
      

      // .width('0');

      //this.refreshWindow();

      //$("#chatDesktop").toggle();
      //$("#mainMenuChat").toggleClass("selected");

      // var chatListView = new ChatListView();
      // chatListView.secondViewName = null;
      // chatListView.render();

      // this.refreshWindow();



      // Shared.menuView.selectMenu(4);
      // Shared.deviceType(Shared.isSmartPhoneResolution());

    },


    refreshWindow: function() {

      var that = this;

      var doneResizing = function() {

        var menuWidth = 0;
        if (!$("#mainPage").hasClass("is-small-screen")) {
           menuWidth = $("#menu").width();
        }
        var newPageWidth = $(window).width() - menuWidth;
        var chatWidth = 250;

        if (Shared.isSmartPhoneResolution()) {
          $("#contentDetail").addClass("hidden");
        } else {
          $("#contentDetail").removeClass("hidden");
        }

        

        if (Shared.isDesktop()) {

          if ($("#chatContactsWindow").width() == 0) {
            $("#chatContactsWindow").animate({width: "0px"}, 200);
            $("#pageContent").animate({width: newPageWidth}, 200);
            $(".expresso-fab-button").animate({ right: "16px" },200);

            // $("#content").css("height",$(window).height() -  $(".mdl-layout__header-row").height()  - 16 );
            // $("#contentDetail").css("height",$(window).height() -  $(".mdl-layout__header-row").height()  - 16 );
            
          } else {
            newPageWidth = newPageWidth - chatWidth;
            $("#chatContactsWindow").animate({width: chatWidth + "px"}, 200);
            $("#pageContent").animate({width: newPageWidth}, 200);
            $(".expresso-fab-button").animate({ right: "266px" },200);

            //$("#content").css("height",$(window).height() -  $(".mdl-layout__header-row").height());
            //$("#contentDetail").css("height",$(window).height() -  $(".mdl-layout__header-row").height());
          }

        } else {
            $("#chatContactsWindow").animate({width: "0px"}, 200);
            $("#pageContent").animate({width: newPageWidth}, 200);
            $(".expresso-fab-button").animate({ right: "16px" },200);

            //$("#content").css("height",$(window).height() -  $(".mdl-layout__header-row").height());
            //$("#contentDetail").css("height",$(window).height() -  $(".mdl-layout__header-row").height());
        }

        // console.log('doneResizing');
        // var top = $('.topHeader').outerHeight(true);
        // var chat = $('.chatArea').outerHeight(true) == null ? 0 : $('.chatArea').outerHeight(true);

        // var search = $('#content .searchArea').outerHeight(true) == null ? 0 : $('#content .searchArea').outerHeight(true);
        // var searchDetail = $('#contentDetail .searchArea').outerHeight(true) == null ? 0 : $('#contentDetail .searchArea').outerHeight(true);
        
        // if (Shared.forceSmartPhoneResolution == false) {
        //   if (Shared.isSmartPhoneResolution()) {
        //     Shared.forceSmartPhoneResolution = true;
        //   }
        // }

        // Shared.deviceType(Shared.forceSmartPhoneResolution);

        // $('body').height($(window).height() - top);
        // $('#wrapper').css('top', top + search);
        // $('#wrapperDetail').css('top', top + chat + searchDetail);

        // if (Shared.isDesktop()) {
        //   $("#chatDesktop").height($("#chatContactsWindow").height() - $(".chat-title").height() - 30);
        //   $("#mainPage").height($("#menu").height());
        // } 
        

        // $('#scrollerDetail').css('width', $("#wrapperDetail").width() );

        // $.each($("#contentMessageBody img"), function() {

        //   var max_width = $("#wrapperDetail").width();
        //   max_width = max_width - 40;
        //   var current_height = $(this).height();
        //   var current_width = $(this).width();
        //   var new_width = max_width;
        //   var new_height = max_width * (current_height / current_width);
        //   $("#contentMessageBody").width(max_width);
        //   $(this).css("height",new_height);
        //   $(this).css("width",new_width);

        // });

        // Shared.scrollerRefresh();
      }

      clearTimeout(this.idResize);
      this.idResize = setTimeout(doneResizing, 500);
    },

    loaded: function () 
    {
      
      if (Shared.gotoRoute != false) {
        Shared.router.navigate(Shared.gotoRoute,{ trigger: true });
        Shared.gotoRoute = false;
      }

      // var top = $('.topHeader').outerHeight(true);

      // if (!Shared.isAndroid() && Shared.isPhonegap()) {
      //   top = top + 20;
      // }

      // var search = $('#content .searchArea').outerHeight(true) == null ? 0 : $('#content .searchArea').outerHeight(true);

      // var isSmartPhoneResolution = ($(window).width() < 720);
      // if (isSmartPhoneResolution) {
      //   Shared.forceSmartPhoneResolution = true;
      // }
      
      // // Verify screen width to define device type
      // Shared.deviceType(Shared.forceSmartPhoneResolution);

      
    },


  });

  return HomeView;
  
});
