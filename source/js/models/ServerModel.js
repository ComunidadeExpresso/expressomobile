import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';

var ServerModel = Backbone.Model.extend({

    // Default attributes for the message.
    defaults: {
        serverID: "",
        serverName: "",
        serverDescription: "",
        serverUrl: "",
        serverContext: "",
        serverStatus: "1",
    },

    initialize: function() {

    },

    getServerURL: function() {
        return this.get("serverUrl").concat(this.get("serverContext"));
    },

});

export default ServerModel;
