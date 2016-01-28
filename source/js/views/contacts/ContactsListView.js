import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';


var ContactsListView = Backbone.View.extend({

    tagName: 'contact-list',

    _shadow: null,

    initialize: function(data) {
        if (data) {
            this.attributes = data.attributes;
        }
    },

    events: {

    },

    resize: function() {
        this.el.resize();
    },

    render: function() {
        $(this.attributes.elementID).empty().append(this.el);
    },


});

export default ContactsListView;
