import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';
import ContactModel from 'ContactModel';
var ContactsListCollection = Backbone.Collection.extend({
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

    getContact: function(pContactType,pContactID, ignoreCache) {
        var that = this;
        that._data = {};

        var thatModel = ContactModel;
        var data = this._data;

        Shared.api.resource('Catalog/Contacts').params({
            contactID: pContactID,
            contactType: pContactType
        });

        if (ignoreCache) {
            Shared.api.ignoreCache(ignoreCache);
        }

        Shared.api.done(function(result) {

            if (that._functions.done)
                that._functions.done(result.contacts);
        })
        .fail(function(error) {
            if (that._functions.fail)
                that._functions.fail(error);
        })

        return that;
    },

    getContacts: function(pSearch, pContactType, ignoreCache) {
        var that = this;
        that._data = {};

        var thatModel = ContactModel;
        var data = this._data;

        Shared.api
            .resource('Catalog/Contacts')
            .params({
                search: pSearch,
                contactType: pContactType
            });

        if (ignoreCache) {
            Shared.api.ignoreCache(ignoreCache);
        }

        Shared.api.done(function(result) {
                for (var i in result.contacts) {
                    var thisModel = new thatModel(result.contacts[i]);

                    that.add(thisModel);
                }

                if (that._functions.done)
                    that._functions.done(that);
            })
            .fail(function(error) {
                if (that._functions.fail)
                    that._functions.fail(error);
            }).execute();

        return that;
    },

    getContactImagePictureByEmail: function(email,callback) {
        var that = this;
        this.done(function(result){

            _.each(result.models,function(contact){

                var contactEmail = contact.get("contactMails")[0];

                if (contactEmail == email) {
                    var contactID = contact.get("contactID");
                    contactID = decodeURIComponent(contactID);
                    that.getContactImagePicture(contactID,callback);
                }
            }); 

            
        }).fail(function(error) {
            callback("");
        }).getContacts(email,2,false);
    },

    getContactImagePicture: function(pContactID, callback) {
        this.api
            .resource('Catalog/ContactPicture')
            .params({
                contactID: pContactID,
                contactType: '2'
            })
            .done(function(result) {
                callback(_.first(result.contacts).contactImagePicture);
            })
            .fail(function(error) {
                callback("");
            })
            .execute();
    },

    execute: function() {
        return this.api.execute();
    }

});

export default ContactsListCollection;