import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';
import MessagesCollection from 'MessagesCollection';
import ServersCollection from 'ServersCollection';
import MessagesListView from 'MessagesListView';
import DetailMessageView from 'DetailMessageView';
import MenuView from 'MenuView';
import PullToActionView from 'PullToActionView';
import Material from 'material';
import jquery_migrate from 'jquery_migrate';
import jqueryui from 'jqueryui';
import wijmo from 'wijmo';
import wijdialog from 'wijdialog';
import tinysort from 'tinysort';
import contextmenu from 'contextmenu';
import linkify from 'linkify';
import im from 'im';
import SearchView from 'SearchView';
import HomeTabModel from 'HomeTabModel';
import HomeTabCollection from 'HomeTabCollection';

var HomeView = Backbone.View.extend({

    tagName: 'home-view',
    _shadow: null,

    folderID: 'INBOX',
    msgID: '0',
    search: '',
    page: '1',
    profile: null,

    menuView: null,

    callBackTabAdded : null,

    observer: null,
    elementIndex: 0,

    tabs: [],

    initialize: function(data) {
        if (data != undefined) {
            this.attributes = data.attributes;
        }
        
        //CARREGA A VIEW DO MENU
        var mView = new MenuView();
        this.menuView = mView;

        //SALVA A VIEW DO MENU NO SHARED
        Shared.menuView = mView;

    },

    resize: function() {
        this.el.resize();
    },

    remove: function() {

        //call the superclass remove method
        Backbone.View.prototype.remove.apply(this, arguments);
    },

    render: function() {

        $("#mainAppPageContent").empty().append(this.el);

        this.setupPaperTabsObserver();

        var that = this;

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

            

            Shared.api.resource('ExpressoVersion').params({}).done(function(resultExpressoVersion) {


                Shared.apiVersion = resultExpressoVersion.apiVersion;
                Shared.expressoVersion = resultExpressoVersion.expressoVersion;


                Shared.refreshSettings();

                that.menuView = new MenuView({
                    el: $("#scrollerMenu")
                });
                that.menuView.profile = that.profile;
                that.menuView.render();


                Shared.setDefaultIMListeners();
                Shared.BlinkWindowTitle();




                if (Shared.gotoRoute == false) {

                    if (Shared.userHasModule("mail")) {

                        if ((Shared.isSmartPhoneResolution()) && (Shared.newMessageIntent == true)) {

                            Shared.newMessageIntent = false;
                            Shared.router.navigate("/Mail/Message/New", {
                                trigger: true
                            });

                        } else {

                            that.menuView.selectMenu(1);
                            that.loadMessagesInFolder(that.folderID, that.search, '', '1');
                            that.loaded();
                        }

                    } else {

                        if (Shared.userHasModule("calendar")) {
                            that.menuView.selectMenu(2);
                            Shared.router.navigate("/Calendar", {
                                trigger: true
                            });
                        } else {
                            if (Shared.userHasModule("catalog")) {
                                that.menuView.selectMenu(3);
                                Shared.router.navigate("/Contacts/Personal", {
                                    trigger: true
                                });
                            } else {
                                if (Shared.userHasModule("chat")) {
                                    that.menuView.selectMenu(4);
                                    Shared.router.navigate("/Chat", {
                                        trigger: true
                                    });
                                } else {
                                    that.menuView.selectMenu(5);
                                    Shared.router.navigate("/Settings", {
                                        trigger: true
                                    });
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

    setupPaperTabsObserver: function() {
        this.target = document.getElementById('homeTabs');

        var that = this;
    
        // create an observer instance
        this.observer = new MutationObserver(function(mutations) {

          mutations.forEach(function(mutation) {
            if (mutation.addedNodes[0] != undefined) {
                if (mutation.addedNodes[0].nodeName.toLowerCase() == 'neon-animatable') {
                    
                    var elementID = "#content_" + that.elementIndex;
                    that.callBackTabAdded(that.elementIndex,elementID);
                    that.selectTab(that.elementIndex - 1);

                }
            }
          });    
        });

        this.observer.observe(this.target,  { childList: true });

    },


    selectTab: function(index) {
        var that = this;
        that.el.set('selected',index); 
    },

    addTab: function(Title, callBack) {



        if (Title.length > 17) {
            Title = Title.substr(0, 17) +  "...";
        }

        this.callBackTabAdded = callBack;
        this.elementIndex = this.el.addTab(Title,Title,'',true);
        
        return this.elementIndex;
    },


    loadMessagesInFolder: function(Pfolder, Psearch, PmsgID, PforceReload) {

        var that = this;

        that.msgID = PmsgID;

        Shared.menuView.setMailBadge(0);

        var messagesListView = new MessagesListView({
            folderID: Pfolder,
            search: Psearch,
            page: this.page,
            msgID: PmsgID,
        });
        messagesListView.folderID = Pfolder;
        messagesListView.msgID = PmsgID;
        messagesListView.forceReload = PforceReload;

        messagesListView.render();

    },

    events: {
        "click .listFolderItemLink": "selectFolderItem",
        "click .menuLink": "selectMenuItem",
        "click .listItemLink": "selectListItem",
        "click #mainHeader_back_button": "backButtonClick",
        "evt-search-view" : "showSearchView",
    },

    

    showSearchView: function() {
        var searchView = new SearchView();
        searchView.render();
    },


    backButtonClick: function() {
        console.log("backButton");
        Shared.backButtonClicked();
    },

    selectListItem: function(e) {

        e.preventDefault();

        parent = $(e.target).parent();

        $('#scroller li').each(function() {
            $(this).removeClass('selected');
        });

        if (parent.hasClass("listItemLink")) {
            parent = parent.parent();
        }

        var rowid = e.currentTarget.getAttribute("rowid");
        // console.log(rowid);
        if (rowid != undefined) {
            $("#" + rowid).addClass("selected");
        }

        Shared.router.navigate(e.currentTarget.getAttribute("href"), {
            trigger: true
        });


    },

    selectMenuItem: function(e) {
        e.preventDefault();
        Shared.router.navigate(e.currentTarget.getAttribute("href"), {
            trigger: true
        });
    },

    selectFolderItem: function(e) {
        e.preventDefault();
        Shared.router.navigate(e.currentTarget.getAttribute("href"), {
            trigger: true
        });
    },

    loaded: function() {

        if (Shared.gotoRoute != false) {
            Shared.router.navigate(Shared.gotoRoute, {
                trigger: true
            });
            Shared.gotoRoute = false;
        }

        
    },


});

export default HomeView;
