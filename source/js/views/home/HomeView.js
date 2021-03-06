
import $ from 'jquery';
// import _ from 'underscore';
// import Backbone from 'backbone';
// import Shared from 'shared';
// import jquery_migrate from 'jquery_migrate';
// import jqueryui from 'jqueryui';
// import wijmo from 'wijmo';
// import wijdialog from 'wijdialog';
// import tinysort from 'tinysort';
// import linkify from 'linkify';
// import im from 'im';


var HomeView = Backbone.View.extend({

    tagName: 'home-view',
    id: 'app',
    _shadow: null,

    initialize: function(data) {
        if (data != undefined) {
            this.attributes = data.attributes;
        }
    },

    resize: function() {
        this.el.resize();
        // console.log('resize: ' + window.height() + 'px');
        // $('#mainPageContent').css('height',window.height() + 'px');
    },

    remove: function() {

        //call the superclass remove method
        // Backbone.View.prototype.remove.apply(this, arguments);
    },

    render: function() {
        $("#mainAppPageContent").empty().append(this.el);
    },

  /*  renderOLD: function() {

        var that = this;

        $("#mainAppPageContent").empty().append(that.el);

        Shared.api.getLocalStorageValue("expresso", function(expressoValue) {

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


                Shared.api.resource('Services/Chat').params({}).done(function(resultChat) {

                    Shared.im_resource = resultChat.A;
                    Shared.im_url = resultChat.B;
                    Shared.im_domain = resultChat.C;
                    var im_userName = resultChat.D;
                    var im_password = resultChat.E + "==";

                    // if (Shared.isDesktop()) {

                        // $("#chatDesktop").im({
                        //     "resource": "JABBER_IM_PR",
                        //     "url": Shared.im_url,
                        //     "domain": Shared.im_domain,
                        //     "username": im_userName,
                        //     "password": im_password,
                        //     "debug": false,
                        //     "soundPath": "libs/messenger/",
                        //     "height": $("#chatContactsWindow").height() - $(".chat-title").height() - 30,
                        //     "minimizeZone": "minimizedWindows",
                        // });

                    // } else {
                    //     Shared.im.resource("EXPRESSO_MOBILE").url(Shared.im_url).domain(Shared.im_domain);

                    //     Shared.im
                    //         .username(im_userName)
                    //         .password(im_password)
                    //         .connect();
                    // }


                }).execute();

            }

            
            Shared.api.resource('ExpressoVersion').params({}).done(function(resultExpressoVersion) {

                Shared.apiVersion = resultExpressoVersion.apiVersion;
                Shared.expressoVersion = resultExpressoVersion.expressoVersion;

                Shared.refreshSettings();

                // that.menuView = new MenuView({
                //     el: $("#scrollerMenu")
                // });
                // that.menuView.profile = that.profile;
                // that.menuView.render();


                // Shared.setDefaultIMListeners();
                // Shared.BlinkWindowTitle();


                // if (Shared.gotoRoute == false) {

                //     if (Shared.userHasModule("mail")) {

                //         if ((Shared.isSmartPhoneResolution()) && (Shared.newMessageIntent == true)) {

                //             Shared.newMessageIntent = false;
                //             Shared.router.navigate("/Mail/Message/New", {
                //                 trigger: true
                //             });

                //         } else {

                //             that.menuView.selectMenu(1);
                //             that.loadMessagesInFolder(that.folderID, that.search, '', '1');
                //             that.loaded();
                //         }

                //     } else {

                //         if (Shared.userHasModule("calendar")) {
                //             that.menuView.selectMenu(2);
                //             Shared.router.navigate("/Calendar", {
                //                 trigger: true
                //             });
                //         } else {
                //             if (Shared.userHasModule("catalog")) {
                //                 that.menuView.selectMenu(3);
                //                 Shared.router.navigate("/Contacts/Personal", {
                //                     trigger: true
                //                 });
                //             } else {
                //                 if (Shared.userHasModule("chat")) {
                //                     that.menuView.selectMenu(4);
                //                     Shared.router.navigate("/Chat", {
                //                         trigger: true
                //                     });
                //                 } else {
                //                     that.menuView.selectMenu(5);
                //                     Shared.router.navigate("/Settings", {
                //                         trigger: true
                //                     });
                //                 }
                //             }
                //         }
                //     }


                // } else {

                //     that.loaded();
                // }



                //Shared.scheduleCheckForNewMessages();

            }).execute();


        });



    },*/


});

export default HomeView;
