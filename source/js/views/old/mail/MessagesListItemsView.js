import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';
import messagesListItemsTemplate from 'messagesListItemsTemplate';
import MessagesCollection from 'MessagesCollection';
// import Material from 'material';
import MessagesListItemView from 'MessagesListItemView';
import FoldersModel from 'FoldersModel';

var MessagesListItemsView = Backbone.View.extend({

    tagName: 'mail-messages',
    _shadow: null,


    parentFolders: [],

    items: [],

    initialize: function(data) {

        this.attributes = data.attributes;
        this.el["page"] = data.attributes["page"];
        this.el["search"] = data.attributes["search"];
        this.el["folder-id"] = data.attributes["folder-id"];
        
    },

    resize: function() {
        this.el.resize();
    },

    render: function(elementID) {
        $(elementID).empty().append(this.el);
    },

    events: {

    },

});

export default MessagesListItemsView;
