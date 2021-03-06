// Filename: shared.js
import _ from 'underscore';
import $ from 'jquery';
import Backbone from 'backbone';
import expressoAPI from 'expressoAPI';
import expressoIM from 'expressoIM';
// import UserMessageView from 'UserMessageView';
import expressoService from 'expressoService';

import elements from 'elements';


  var Shared = {};

  Shared.usersPictures = [];

  Shared.addUserPicture = function(Pemail,Ppicture) {
    //console.log("addUserPicture:" + Pemail + " - " + Ppicture);
    var data = {
      email: Pemail,
      picture: Ppicture,
    }
    Shared.usersPictures.push(data);
  }

  Shared.getUserPicture = function(Pemail) {
    var picFound = false;
    _.each(Shared.usersPictures,function(data) {
      if (data.email == Pemail) {
        picFound = data.picture;
      }
    });
    return picFound;
  }

  //USE THIS IF YOU WANT TO SET THIS VERSION AS BETA FOR YOUR USERS.
  Shared.betaVersion = false;
  Shared.betaTesters = [];

  //USE THIS IF YOU WANT TO TEMPORARIALY DISPLAY AN OUT OF SERVICE PAGE.
  Shared.versionIsActive = true;

  Shared.backButtonClicked = function() {};

  if (Shared.betaVersion) {
    Shared.appVersion = "BETA";
  } else {
    Shared.appVersion = "1.2";
  }

  Shared.apiVersion = '';
  Shared.expressoVersion = '';
  
  if ((IS_BUILTINEXPRESSO == undefined) || (IS_BUILTINEXPRESSO == false)) {
    Shared.serverContext = "";
  } else {
    Shared.serverContext = "/email";
  }

  Shared.context = Shared.serverContext + "/api/";

  Shared.ComunityServerURL = "http://api.expressolivre.org/";

  Shared.settings = {};

  Shared.settings.resultsPerPage = 25;
  Shared.settings.mailSignature = "Mensagem enviada pelo Expresso Mobile.";

  Shared.timeoutDelay = 0;

  Shared.scrollDetail = null;
  Shared.scroll = null;
  Shared.scrollMenu = null;

  Shared.lastCheckDate = null;

  Shared.forceSmartPhoneResolution = true;

  Shared.forceLogout = false;
  
  Shared.im = expressoIM;
  Shared.api = expressoAPI;
  Shared.service = expressoService;

  Shared.contentView = null;
  Shared.detailView = null;

  //USED WHEN THE ANDROID SEND FILES AND OPENS A NEW COMPOSE MESSAGE.
  Shared.gotoRoute = false;
  Shared.newMessageIntent = false;
  Shared.newMessageFiles = false;

  //MAXIMUM ALLOWED UPLOAD FILES IN ATTACHMENTS
  Shared.max_upload_file_size = 10240; //IN KBYTES

  //MAXIMUM QUANTITY OF FILES IN EVERY MESSAGE.
  Shared.max_upload_file_qtd = 20; 


  //MENSAGE THAT IT'S BEING COMPOSED.
  Shared.currentDraftMessage = '';

  Shared.automaticLoginAccounts = { accounts: [] };
  Shared.forceAutomaticLoginInAccountName = false;

  Shared.disabledModules = [];

  Shared.menuOpen = false;

  Shared.isBuiltInExpresso =  function() {

    //IS_BUILTINEXPRESSO = true; 
    if (IS_BUILTINEXPRESSO) {
      if (Shared.isDesktop()) {
        //Shared.forceSmartPhoneResolution = true;
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }

    
  }


  //CHECKS IF THE DEVICE IS AN SMARTPHONE OR AN TABLET RESOLUTION
  Shared.isTabletResolution = function() {
    var retVal = ($(window).width() >= 720);
    if (Shared.forceSmartPhoneResolution) {
      retVal = false;
    }
    return retVal;
  };
  Shared.isSmartPhoneResolution = function() {
    return !Shared.isTabletResolution();
  };

  //CHECKS IF THE USER IS IN A BROWSER IN A DESKTOP OR IN A PHONEGAP APPLICATION
  Shared.isDesktop = function() {
    var retVal = true;
    retVal = true;
    if (Shared.isPhonegap() || (Shared.isAndroid()) || (Shared.isIDevice())) {
      retVal = false;
    }
    //return false;
    return retVal;
  };
  Shared.isPhonegap = function() {
    return Shared.api.phoneGap();
  };

  //CHECKS IF THE DEVICE IS AN ANDROID OR AN IPHONE/IPAD DEVICE.
  Shared.isAndroid = function() {
    return (/android/gi).test(navigator.appVersion);
  };
  Shared.isIDevice = function() {
    return (/iphone|ipad/gi).test(navigator.appVersion);
  };

  Shared.getRandomCardBackground = function() {
    var number = Math.floor((Math.random() * 12) + 1);
    var image = 'bg-landscape-ipad-' + number + '.jpg';
    return image;
  };

  Shared.scrollerRefresh = function () {
    // console.log("Shared.scrollerRefresh");
    // if (Shared.scrollDetail) {
    //   Shared.scrollDetail.refresh();
    // }
    // if (Shared.scroll) {
    //   Shared.scroll.refresh();
    // }
    // if (Shared.scrollMenu) {
    //   Shared.scrollMenu.refresh();
    // }
  };

  Shared.reloadPage = function() {
    Shared.reloadCurrentPageFunction();
  };
  //THIS FUNCTION NEEDS TO BE CHANGED FOR EACH CURRENT VIEW
  Shared.reloadCurrentPageFunction = function() { };

  Shared.bytesToSize = function(bytes, precision) {  
      var kilobyte = 1024;
      var megabyte = kilobyte * 1024;
      var gigabyte = megabyte * 1024;
      var terabyte = gigabyte * 1024;
     
      if ((bytes >= 0) && (bytes < kilobyte)) {
          return bytes + ' B';
   
      } else if ((bytes >= kilobyte) && (bytes < megabyte)) {
          return (bytes / kilobyte).toFixed(precision) + ' KB';
   
      } else if ((bytes >= megabyte) && (bytes < gigabyte)) {
          return (bytes / megabyte).toFixed(precision) + ' MB';
   
      } else if ((bytes >= gigabyte) && (bytes < terabyte)) {
          return (bytes / gigabyte).toFixed(precision) + ' GB';
   
      } else if (bytes >= terabyte) {
          return (bytes / terabyte).toFixed(precision) + ' TB';
   
      } else {
          return bytes + ' B';
      }
  };

  Shared.setCurrentView = function(type,view) {

    if (type == 1) {
      if (Shared.contentView != null) {
        Shared.contentView.undelegateEvents();
      }
      Shared.contentView = view;
    } else {
      if (Shared.isSmartPhoneResolution()) {
        if (Shared.contentView != null) {
          Shared.contentView.undelegateEvents();
        }
        Shared.contentView = view;
      } else {
        if (Shared.detailView != null) {
          Shared.detailView.undelegateEvents();
        }
        Shared.detailView = view;
      }
    }
  };

  Shared.setCurrentPageTitle = function(title) {
    // $("#currentPageTitle").html(title);
  };

  Shared.refreshSettings = function() {

    Shared.api.resource('ExpressoVersion').params({}).done(function(result){

      Shared.apiVersion = result.apiVersion;
      Shared.expressoVersion = result.expressoVersion;

      if (Shared.apiVersion != "1.0") {
        Shared.api
        .resource('Preferences/UserPreferences')
        .params({"module": "mail"})
        .done(function(result){

          var rpp = 25;
          var mailsign = "Mensagem enviada pelo Expresso Mobile.";
          var typeSignature = "html";

          if (result.mail != undefined) {
            rpp = result.mail.max_email_per_page;
            mailsign = result.mail.signature;
            typeSignature = result.mail.type_signature;
          }

          Shared.settings.resultsPerPage = rpp;
          Shared.settings.mailSignature = mailsign;
          Shared.settings.typeSignature = typeSignature;

          Shared.saveSettingsToLocalStorage();


        }).fail(function(result) {

        }).execute();
      }

    }).fail(function(result) {

    }).execute();

  };

  // Shared.showMessage = function(message, msgType) {

  // };

  Shared.showMessage = function( message) {
    console.log(message);
    // var messageView = new UserMessageView();
    // messageView.msgType = message.type;
    // messageView.msgTitle = message.title;
    // messageView.msgDescription = message.description;
    // messageView.elementID = message.elementID;
    // messageView.msgRoute = message.route;
    // messageView.msgIcon = message.icon;
    // messageView.timeout = message.timeout;
    // if (message.animate == false) {
    //   messageView.animate = false;
    // }
    // messageView.render();
  };

  Shared.deviceType = function(smartphone) {
    if (smartphone) {
      $('body').addClass('smartphone');
      //$('#pageHeader').addClass('smartphone');
    } else { 
      $('body').removeAttr('class');
      //$('#pageHeader').removeClass('smartphone');
    }
  };

  Shared.saveSettingsToLocalStorage = function() {

    Shared.api.getLocalStorageValue("expresso",function(expressoValue) {

      if (expressoValue == undefined) {
        var expressoValue = {};
      }

      expressoValue.settings = Shared.settings;

      Shared.api.setLocalStorageValue("expresso",expressoValue);

    });

  };

  Shared.handleErrors = function(error,preferences) {

    if (error.code == 100) {
      if (preferences != undefined) {

      }
      Shared.showMessage({
          type: "error",
          icon: 'icon-expresso',
          title: "Verifique sua conexão com a Internet...",
          description: "",
          timeout: 3000,
          elementID: "#pageMessage",
        });
    }

    if ((error.code == 7) || (error.code == 3)) {

      var expressoValues = {
        auth: "", 
        "profile": "",
        username: "", 
        password: "",
        phoneGap: "",
        serverAPI: "",
        settings: { 
          resultsPerPage: 30,
          automaticLogin: false,
          mailSignature: '',
        }
      };

      Shared.api.setLocalStorageValue("expresso",expressoValues);

      Shared.showMessage({
          type: "error",
          icon: 'icon-expresso',
          title: "Sua sessão expirou...",
          description: "",
          timeout: 0,
          elementID: "#pageMessage",
        });

        setTimeout(function() {

          Shared.router.navigate('Login',{trigger: true});

        },2000);

    }
  };

  Shared.scheduleCheckForNewMessages = function() {
    Shared.checkForNewMessages();
    setInterval(Shared.checkForNewMessages, 70000);

    // setInterval(Shared.refreshFolders, 3 * 60000);
  };

  Shared.refreshFolders = function() {
    if (Shared.userHasModule("mail")) {
      Shared.menuView.refreshFolders();
    }
  }

  Shared.checkForNewMessages = function() {
    if (Shared.userHasModule("mail")) {

      Shared.api.resource('/Mail/Messages').params({folderID: "INBOX", search: "",page:1,resultsPerPage:"25",msgID:""}).ignoreCache(true).done(function(result){

        var qtdUnreadMessages = 0;
        var lastMessage = '';

        var unreadMessages = [];

        _.each(result.messages, function(message){ 

          var date = moment(message.msgDate + ":59", "DD/MM/YYYY HH:mm:ss").unix();

          if (Shared.lastCheckDate != null) {

            if (date > (Shared.lastCheckDate / 1000)) {

              qtdUnreadMessages = qtdUnreadMessages + 1;
              lastMessage = message;

              unreadMessages.push(message);
            }

          }

        });

        if (qtdUnreadMessages > 0) {

          var msgRoute = "";
          var msgTitle = "";
          var msgDescription = "";

          if (qtdUnreadMessages == 1) {
            msgRoute = "/Mail/Messages/1/" +  lastMessage.msgID + "/INBOX";
            msgTitle = lastMessage.msgSubject;
            msgDescription = lastMessage.msgFrom.mailAddress;
          } else {
            msgRoute = "/Mail/Messages/1/0/INBOX";
            msgTitle = "Você tem " + qtdUnreadMessages + " novas mensagens.";
            msgDescription = "";
          }

          Shared.showMessage({
            type: "chat-message",
            icon: 'icon-expresso',
            title: msgTitle,
            description: msgDescription,
            route: msgRoute,
            timeout: 5000,
            elementID: "#pageMessage",
          });

          Shared.menuView.setMailBadge(qtdUnreadMessages);
          
        }

        Shared.lastCheckDate = Date.now();

      }).fail(function(result) {

      }).execute();
    }
  };


  Shared.windowTitle = "Expresso";
  Shared.BlinkWindowTitle = function(title) {

    if (Shared.isDesktop()) {

      Shared.stopBlinkWindowTitle();
      Shared.blinkTitleInterval = window.setInterval(function () {

        var msg = '';

        var qtd_chat = 0;
        if (Shared.userHasModule("chat")) {
          qtd_chat = Shared.im.qtdUnreadMessages();
        }

        var qtd_mail = 0;
        if (Shared.userHasModule("mail")) {
          qtd_mail = $("#badge_inbox").html();
          if (qtd_mail != undefined) {
            if (qtd_mail.trim() == '') {
              qtd_mail = 0;
            }
          }
        }

        if (qtd_mail == undefined) 
        {
          qtd_mail = 0;
        }

        var qtd_total = qtd_chat + qtd_mail;

        var msg_mail = '';
        if (qtd_mail != 0) {
          var msg_mail =  qtd_mail + ' Emails';
        }
        if (qtd_mail == 1) {
          msg_mail = qtd_mail + ' Email';
        }

        var msg_chat = '';

        if (qtd_chat != 0) { 
          msg_chat = qtd_chat + ' Msgs';
        }
        if (qtd_chat == 1) {
          msg_chat = qtd_chat + ' Msg';
        }

        if (msg_mail != '') {
          msg = msg_mail;
        }
        if (msg_chat != '') {
          if (msg_mail != '') {
            msg = msg_mail + " - " + msg_chat;
          } else {
            msg = msg_chat;
          }
          
        }

        if (qtd_total == 0) {
          msg = Shared.windowTitle;
        }

          document.title = document.title === Shared.windowTitle ? msg : Shared.windowTitle;
      }, 1000);

    }
  };

  Shared.stopBlinkWindowTitle = function() {
      window.clearInterval(Shared.blinkTitleInterval);
      document.title = Shared.windowTitle;
  };

  Shared.setDefaultIMListeners = function() {

    Shared.im.clearListeners();

    var onMessageFunction = function (message) { 

      Shared.menuView.setChatBadge(Shared.im.qtdUnreadMessages());

      var message = {
        type: "chat-message",
        icon: 'icon-jabber',
        title: message.body,
        description: message.jid,
        route: "/Chat/" + message.id,
        timeout: 3000,
        elementID: "#pageMessage",
      }

      var qtd_chat = Shared.im.qtdUnreadMessages();

      Shared.showMessage(message);

    };

    var onComposingFunction = function (message) { 

    };

    Shared.im.addOnMessageListener(onMessageFunction);
    Shared.im.addOnErrorListener(Shared.onIMErrorFunction);
    Shared.im.addOnDisconnectListener(Shared.onIMDisconnectFunction);
  };

  Shared.onIMErrorFunction = function(error) {

    var message = {
      type: "error",
      icon: 'icon-jabber',
      title: "Você não está conectado ao CHAT.",
      description: "Verifique sua conexão com a Internet...",
      route: "/Chat",
      elementID: "#pageMessage",
    }

    Shared.showMessage(message);
  };

  Shared.onIMDisconnectFunction = function (error) { 

  };

  Shared.chatReconnect = function() {

    Shared.lastReconectionTime = new Date();

    Shared.api.resource('Services/Chat').params({}).done(function(resultChat){

      Shared.im = expressoIM;

      Shared.im_resource = resultChat.A;
      Shared.im_url = resultChat.B;
      Shared.im_domain = resultChat.C;
      var im_userName = resultChat.D;
      var im_password = resultChat.E + "==";

      Shared.im.resource("EXPRESSO_MOBILE").url(Shared.im_url).domain(Shared.im_domain);

      var onConnectFunction = function() {
        Shared.router.navigate("Chat",{ trigger: true });
      };

      Shared.im
      .username(im_userName)
      .password(im_password)
      .connect(onConnectFunction);

    }).execute();
  };
  

  Shared.api.id(0);
  Shared.api.debug(false);

  if (Shared.isDesktop()) {
    var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", './css/m_platform_desktop.css');
    document.getElementsByTagName("head")[0].appendChild(fileref);
  }

  if (Shared.isIDevice()) {
    var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", './css/m_platform_ios.css');
    document.getElementsByTagName("head")[0].appendChild(fileref);
  }


  Shared.userHasModule = function(moduleName) {
    var retVal = false;
    var module = moduleName;
    if (Shared.profile != undefined) {
      var a = Shared.profile.contactApps;
      if (a == undefined) {
        a = [];
      }
      a.push("settings"); //EVERYONE HAS ACCESS TO SETTINGS.

      //CHECK IF THE CHAT SERVICE IS AVAILABLE AND ADD CHAT AS A MODULE.
      if (Shared.profile.contactServices != undefined) {
        if (Shared.profile.contactServices.chat != undefined) {
          a.push("chat");
        }
      }
      //a = ["settings"]; //USE THIS IF YOU WANT TO TEST SPECIFC MODULES WILL WORK INDIVIDUALY
      for (var i = 0; i < a.length; i++) {
        if (a[i] === moduleName) {
          retVal = true;
        }
      }
      if (Shared.apiVersion == "1.0") {
        if ((module == 'calendar') || (module == 'chat')) {
          retVal = false;
        }
      }
      for (var i = 0; i < Shared.disabledModules.length; i++) {
        if (module == Shared.disabledModules[i]) {
          retVal = false;
        }

      }
    } else {
      if (moduleName == "settings") {
        retVal = true;
      }
    }
    return retVal;
    
  };

  Shared.userHasAuth = function() {
    Shared.api.getLocalStorageValue("expresso",function(expressoValue) {   

      //if (expressoValue != null) {

        var authValue = expressoValue.auth;

        if ((authValue != null) && (authValue != "")) {

          var profile = expressoValue.profile;

          Shared.profile = profile;

          //alert("auth:" + authValue);

          Shared.api.auth(authValue);

          if (Shared.isAndroid()) {
            Shared.service.setConfig("http://api.expresso.pr.gov.br/",authValue);
          }
          
        }

      //}

    });
  };

  Shared.userHasAuth();


//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

Shared.deviceReady = function() {

  Shared.api.phoneGap(true);
  Shared.api.android(Shared.isAndroid());


      if (Shared.isAndroid()) {

          document.addEventListener("backbutton", function(e){
            
            // console.log("BACKBUTTON:" + window.location.href);

            var exitURLs = [
              "file:///Mail/Messages/1/0/INBOX#",
              "file:///Mail/Messages/1/0/INBOX",
              "file:///Mail/Messages/0/0/INBOX",
              "file:///Home",
              "file:///Login",
            ];
             
            if ($.inArray( window.location.href, exitURLs ) >= 0){
              e.preventDefault();
              navigator.app.exitApp();
            } else {
              e.preventDefault();
              window.history.back();
            }
          }, false);

          var serviceName = 'com.celepar.expresso.ExpressoService';
          var factory = cordova.require('com.phonegap.plugins.backgroundservice.BackgroundService')
          Shared.service.service = factory.create(serviceName);

          window.plugins = {};
          window.plugins.webintent = cordova.require('com.phonegap.plugins.webintent.WebIntent');

          window.plugins.expresso = cordova.require('com.phonegap.plugins.expresso.ExpressoPlugin');
          
          Shared.api.createPhoneGapDatabase();

          // Shared.router.navigate("Login",{ trigger: true });

          if (window.plugins != undefined) {

          if (window.plugins.expresso != undefined) {


              //VERIFICAÇÃO DE CONTAS AUTOMÁTICAS E INÍCIO DO SERVIÇO EM BACKGROUND.
              window.plugins.expresso.getAccounts("", function (accounts) {

                Shared.automaticLoginAccounts = JSON.parse(accounts);

                var JsonAccounts = Shared.automaticLoginAccounts;

                if (Shared.automaticLoginAccounts.accounts.length >= 1) {

                    if ((Shared.forceAutomaticLoginInAccountName == false) || (Shared.automaticLoginAccounts.accounts.length == 1)) {
                      Shared.forceAutomaticLoginInAccountName = JsonAccounts.accounts[0].accountName;
                    }

                    for (var i=0;i<JsonAccounts.accounts.length;i++) {
                      if (JsonAccounts.accounts[i] != undefined) {
                        if (Shared.forceAutomaticLoginInAccountName == JsonAccounts.accounts[i].accountName) {

                          var Account = JsonAccounts.accounts[i];

                          Shared.service.setConfig(Account.accountAPIURL,Shared.api.auth(),Account.accountName,Account.accountPassword);
                          Shared.service.startService();
                          setTimeout(function() {
                            Shared.service.setConfig(Account.accountAPIURL,Shared.api.auth(),Account.accountName,Account.accountPassword);
                            Shared.service.enableTimer();
                          },10000);

                        }
                      
                      }
                    }      
                  
                }

              }, function() {
               // alert("sem Contas");
              });
          }

          if (window.plugins.webintent != undefined) {

            window.plugins.webintent.hasExtra("android.intent.extra.STREAM", function (hasExtra) {

              window.plugins.webintent.getExtra("android.intent.extra.STREAM", function (files) {

                var arquivos = [];

                if (files.indexOf("[") != -1) {
                  files = files.replace("[","").replace("]","");
                  arquivos = files.split(",");
                } else {
                  arquivos.push(files);
                }

                for (var i=0; i<arquivos.length; i++) {
                   arquivos[i] = decodeURI(arquivos[i].replace("file://","").trim());
                }

                Shared.newMessageIntent = true;
                Shared.newMessageFiles = arquivos;

              }, function(error) {
                // console.log(error);
              });

            }, function(error) {
              // console.log(error);
            });

            window.plugins.webintent.onNewIntent(function(newURL) {

              //alert('onNewIntent');

              if (newURL != null) {
               // alert(newURL);
                Shared.router.navigate(newURL,{ trigger: true});
              }

            });

            window.plugins.webintent.hasExtra("ROUTE", function (hasExtra) {

              window.plugins.webintent.getExtra("ROUTE", function (url) {

                if (Shared.isTabletResolution()) {
                  url = url.replace("{:TABLET}","1");
                } else {
                  url = url.replace("{:TABLET}","0");
                }

                Shared.gotoRoute = url;

              }, function(error) {
                // console.log(error);
              });

            }, function(error) {
              // console.log(error);
            });


          } else {
            //SEM WEBINTENT
          }

          } else {
            //SEM PLUGINS
          }

      }
};

  // deviceready is PhoneGap's init event
document.addEventListener('deviceready', function () {
  
  Shared.deviceReady();

});

  // var exitFunction = function(){

  //   if (Shared.userHasModule("chat")) {
  //     Shared.im.disconnect();
  //   }

  //   window.location.href = Shared.serverContext + "/";
    
  // };

  // if (!IS_BUILTINEXPRESSO) {
  //   if(window.onpagehide || window.onpagehide === null){
  //      window.addEventListener('pagehide', exitFunction, false);
  //   } else {
  //      window.addEventListener('unload', exitFunction, false);
  //   }

  //   window.onunload=exitFunction;

  //   window.onbeforeunload = function () {

  //     exitFunction();

  //   }; 
  // }

  


  //Shared.router is created in App.js
  export default Shared;



