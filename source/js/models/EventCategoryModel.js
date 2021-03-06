import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';
var EventCategoryModel = Backbone.Model.extend({
    defaults: {},

    initialize: function() {
        this.api = Shared.api;
        this.readResource = '/Calendar/EventCategories';
        this.updateResource = '';
        this.createResource = '';
        this.deleteResource = '';
    },

    route: function() {
        return '/Calendar/Categories';
    },

    done: function(value) {
        this.done = value;

        return this;
    },

    fail: function(value) {
        this.fail = value;

        return this;
    }

});

export default EventCategoryModel;