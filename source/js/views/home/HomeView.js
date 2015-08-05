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
  'text!templates/home/homeTemplate.html',
  'material',
  'jquery_migrate',
  'jqueryui',
  'wijmo',
  'tinysort',
  'tinysort_open',
  'contextmenu',
  'linkify',
  'im',
], function($, _, Backbone, Shared, MessagesCollection, ServersCollection, MessagesListView, DetailMessageView, MenuView, homeTemplate,Material,jquery_migrate,jqueryui,wijmo,tinysort,tinysort_open,contextmenu,linkify,im){

/*
  'views/chat/ChatListView',
  'views/home/StatusBarView',
  'views/home/PopupView',
  'collections/home/PopupListCollection',
    

  ,ChatListView,StatusBar,Popup,PopupList,jquery_migrate,jqueryui,wijmo,tinysort,tinysort_open,contextmenu,linkify,im
*/
  var HomeView = Backbone.View.extend({

    folderID: 'INBOX',
    msgID: '0',
    search: '',
    page: '1',
    profile: null,

    menuView: null,
    menuOpen: false,

    el: $("#mainAppPageContent"),

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

      var compiledTemplate = _.template( homeTemplate, newData );
      this.$el.html( compiledTemplate ); 

      

      //this.$el.html(homeTemplate);
      //this.$el.css("width","100%");
      //this.$el.css("height","100%");
      //$("#mainAppPageContent").empty().append(this.$el);

      Material.upgradeDom();

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
      "click #menuButton": "toggleMenu",
      "click #menu_toggle": "toggleMenu",
      "click #chat_toggleRoster": "toggleChat",
      "click .listFolderItemLink": "selectFolderItem",
      "click .menuLink": "selectMenuItem",
      "click .listItemLink": "selectListItem",
      "click body": 'clickMainAppPageContent',
    },


	selectListItem: function(e){

      e.preventDefault();

      parent = $(e.target).parent();

      if (Shared.isDesktop()) {

        if(parent.find(".ink").length == 0)
          parent.prepend("<span class='ink'></span>");
          
        ink = parent.find(".ink");
        //incase of quick double clicks stop the previous animation
        ink.removeClass("animate");
        
        //set size of .ink
        if(!ink.height() && !ink.width())
        {
          //use parent's width or height whichever is larger for the diameter to make a circle which can cover the entire element.
          d = Math.max(parent.outerWidth(), parent.outerHeight());
          ink.css({height: d, width: d});
        }
        
        //get click coordinates
        //logic = click coordinates relative to page - parent's position relative to page - half of self height/width to make it controllable from the center;
        if (parent.offset() != undefined) {

          x = e.pageX - parent.offset().left - ink.width()/2;
          y = e.pageY - parent.offset().top - ink.height()/2;
        }

      }
      //set the position and add class .animate
      

      $('#scrollerList li').each(function() { 
          $(this).removeClass( 'selected' ); 
      }); 

      if (parent.hasClass("listItemLink")) {
        parent = parent.parent();
      }

      var gotoRoute = function() {
        Shared.router.navigate(e.currentTarget.getAttribute("href"),{trigger: true});
      };

      //if (Shared.isDesktop()) {
        //ink.css({top: y+'px', left: x+'px'}).addClass("animate");
        setTimeout(gotoRoute,500);
      // } else {
      //   var rowid = e.currentTarget.getAttribute("rowid");
      //   $("#" + rowid).addClass("selected");

      //   gotoRoute();
      // }


      

      

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

      var menuWidth = 0;
      var newPageWidth = $(window).width() - $("#chatContactsWindow").width();

      if ($("#menu").width() != 0) {

        Shared.menuOpen = false;
        //$("#menu").animate({width: "0px"}, 200);
        $("#mainPage").animate({"margin-left": "0px"}, 200);
        $("#mainPage").width(newPageWidth);
      } else {
        newPageWidth = newPageWidth - menuWidth;
        Shared.menuOpen = true;
        //$("#menu").animate({width: menuWidth + "px"}, 200);
        $("#mainPage").animate({"margin-left": menuWidth}, 200);
        $("#mainPage").width(newPageWidth);
      }

    },

    toggleMenu: function(e) {
      if (e != undefined) {
        e.preventDefault();
      }
      if (Shared.isDesktop()) {
        this.toggleMenuDesktop();
      } else {
        this.menuView.toggleMenu();
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
      var menuWidth = $("#scrollerMenu").width();
      var newPageWidth = $(window).width() - menuWidth;

      if ($("#chatContactsWindow").width() != 0) {
        $("#chatContactsWindow").animate({width: "0px"}, 200);
        $("#content").animate({width: newPageWidth}, 200);
        $(".expresso-fab-button").animate({ right: "16px" },200);
        
      } else {
        newPageWidth = newPageWidth - chatWidth;
        $("#chatContactsWindow").animate({width: chatWidth + "px"}, 200);
        $("#content").animate({width: newPageWidth}, 200);
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


        var menuWidth = $("#scrollerMenu").width();
        var newPageWidth = $(window).width() - menuWidth;
        var chatWidth = 250;

        if (Shared.isDesktop()) {

          if ($("#chatContactsWindow").width() == 0) {
            $("#chatContactsWindow").animate({width: "0px"}, 200);
            $("#content").animate({width: newPageWidth}, 200);
            $(".expresso-fab-button").animate({ right: "16px" },200);
            
          } else {
            newPageWidth = newPageWidth - chatWidth;
            $("#chatContactsWindow").animate({width: chatWidth + "px"}, 200);
            $("#content").animate({width: newPageWidth}, 200);
            $(".expresso-fab-button").animate({ right: "266px" },200);
          }

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


      // $('body').height($(window).height() - top);
      // $('#wrapper').css('top', top + search);

      if (Shared.betaVersion) {
        $("#beta").removeClass("hidden");
      }

     // this.fillLocalStorageTest();
      
    },

    // fillLocalStorageTest: function() {

    //   var iterationsData;
    //   var results = document.getElementById('textQuota');

    //   if (!('localStorage' in window)) {
    //       results.innerHTML = 'Your browser has no localStorage support.';
    //       return;
    //   }

    //   var n10b =    '0123456789';
    //   var n100b =   repeat(n10b, 10);
    //   var n1kib =   repeat(n100b, 10);
    //   var n10kib =  repeat(n1kib, 10);
    //   var n100kib = repeat(n10kib, 10);
    //   var n1mib =   repeat(n100kib, 10);
    //   var n10mib =  repeat(n1mib, 10);

    //   var values = [n10b, n100b, n1kib, n10kib, n100kib, n1mib, n10mib];

    //   iterationsData = [];
    //   for (var majorIndex = 1; majorIndex < values.length; majorIndex++) {
    //       var major = values[majorIndex];
    //       var minor = values[majorIndex - 1];
    //       for (var i = 1; i < 10; i++) {
    //           for (var j = 0; j < 10; j++) {
    //               iterationsData.push([major, minor, i, j]);
    //           }
    //       }
    //   }

    //   var index = 0;
    //   var oldLength = 0;

    //   function iteration() {
    //       var data = iterationsData[index];

    //       major = data[0];
    //       minor = data[1];
    //       i = data[2];
    //       j = data[3];

    //       var string = repeat(major, i) + repeat(minor, j);
    //       var length = '' + string.length;

    //       if (test(string)) {
    //           results.innerHTML = length + ' characters were stored successfully.';
    //       } else {
    //           results.innerHTML = oldLength + ' characters were stored successfully,  but ' + length + ' weren\'t.';
    //           return;
    //       }
    //       oldLength = length;

    //       index++;
    //       if (index < iterationsData.length) {
    //           setTimeout(iteration, 0);
    //       } else {
    //           results.innerHTML = oldLength + ' characters were saved successfully, test is stopped.';
    //       }
    //   }

    //   iteration();

    //   function test(value) {
    //       try {
    //           localStorage.test = value;
    //           return true;
    //       } catch (e) {
    //           return false;
    //       }
    //   }

    //   function repeat(string, count) {
    //       var array = [];
    //       while (count--) {
    //           array.push(string);
    //       }
    //       return array.join('');
    //   }

    // },




  });

  return HomeView;
  
});
