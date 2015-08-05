define([
  'jquery',
  'underscore',
  'backbone',
  'shared',
  'models/mail/MessagesModel',
  'collections/mail/MessagesCollection',
  'text!templates/login/loginTemplate.html',
  'views/home/LoadingView',
  'views/home/HomeView',
  'expressoIM',
  'collections/home/ExpressoCollection',
  'collections/home/ServersCollection',
  'views/settings/SettingsFaqListView',
  'material'
], function($, _, Backbone, Shared, MessagesModel, MessagesCollection, loginTemplate,LoadingView,HomeView,expressoIM,ExpressoCollection,ServersCollection,SettingsFaqListView,Material){

  var LoginView = Backbone.View.extend({

    errors: false,
    
    render: function(){

      var collection = new ServersCollection();

      var that = this;

      collection.done(function (data) {

        var newData = {
          servers: data.models,
          Shared: Shared,
          _: _
        }

        var compiledTemplate = _.template( loginTemplate, newData );

        that.$el.html(compiledTemplate);

        //that.$el.attr("style","top: 0px; position: relative;");
        $("#mainAppPageContent").empty().append(that.$el);

        Material.upgradeDom();

        if (Shared.betaVersion) {
          $("#beta").removeClass("hidden");
        }

        if ((Shared.isAndroid()) && (Shared.isPhonegap())) {

          if (Shared.forceLogout == false) {

              if (window.plugins.expresso != null) {

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
                            that.automaticLogin(JsonAccounts.accounts[i]);
                          }
                        
                        }
                      }      
                    
                  }

                }, function() {
                  // alert("sem Contas");
                });

              } else {
                // alert("sem WebIntent");
              }

          }
        }

        

      })
      .fail(function (error) {
        Shared.handleErrors(error);
      })
      .getServers();

    },

    events: {
      'click #btn-login' : 'login',
      "keydown #username" : "keydownUserName",
      "keydown #password" : "keydownPassword",
      "click #helpLink" : "showHelp",
    },

    showHelp: function(e) {

      var secondView = new SettingsFaqListView({});
      secondView.elementID = "#mainAppPageContent";
      secondView.render();
    },

    keydownUserName: function(e) {
      if ( (e.which == 13 && !e.shiftKey) ) {
        $("#password").focus();
      }
    },

    keydownPassword: function(e) {
      if ( (e.which == 13 && !e.shiftKey) ) {
        this.login();
      }
    },


    automaticLogin: function(Account) {

      this.loginUser(Account.accountName,Account.accountPassword,Account.accountAPIURL);
    },

    login: function(ev) {
      var userName = $("#username").val().toLowerCase();
      var passwd = $("#password").val();

      var serverURL = $("#serverURL").val();

      this.loginUser(userName,passwd,serverURL);

    },


    loginUser: function(userName,passwd,serverURL) {

      var isPhoneGap = Shared.api.phoneGap();

      if (isPhoneGap) {
        Shared.api.context(serverURL).crossdomain(serverURL);
      } else {
        Shared.api.context(Shared.context).crossdomain(serverURL);
      }

      this.errors = false;

      if (passwd == "") {
        Shared.showMessage({
            type: "error",
            icon: 'icon-expresso',
            title: "Senha não informada/inválida!",
            description: "",
            elementID: "#pageMessage",
          });
        this.errors = true;
      }

      if (userName == "") {
        Shared.showMessage({
            type: "error",
            icon: 'icon-expresso',
            title: "Usuário não informado/inválido!",
            description: "",
            elementID: "#pageMessage",
          });
        this.errors = true;
      }

      if (Shared.betaVersion) { 
        var found = false;
        if (Shared.betaTesters.length > 0) {
          for (var i in Shared.betaTesters) {
            if (userName == Shared.betaTesters[i]) {
              found = true;
            }
          }
          if (!found) {
             Shared.showMessage({
                type: "error",
                icon: 'icon-expresso',
                title: "Este usuário não possui acesso a versão BETA!",
                description: "",
                elementID: "#pageMessage",
              });
            this.errors = true;
          }
        }

      }

      
      var that = this;      

      that.userName = userName;
      that.serverURL = serverURL;

      if (!that.errors) {

        var loadingView = new LoadingView({ el: $("#login-loading") });
        loadingView.render();

        Shared.api
        .resource('Login')
        .params({user:userName,password:passwd})
        .done(function(result){

          if (result.profile[0].contactApps.length != 0) {

              var expressoValues = {
                auth: Shared.api.auth(), 
                "profile":result.profile[0],
                username: userName, 
                phoneGap: isPhoneGap,
                serverAPI: serverURL
              };

              Shared.password = passwd;

              Shared.profile = expressoValues.profile;

              Shared.api.setLocalStorageValue("expresso",expressoValues);

              if ((Shared.isAndroid()) && (Shared.isPhonegap())) {

                if (Shared.service != undefined) {

                  Shared.service.setConfig(serverURL,Shared.api.auth(),userName,passwd);
                  Shared.service.startService();
                  setTimeout(function() {
                    Shared.service.setConfig(serverURL,Shared.api.auth(),userName,passwd);
                    Shared.service.enableTimer();
                  },10000);

                } else {
                  console.log("undefined service");
                }

                if (window.plugins != undefined) {

                  window.plugins.expresso.createAccount({accountName : userName, accountPassword: passwd, accountAuthToken: Shared.api.auth(), accountAPIURL: serverURL}, 
                   function(result) {

                   }, function(error) {
                      // alert(error);
                   });

                }

              }
              
              var homeView = new HomeView();
              homeView.profile = result.profile[0];
              homeView.render();

              Shared.showMessage({
                type: "success",
                icon: 'icon-expresso',
                title: "Bem vindo ao Expresso!",
                description: "",
                timeout: 2000,
                elementID: "#pageMessage",
              });

              return false;

          } else {

            Shared.showMessage({
              type: "error",
              icon: 'icon-expresso',
              title: "Este usuário não possui acesso a nenhum módulo neste servidor!",
              description: "",
              timeout: 0,
              elementID: "#pageMessage",
            });

            setTimeout(function() {

              Shared.router.navigate('',{trigger: true});

            },2000);
          }

        })
        .fail(function(result){

          if (result.error.code == 5) {

            Shared.showMessage({
              type: "error",
              icon: 'icon-expresso',
              title: "Usuário ou senha inválidos!",
              description: "",
              timeout: 0,
              elementID: "#pageMessage",
            });

          } else {
            Shared.showMessage({
              type: "error",
              icon: 'icon-expresso',
              title: "Não foi possível efetuar o Login!",
              description: "",
              timeout: 0,
              elementID: "#pageMessage",
            });
          }

          setTimeout(function() {

            Shared.router.navigate('',{trigger: true});

          },2000);

          return false;
        });

        Shared.api.ignoreCache(true);

        

        var doLogin = function(currentValue) {

          if (currentValue != undefined) {
            if (currentValue.username != undefined) {
              if ((currentValue.username != that.userName) || (currentValue.serverAPI != that.serverURL)) {
                Shared.api.setLocalStorageValue("expressoCache",[]);
                //Shared.api.removeLocalStorageValue("expressoCache");
              }
            }
          }

          Shared.api.execute();

        };

        Shared.api.getLocalStorageValue("expresso",doLogin,doLogin);

      }



      return false;
    },

    logoutUser: function (forceLogout) {

      $("#mainAppPageContent").empty();

      var loadingView = new LoadingView({ el: $("#mainAppPageContent") });
      loadingView.render();

      if (forceLogout == undefined) {
        forceLogout = true;
      }

      Shared.forceLogout = forceLogout;

      Shared.api
      .resource('Logout')
      .done(function(result){

      })
      .fail(function(error){

        Shared.handleErrors(error);
        
      })
      .execute();

      Shared.scrollMenu = null;

      Shared.stopBlinkWindowTitle();

      Shared.api.getLocalStorageValue("expresso",function(expressoValue) {

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

        Shared.api.setLocalStorageValue("expresso",expressoValue);

      });

      Shared.router.navigate('Login',true);

    }

  });

  return LoginView;
  
});
