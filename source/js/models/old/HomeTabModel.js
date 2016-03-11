import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';

var HomeTabModel = Backbone.Model.extend({
    defaults: {
        tabID: '',
        tabIndex: '',
        tabRoute: '',
        tabClosable: false,
        searchFunction: '',
        contextMenu: '',
        refreshFunction: false,
    },

    initialize: function() {

    },

});

export default HomeTabModel;
