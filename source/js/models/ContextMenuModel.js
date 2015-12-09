import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';

var ContextMenuModel = Backbone.Model.extend({

    // Default attributes for the message.
    defaults: {
        route: "",
        id: "",
        title: "",
        iconClass: "",
        callBack: "",
        parentCallBack: "",
        primary: false,
    },

    initialize: function() {

    },

});

export default ContextMenuModel;
