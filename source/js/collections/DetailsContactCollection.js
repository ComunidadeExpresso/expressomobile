import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';
// import ContactModel from 'ContactModel';
var DetailsContactCollection = Backbone.Collection.extend({
    model: ContactModel,
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
        this.model = ContactModel;
        this._functions = {};
    },

    getPersonalContactDetails: function(pContactID) {
        var that = this;
        that._data = {};

        var thatModel = ContactModel;
        var data = this._data;

        this.api
            .resource('Catalog/Contacts')
            .params({
                contactID: pContactID,
                contactType: '1'
            })
            .done(function(result) {
                for (var i in result.contacts) {
                    var thisContact = new thatModel(result.contacts[i]);
                    that.add(thisContact);
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

    getGeneralContactDetails: function(pContactID) {
        var that = this;
        that._data = {};

        var thatModel = ContactModel;
        var data = this._data;

        this.api
            .resource('Catalog/Contacts')
            .params({
                search: '',
                contactID: pContactID,
                contactType: '2'
            })
            .done(function(result) {
                for (var i in result.contacts) {
                    var thisContact = new thatModel(result.contacts[i]);
                    that.add(thisContact);
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

export default DetailsContactCollection;