import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';
import messagesListItemsTemplate from 'messagesListItemsTemplate';
import MessagesCollection from 'MessagesCollection';
import Material from 'material';
import MessagesListItemView from 'MessagesListItemView';
import FoldersModel from 'FoldersModel';

var MessagesListItemsView = Backbone.View.extend({

    tagName: 'mail-messages',
    _shadow: null,

    currentPageTitle: '',

    messageView: null,

    elementIndex: 0,

    parentFolders: [],

    items: [],

    initialize: function(data) {
        this.attributes = data.attributes;

    },

    resize: function() {
        this.el.resize();
    },

    render: function(elementIndex,nextPage, nextPageItems) {

        if (nextPage) {

            this.el.addItems(nextPageItems);

        } else {
            console.log("#messagesList_" + elementIndex);
            $("#messagesList_" + elementIndex).empty().append(this.el);
        }


    },

    events: {
        'evt-open-message': "_openMessage",
        'evt-starred-message': "_starredMessage",
        'evt-select-messages': "_selectedMessages",
        'evt-open-folder': "_openFolder",
    },

    _selectedMessages: function(event) {
        var messagesView = event.currentTarget;

        this.messageView = messagesView;

        Shared.messagesView = messagesView;

        var that = this;

        var backButtonFunction = function() {
            // DESELECT ALL MAIL-THREADS

            Shared.menuView.enableBackButton(false);
            // Shared.messagesView.selectedMessages = [];
            // var messages = Shared.messagesView.getSelectedMessages();
            $("#currentPageTitle").html(that.currentPageTitle);
            $("#mainHeader").removeClass("selected-threads");

            jQuery.each($("mail-thread"), function(i, message) {
                if (message.selected) {
                    message.selected = false;
                    message.fire('thread-select', {
                        thread: message
                    });
                }
            });

        };

        Shared.backButtonClicked = backButtonFunction;

        var qtdMessagesSelected = Shared.messagesView.selectedMessages.length;
        var messages = Shared.messagesView.getSelectedMessages();

        if (qtdMessagesSelected != 0) {
            Shared.menuView.enableBackButton(true);
            if (this.currentPageTitle == '') {
                this.currentPageTitle = $("#currentPageTitle").html();
            }
            $("#currentPageTitle").html(qtdMessagesSelected);
            $("#mainHeader").addClass("selected-threads");
        } else {
            Shared.menuView.enableBackButton(false);
            $("#currentPageTitle").html(this.currentPageTitle);
            $("#mainHeader").removeClass("selected-threads");
        }

    },

    _starredMessage: function(event) {

        var messagesView = event.currentTarget;
        var currentMessage = messagesView.currentMessage;
        var flagType = 2;
        var msgSuccess = "Mensagem desmarcada de importante.";
        var msgFail = "Não foi possível desmarcar a mensagem.";
        if (currentMessage.starred) {
            flagType = 1;
            msgSuccess = "Mensagem marcada como importante.";
            msgFail = "Não foi possível marcar a mensagem.";
        }
        console.log("_starredMessage");
        console.log(currentMessage);

        var callbackSuccess = function(result) {

            Shared.showMessage({
                type: "success",
                icon: 'icon-expresso',
                title: msgSuccess,
                description: "",
                timeout: 3000,
                elementID: "#pageMessage",
            });

        };

        var callbackFail = function(error) {

            Shared.showMessage({
                type: "error",
                icon: 'icon-expresso',
                title: msgFail,
                description: "",
                timeout: 3000,
                elementID: "#pageMessage",
            });

            if (flagType == 1) {
                currentMessage.starred = false;
            } else {
                currentMessage.starred = true;
            }


        };

        var collection = new MessagesCollection();
        collection.flagMessage(currentMessage.folderid, currentMessage.msgid, flagType, callbackSuccess, callbackFail);
    },

    _openFolder: function(event) {


        var messagesView = event.currentTarget;

        console.log("_openFolder");
        console.log(messagesView.currentFolder);

        var folder = new FoldersModel({
            folderId: messagesView.currentFolder.folderId
        });

        folder.set('folderID', messagesView.currentFolder.folderId);

        // console.log(folder.route());

        Shared.router.navigate(folder.route(), {
            trigger: true
        });

    },

    _openMessage: function(event) {

        Shared.menuView.enableBackButton(false);
        $("#currentPageTitle").html(this.currentPageTitle);
        $("#mainHeader").removeClass("selected-threads");

        var messagesView = event.currentTarget;

        // console.log("_openMessage");
        // console.log(messagesView.currentMessage);

        Shared.router.navigate(messagesView.currentMessage.route, {
            trigger: true
        });

    },



});

export default MessagesListItemsView;
