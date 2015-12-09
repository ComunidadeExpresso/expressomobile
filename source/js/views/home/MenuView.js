import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';
import FoldersMenuListView from 'FoldersMenuListView';
import menuTemplate from 'menuTemplate';
import ContextMenuView from 'ContextMenuView';
import ContextMenuCollection from 'ContextMenuCollection';
import MenuItemsCollection from 'MenuItemsCollection';
import Material from 'material';

var MenuView = Backbone.View.extend({
    el: $("#scrollerMenu"),

    profile: null,
    context: null,
    folderMenuLV: null,

    initialize: function() {

        this.context = new ContextMenuView();

        this.enableBackButton(false);
    },


    render: function() {


        $(window).resize(this.refreshWindow);
        //UPDATE PROFILE
        //GERALMENTE O PROFILE É ENVIAOD PELO MENU-VIEW PORÉM SE O USUÁRIO REALIZAR O RELOAD DA PÁGINA
        //ENTÃO SERÁ NECESSÁRIO RECARREGÁ-LO DO LOCALSTORAGE

        var that = this;
        Shared.api.getLocalStorageValue("expresso", function(expressoValue) {

            if (expressoValue != null) {

                var authValue = expressoValue.auth;

                if (authValue != null) {
                    Shared.api.auth(authValue);
                }

                Shared.profile = expressoValue.profile;
                that.profile = Shared.profile;

            }


            var menuItemsCollection = new MenuItemsCollection();

            var itemsMenu = menuItemsCollection.getMenuItems(Shared.profile.contactApps);


            var data = {
                user: that.profile,
                menuItems: itemsMenu,
                _: _,
                Shared: Shared
            };

            var compiledTemplate = _.template(menuTemplate);

            var htmlWithData = compiledTemplate(data);

            that.$el.html(htmlWithData);


            Shared.api
                .resource('Catalog/ContactPicture')
                .params({
                    contactID: that.profile.contactID,
                    contactType: '2'
                })
                .done(function(result) {
                    if (result.contacts[0].contactImagePicture != "") {
                        $("#userPicture").css("background-image", "url('data:image/gif;base64," + result.contacts[0].contactImagePicture + "')");
                        $("#userPicture").css("background-size", "46px 61px");
                    }
                })
                .fail(function(error) {
                    Shared.handleErrors(error);
                })
                .execute();

            that.context = new ContextMenuView();

            if (Shared.userHasModule("mail")) {
                that.folderMenuLV = new FoldersMenuListView();
                that.folderMenuLV.render();

            }

        });

    },


    refreshFolders: function() {
        this.folderMenuLV = new FoldersMenuListView();
        this.folderMenuLV.render();
    },

    setQuota: function(used, total) {

        var percent = (used * 100 / total).toFixed(0);

        document.querySelector('#progress_bar_quota').addEventListener('mdl-componentupgraded', function() {
            this.MaterialProgress.setProgress(percent);
        });

        //$("#usedQuota").width(percent + "%");
        $("#progress_bar_quota_text").html(percent + "% (" + this.bytesToSize(used, 0) + " / " + this.bytesToSize(total, 0) + ")");

    },

    bytesToSize: function(bytes, precision) {
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
    },

    selectMenu: function(index) {
        $('#mainMenu li').each(function() {
            $(this).removeClass('selected');
        });

        if ((index >= 1) && (index <= 6)) {
            $('#myFolders li').each(function() {
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                }
            });
        }

        if (index == 1) {
            $('#mainMenu li.inbox').addClass("selected");
        }

        if (index == 2) {
            $('#mainMenu li.calendar').addClass("selected");
        }

        if (index == 3) {
            $('#mainMenu li.contacts').addClass("selected");
        }

        if (index == 4) {
            $('#mainMenu li.chat').addClass("selected");
        }

        if (index == 5) {
            $('#mainMenu li.settings').addClass("selected");
        }

        if (index == 6) {
            $('#mainMenu li.logout').addClass("selected");
        }

        this.closeMenu();

    },

    toggleMenu: function() {
        // console.log(Shared.menuOpen);
        if (Shared.menuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }

        return false;
    },

    openMenu: function() {
        // Shared.menuOpen = true;
        // var winWidth = $(window).width();
        // var menuButtonWidth = $('.top .menu').width();
        // var propWidth = Math.ceil(winWidth * 30 / 100);
        // if (Shared.isDesktop()) {
        //   propWidth = Math.ceil(winWidth * 15 / 100);
        // }
        // var width =  280;

        // if ((winWidth - menuButtonWidth) < width)
        //   width = winWidth - menuButtonWidth;
        // else if (propWidth > width) 
        //   width = propWidth;

        // $('#menu').addClass('expanded').css('width', width);
        // $('#page').css('margin-left', width);

        // if (Shared.isDesktop()) {
        //   $('#page').css('width',winWidth - width);
        // }


        // if (Shared.scrollMenu == null) {
        //   this.loaded();
        // }

    },

    closeMenu: function() {
        // if (!Shared.isDesktop()) {
        //   Shared.menuOpen = false;
        //   $('#menu').removeClass('is-visible').removeAttr('style');
        //   $('#menu').removeClass('expanded').removeAttr('style');
        //   $('#page').removeAttr('style');
        //   $('#page').css('margin-left', '0');
        // } 
    },

    loaded: function() {
        // if (Shared.scrollMenu != null) {
        //   Shared.scrollMenu.destroy();
        //   Shared.scrollMenu = null;
        // }

        // $("#scrollerMenu").css("overflow-y","auto");
        // $("#scrollerMenu").css("height","100%");


    },

    setChatBadge: function(value) {
        if (value > 0) {
            $("#badge_chat").removeClass("hidden");
            $("#badge_chat").html(value);
        } else {
            $("#badge_chat").addClass("hidden");
            $("#badge_chat").html(value);
        }
    },

    setMailBadge: function(value) {
        if (value > 0) {
            $("#badge_inbox").removeClass("hidden");
            $("#badge_inbox").html(value);
        } else {
            $("#badge_inbox").addClass("hidden");
            $("#badge_inbox").html(value);
        }
    },

    enableBackButton: function(enabled) {
        if (enabled) {
            $('#mainHeader_backButton').removeClass("hidden");
            $('#mainHeader_menuButton').addClass("hidden");
        } else {
            $('#mainHeader_backButton').addClass("hidden");
            $('#mainHeader_menuButton').removeClass("hidden");
        }
    },

    renderContextMenu: function(menuID, params) {

        // console.log("renderContextMenu: " + menuID);

        this.context = new ContextMenuView();
        var contextMenuCollection = new ContextMenuCollection();
        if (menuID == 'detailMessage') {
            this.context.collection = contextMenuCollection.getDetailMessageMenu(params.folderID, params.msgID, params.folderType, params.qtdMessages);
        }
        if (menuID == 'messageList') {
            this.context.collection = contextMenuCollection.getMessagesListMenu(params.folderID, params.folderName, params.folderType, params.qtdMessages);
        }
        if (menuID == 'newMessage') {
            this.context.collection = contextMenuCollection.getSendMessageMenu(params);
        }
        if (menuID == 'newMessageWithCc') {
            this.context.collection = contextMenuCollection.getSendMessageMenuWithCC(params);
        }
        if (menuID == 'personalContacts') {
            this.context.collection = contextMenuCollection.getPersonalContactsMenu();
        }
        if (menuID == 'generalContacts') {
            this.context.collection = contextMenuCollection.getGeneralContactsMenu();
        }
        if (menuID == 'detailsContact') {
            this.context.collection = contextMenuCollection.getDetailsContactMenu(params.email, params.contactID, params.contactType);
        }
        if (menuID == 'calendar') {
            this.context.collection = contextMenuCollection.getCalendarMenu(params.year, params.month, params.day);
        }
        if (menuID == 'mailsignature') {
            this.context.collection = contextMenuCollection.getMailSignatureMenu();
        }
        if (menuID == 'changePassword') {
            this.context.collection = contextMenuCollection.getChangePasswordMenu(params);
        }
        if (menuID == 'calendarAddEvent') {
            this.context.collection = contextMenuCollection.getCalendarAddEventMenu(params);
        }
        if (menuID == 'calendarAddEventParticipant') {
            this.context.collection = contextMenuCollection.getCalendarAddEventParticipantMenu(params);
        }
        if (menuID == 'calendarDetailsEvent') {
            this.context.collection = contextMenuCollection.getCalendarDetailsEventMenu(params.isOwner, params.eventID, params.year, params.month, params.day);
        }
        if (menuID == 'editFolder') {
            this.context.collection = contextMenuCollection.getEditFolderMenu(params);
        }
        if (menuID == 'support') {
            this.context.collection = contextMenuCollection.getSupportMenu(params);
        }
        if (menuID == 'chatOffline') {
            this.context.collection = contextMenuCollection.getChatOfflineMenu(params);
        }
        this.context.render();
    },

});

export default MenuView;