import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';

var ExpressoModel = Backbone.Model.extend({

    // Default attributes for the message.
    defaults: {
        auth: "",
        profile: {},
    },

    initialize: function() {

    },

});

export default ExpressoModel;
