import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';
import chatListItemsTemplate from 'chatListItemsTemplate';

var ChatListItemsView = Backbone.View.extend({

    render: function() {

        var that = this;

        var isConnected = Shared.im.isConnected();

        var AllContacts = [];

        if (isConnected) {
            AllContacts = Shared.im.getAllContacts();
        }


        var data = {
            contacts: AllContacts,
            isConnected: isConnected,
            _: _,
            Shared: Shared
        };

        var htmlTemplate = _.template(chatListItemsTemplate);
        var compiledTemplate = htmlTemplate(data);

        var elementID = "#scrollerList";
        if (Shared.isDesktop()) {
            elementID = "#scrollerListCHAT";
        }
        $(elementID).html(compiledTemplate);

        if (!isConnected) {
            Shared.menuView.renderContextMenu('chatOffline', {});
        }

    },


});

export default ChatListItemsView;
