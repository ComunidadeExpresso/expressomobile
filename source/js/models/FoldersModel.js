import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';

var FoldersModel = Backbone.Model.extend({

    // Default attributes for the message.
    defaults: {
        folderName: "",
        folderParentID: "",
        folderHasChildren: 0,
        qtdUnreadMessages: 0,
        qtdMessages: 0,
        folderID: "INBOX",
        folderType: 0,
        diskSizeUsed: "",
        diskSizePercent: 0
    },

    initialize: function() {
        this.api = Shared.api;
    },


    route: function() {
        return '/Mail/Messages/1/0/' + this.get("folderID") + '#';
    },




});

export default FoldersModel;
