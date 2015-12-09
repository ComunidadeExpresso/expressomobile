import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';
import messagesListTemplate from 'messagesListTemplate';
import MessagesListItemsView from 'MessagesListItemsView';
import MessagesListItemView from 'MessagesListItemView';
import FoldersCollection from 'FoldersCollection';
import MessagesCollection from 'MessagesCollection';
import LoadingView from 'LoadingView';
import DetailMessageView from 'DetailMessageView';
import PullToActionView from 'PullToActionView';
import IronScrollTresholdView from 'IronScrollTresholdView';
import Material from 'material';
import moment from 'moment';
import moment_ptBR from 'moment_ptBR';

var MessagesListView = Backbone.View.extend({

    currentFolder: [],
    parentFolders: [],
    elementID: "#content",
    detailElementID: "#contentDetail",
    folderID: 'INBOX',
    msgID: '',
    forceReload: "0",
    search: '',
    page: 1,
    doneRoute: '',
    enabledDesktopVersion: false,

    messagesListItemsView: null,

    render: function() {

        this.elementID = "#content";

        var that = this;

        var beforeRenderCallback = function(colection) {

            Shared.setCurrentPageTitle(that.currentFolder.get("folderName"));

            var newData = {
                folderID: that.folderID,
                msgID: that.msgID,
                currentFolder: that.currentFolder,
                collection: colection,
                _: _,
                Shared: Shared,
                enabledDesktopVersion: that.enabledDesktopVersion
            };

            if (!colection.length) {

                if (Shared.isTabletResolution()) {
                    if (Shared.newMessageIntent) {
                        Shared.newMessageIntent = false;
                        Shared.router.navigate("/Mail/Message/New", {
                            trigger: true
                        });
                    } else {
                        Shared.router.navigate("/Mail/Messages/0/0/" + that.folderID + "#", {
                            trigger: true
                        });
                    }

                }

            }

            var htmlTemplate = _.template(messagesListTemplate);
            var htmlWithData = htmlTemplate(newData);

            that.$el.html(htmlWithData);

            $(that.elementID).empty().append(that.$el);




            var refreshFunction = function() {
                that.page = 1;
                $("#messagesList").empty();
                that.getMessages(that.folderID, that.search, that.page, false, true);
            };

            var pullToAction = new PullToActionView({
                refreshAction: refreshFunction,
                container: '#pull-to-action-loader'
            });
            pullToAction.render();

            // var nextPageFunction = function () {
            //   console.log("nextPage");
            // };


            // var ironTreshold = new IronScrollTresholdView({ refreshAction: nextPageFunction, container: "#iron-scroll-threshold-loader" });
            // ironTreshold.render();


        }


        var doneFunction = function() {

            if (Shared.newMessageIntent == false) {
                Shared.menuView.renderContextMenu('messageList', {
                    folderID: that.folderID,
                    folderName: that.currentFolder.folderName,
                    folderType: that.currentFolder.get("folderType"),
                    qtdMessages: 0
                });
            }

            if (((Shared.isTabletResolution()) && (that.forceReload == "1")) || ((!Shared.isTabletResolution()) && (Shared.gotoRoute != false))) {

                if (Shared.newMessageIntent == true) {
                    Shared.newMessageIntent = false;
                    Shared.router.navigate("/Mail/Message/New", {
                        trigger: true
                    });
                } else {

                    if (that.msgID != undefined) {

                        var detailMessageView = new DetailMessageView();
                        detailMessageView.folderID = that.folderID;
                        detailMessageView.msgID = that.msgID;

                        Shared.menuView.renderContextMenu('messageList', {
                            folderID: that.folderID,
                            folderName: that.currentFolder.folderName,
                            folderType: that.currentFolder.get("folderType"),
                            qtdMessages: 0
                        });

                        detailMessageView.render();
                    }

                }

            }

            Shared.setDefaultIMListeners();

        };


        //FORCERELOAD IS A PARAMETER THAT FORCES THE PAGE TO BE RELOADED FULLY ON TABLET RESOLUTION OR DEPENDING ON USER INTERACTION WITH THE PAGE.
        //IN SMARTPHONE RESOLUTION THE FORCERELOAD IS USED TO NOT RELOAD ALL THE PAGE AND ONLY LOADS THE NECESSARY AREA OF THE PAGE.
        if (this.forceReload == "1") {

            var loadingView = new LoadingView({
                el: $(this.elementID)
            });
            loadingView.render();

            var loadingView = new LoadingView({
                el: $(this.detailElementID)
            });
            loadingView.render();

            that.getMessages(that.folderID, that.search, that.page, false, false, beforeRenderCallback, doneFunction);

        } else {

            var loadingView = new LoadingView({
                el: $(this.detailElementID)
            });
            loadingView.render();

            var detailMessageView = new DetailMessageView();
            detailMessageView.folderID = that.folderID;
            detailMessageView.msgID = that.msgID;

            detailMessageView.render();

        }



    },

    events: {
        "keydown #searchField": "searchMessage",
        "lower-trigger": "loadNextPage",
    },

    loadNextPage: function(e) {
        // console.log("loadNextPage");
        this.pullUpAction();
    },

    searchMessage: function(e) {
        if (e.which == 13 && !e.shiftKey) {
            this.search = $('#searchField').val();

            pullDownEl = document.getElementById('pullDown');
            pullDownEl.className = 'loading';
            pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Carregando...';

            this.pullDownAction();
        }
    },

    selectFirstMessage: function() {

        //ROTEIA PARA CARREGAR A PRIMEIRA MENSAGEM DA LISTA.
        var firstMessage = this.collection[0];
        if (firstMessage) {
            $("#" + firstMessage.listItemID()).addClass("selected");
            Shared.router.navigate(firstMessage.route(), {
                trigger: true
            });
        }
    },

    getMessages: function(pFolderID, pSearch, pPage, appendAtEnd, ignoreCache, beforeRenderCallback, doneCallback) {

        var messagesData = new MessagesCollection();
        var foldersCollection = new FoldersCollection();

        var index = 0;

        var that = this;

        foldersCollection.getFolders(this.folderID, this.search).done(function(foldersData) {


                var currentFolder = foldersData.getFolderByID(that.folderID);
                var parentFolders = foldersData.getSubFoldersFromFolderID(that.folderID);

                that.currentFolder = currentFolder;
                that.parentFolders = parentFolders;

                if (ignoreCache == true) {
                    messagesData.ignoreCache(true);
                }

                messagesData.getMessagesInFolder(pFolderID, '', pSearch, pPage).done(function(data) {

                        if (appendAtEnd == true) {

                        }

                        that.collection = data.models;

                        if (beforeRenderCallback) {
                            beforeRenderCallback(that.collection);
                        }

                        var messages = data.models;

                        var parentFolders = that.parentFolders;

                        var arr_items = [];

                        var currentIndex = 0;

                        if (!appendAtEnd) {

                            _.each(parentFolders, function(folder) {

                                var attrs = {};

                                currentIndex = currentIndex + 1;

                                attrs["index"] = currentIndex + 1;
                                attrs["isFolder"] = true; //FOLDER
                                attrs["folderID"] = folder.get("folderID");
                                attrs["folderName"] = folder.get("folderName");
                                attrs["route"] = folder.route();

                                arr_items.push(attrs);

                            });

                        }

                        _.each(messages, function(message) {

                            var attrs = {};

                            currentIndex = currentIndex + 1;

                            attrs["index"] = (((pPage - 1) * Shared.settings.resultsPerPage) + parentFolders.length) + currentIndex;
                            attrs["isFolder"] = false; //MESSAGE
                            attrs["subject"] = message.get("msgSubject");
                            attrs["from"] = message.get("msgFrom").fullName;
                            attrs["date"] = message.getTimeAgo();
                            attrs["bodyresume"] = message.get("msgBodyResume");
                            attrs["msgID"] = message.get("msgID");
                            attrs["folderID"] = message.get("folderID");
                            attrs["route"] = message.route();


                            if (message.get("msgFlagged") == "1") {
                                attrs["starred"] = true;
                            } else {
                                attrs["starred"] = false;
                            }

                            if (message.get("msgSeen") == "0") {
                                attrs["unread"] = true;
                            } else {
                                attrs["unread"] = false;
                            }

                            arr_items.push(attrs);

                        });



                        if (!appendAtEnd) {
                            var attrs = [];
                            attrs["items"] = JSON.stringify(arr_items);
                            that.messagesListItemsView = new MessagesListItemsView({
                                attributes: attrs
                            });
                        }

                        if ((that.msgID == "") || (that.msgID == "0")) {
                            if (data.length) {
                                if (Shared.isTabletResolution()) {
                                    that.msgID = data.models[0].get("msgID");
                                }
                            }
                        }

                        that.messagesListItemsView.render(appendAtEnd, arr_items);

                        if (doneCallback) {
                            doneCallback();
                        }


                    })
                    .fail(function(result) {

                        Shared.handleErrors(result.error);

                        $(that.elementID).empty();

                        $(that.detailElementID).empty();

                        return false;
                    })
                    .execute();

            })
            .fail(function(result) {

                Shared.handleErrors(result.error);

                $(that.elementID).empty();

                $(that.detailElementID).empty();

                return false;
            })
            .execute();


    },


    pullDownAction: function() {
        this.page = 1;
        $("#scrollerList").empty();
        getMessages(this.folderID, this.search, this.page, false, true);
    },

    pullUpAction: function() {
        this.page = this.page + 1;
        this.getMessages(this.folderID, this.search, this.page, true, false);
    }

});

export default MessagesListView;
