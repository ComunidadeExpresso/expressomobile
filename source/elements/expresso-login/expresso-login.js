
import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';
import HomeView from 'HomeView';
import ServersCollection from 'ServersCollection';

// import loginTemplate from 'loginTemplate';
// import expressoIM from 'expressoIM';

  Polymer({

    is: 'expresso-login',

    properties: {
          AvailableServers: {
              type: Array,
              reflectToAttribute: true,
              notify: true,
          },

          selectedServer: {
          	type: Number,
            value: 0,
            notify: true,
          },

          serverApiUrl: {
            type: String,
            value: 'http://api.expresso.pr.gov.br/',
            notify: true,
          },

          isvisible: { 
            type: Boolean,
            value: true,
            notify: true,
          },

          isLoading: {
          	type: Boolean,
          	value: false,
          	notify: true,
          	reflectToAttribute: true,
          },

          errors: { 
            type: Boolean,
            value: false,
          },

          user: { 
            type: String,
            value: '',
          },
          password: { 
            type: String,
            value: '',
          },
      },

    serversLoaded: function (data) {
        this.AvailableServers = data.detail.response.result.servers;

        console.log(this.AvailableServers);
    },

    doLogin: function(e) {


    	var server = this.AvailableServers[this.selectedServer];

    	var serverApiUrl = server.serverUrl + server.serverContext;

       	this.loginUser(this.user,this.password,serverApiUrl);

    },

    // Element Lifecycle

    ready: function() {

    	var that = this;

    	var collection = new ServersCollection();

        collection.done(function(data) {

        	that.AvailableServers = data.toJSON();

            if ((Shared.isAndroid()) && (Shared.isPhonegap())) {

                if (Shared.forceLogout == false) {

                    if (window.plugins.expresso != null) {

                        window.plugins.expresso.getAccounts("", function(accounts) {

                            Shared.automaticLoginAccounts = JSON.parse(accounts);

                            var JsonAccounts = Shared.automaticLoginAccounts;

                            if (Shared.automaticLoginAccounts.accounts.length >= 1) {

                                if ((Shared.forceAutomaticLoginInAccountName == false) || (Shared.automaticLoginAccounts.accounts.length == 1)) {
                                    Shared.forceAutomaticLoginInAccountName = JsonAccounts.accounts[0].accountName;
                                }

                                for (var i = 0; i < JsonAccounts.accounts.length; i++) {
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



        }).fail(function(error) {
        	console.log(error);
            Shared.handleErrors(error);
        });

        collection.getServers();


    },

    loginUser: function(userName, passwd, serverURL) {

    	this.isLoading = true;

        var isPhoneGap = Shared.api.phoneGap();

        if (isPhoneGap) {
            Shared.api.context(serverURL).crossdomain(serverURL);
        } else {
            Shared.api.context(Shared.context).crossdomain(serverURL);
        }

        console.log('loginUser');

        this.errors = false;

        if (passwd == "") {
        	this.showMessage("Senha não informada/inválida!","error");
            this.errors = true;
        }

        if (userName == "") {
        	this.showMessage("Usuário não informado/inválido!","error");
            this.errors = true;
        }

        var that = this;

        that.userName = userName;
        that.serverURL = serverURL;

        if (!that.errors) {

            Shared.api.resource('Login').enableAutoConfig(false)
            .params({
                user: userName,
                password: passwd
            })
            .done(function(result) {


                    if (result.profile[0].contactApps.length != 0) {

                        var expressoValues = {
                            auth: Shared.api.auth(),
                            "profile": result.profile[0],
                            username: userName,
                            phoneGap: isPhoneGap,
                            serverAPI: serverURL
                        };

                        Shared.password = passwd;

                        Shared.api.enableAutoConfig(true);

                        Shared.profile = expressoValues.profile;

                        Shared.api.setLocalStorageValue("expresso", expressoValues);

                        if ((Shared.isAndroid()) && (Shared.isPhonegap())) {

                            if (Shared.service != undefined) {

                                Shared.service.setConfig(serverURL, Shared.api.auth(), userName, passwd);
                                Shared.service.startService();
                                setTimeout(function() {
                                    Shared.service.setConfig(serverURL, Shared.api.auth(), userName, passwd);
                                    Shared.service.enableTimer();
                                }, 10000);

                            } else {
                                console.log("undefined service");
                            }

                            if (window.plugins != undefined) {

                                window.plugins.expresso.createAccount({
                                        accountName: userName,
                                        accountPassword: passwd,
                                        accountAuthToken: Shared.api.auth(),
                                        accountAPIURL: serverURL
                                    },
                                    function(result) {

                                    },
                                    function(error) {
                                        // alert(error);
                                    });

                            }

                        }

                        // $("#login-loading").empty();
                        // $("#login-loading").addClass("animation-big-scale");

                        that.isLoading = false;

                        that.showMessage("Bem vindo ao Expresso!");

                        that.fire('user-has-logged-in');

                        // setTimeout(function() {

                            // var homeView = new HomeView();
                            // homeView.profile = result.profile[0];
                            // homeView.render();

                

                        // }, 2000);



                        return false;

                    } else {

                    	that.showMessage("Este usuário não possui acesso a nenhum módulo neste servidor!","error");

                        setTimeout(function() {

                            Shared.router.navigate('', {
                                trigger: true
                            });

                        }, 2000);
                    }

            })
            .fail(function(result) {

                if (result.error.code == 5) {
                	that.showMessage("Usuário ou senha inválidos!","error");
                } else {
                	that.showMessage("Não foi possível efetuar o Login!","error");
                }

                // setTimeout(function() {

                //     Shared.router.navigate('', {
                //         trigger: true
                //     });

                // }, 2000);

                return false;
            });

            Shared.api.ignoreCache(true);



            var doLogin = function(currentValue) {

                if (currentValue != undefined) {
                    if (currentValue.username != undefined) {
                        if ((currentValue.username != that.userName) || (currentValue.serverAPI != that.serverURL)) {
                            Shared.api.setLocalStorageValue("expressoCache", []);
                            //Shared.api.removeLocalStorageValue("expressoCache");
                        }
                    }
                }

                Shared.api.execute();

            };

            Shared.api.getLocalStorageValue("expresso", doLogin, doLogin);

        }



        return false;
    },

    automaticLogin: function(Account) {
        this.loginUser(Account.accountName, Account.accountPassword, Account.accountAPIURL);
    },

    showMessage: function(message,msgType) {

      if (msgType == undefined) {
        msgType = 'info';
      }

      this.fire('iron-signal', {
        name: 'toaster-bake',
        data: {
          text: message,
          type: msgType,
        }
      });

    },

    attached: function() {

      this.AvailableServers = [];

    },

    detached: function() {

    },


  });