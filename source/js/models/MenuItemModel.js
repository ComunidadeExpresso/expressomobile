import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';

var MenuItemModel = Backbone.Model.extend({

    // Default attributes for the message.
    defaults: {
        menuTitle: "",
        menuRoute: "",
        menuClass: "",
        menuIconClass: "",
        menuHasBadge: false,
    },

    initialize: function() {

    },


});

export default MenuItemModel;
