import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';
import EventCategoryModel from 'EventCategoryModel';
var EventCategoriesCollection = Backbone.Collection.extend({
    model: EventCategoryModel,
    _data: {},
    _functions: {},

    done: function(value) {
        this._functions.done = value;
        return this;
    },

    fail: function(value) {
        this._functions.fail = value;
        return this;
    },

    initialize: function(models, options) {
        this.api = Shared.api;
        this.model = EventCategoryModel;
    },

    listEventCategories: function(pCategoryId) {
        var that = this;
        that._data = {};

        var thatModel = EventCategoryModel;
        var data = this._data;

        this.api
            .resource('Calendar/EventCategories')
            .params({
                eventCategoryID: pCategoryId
            })
            .done(function(result) {
                for (var i in result.eventCategories) {
                    var thisModel = new thatModel(result.eventCategories[i]);
                    that.add(thisModel);
                }

                if (that._functions.done)
                    that._functions.done(that);
            })
            .fail(function(error) {
                if (that._functions.fail)
                    that._functions.fail(error);
            })
            .execute();

        return that;
    },

    execute: function() {
        return this.api.execute();
    }

});

export default EventCategoriesCollection;