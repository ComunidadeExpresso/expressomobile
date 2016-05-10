
import Shared from 'shared';

var eventsApi = {

    _debug : false,
    _dateStart: '',
    _dateEnd: '',
    _ignoreCache: false,
    _categoryID: '',
    _eventID: '',

    init: function() {

        this._dateStart = '';
        this._dateEnd = '';
        this._categoryID = '';
        this._eventID = '';

        this._ignoreCache = false;
        this._debug =  true;
        this._done = null;
        this._fail = null;
        return this;
    },

    execute: function() {
        return Shared.api.execute();
    },

    done: function(value) {
        this._done = value;
        return this;
    },

    fail: function(value) {
        this._fail = value;
        return this;
    },

    debug: function(value) {
        this._debug = value;
        return this;
    },

    ignoreCache: function(value) {
        this._ignoreCache = value;
        return this;
    },

    dateStart: function(value) {
        this._dateStart = value;
        return this;
    },

    dateEnd: function(value) {
        this._dateEnd = value;
        return this;
    },
    eventID: function(value) {
        this._eventID = value;
        return this;
    },
    categoryID: function(value) {
        this._categoryID = value;
        return this;
    },

    _getParamsSearch: function() {

        if (this._eventID == '') {
            var params = {
                dateStart: this._dateStart,
                dateEnd: this._dateEnd
            };
        } else {
            var params = {
                eventID: this._eventID
            };
        }

        return params;
    },

    log: function(message) {
        if (this._debug) {
            console.log('eventsAPI: ' + message);
        }
    },

    warn: function(message) {
        if (this._debug) {
            console.warn('eventsAPI (ERROR): ' + message);
        }
    },

    getEvent: function() {
        var that = this;
        var params = { eventID: this._eventID };
        Shared.api
        .resource('Calendar/Event')
        .params(params);

        var paramsString = JSON.stringify(params);

        Shared.api.ignoreCache(this._ignoreCache);

        Shared.api.done(function(result) {
            that.log('getEvent: ' + paramsString + ' - ' +  JSON.stringify(result));
            if (that._done) {
                that._done(result.events);
            } 
        }).fail(function(error) {
            that.warn('getEvent: ' + paramsString + ' - ' + JSON.stringify(error));
            if (that._fail) {
                that._fail(error);
            }  
        }).execute();

        return that;
    },

    getEvents: function() {

        var that = this;
        var params = this._getParamsSearch();
        Shared.api
        .resource('Calendar/Events')
        .params(params);

        var paramsString = JSON.stringify(params);

        Shared.api.ignoreCache(this._ignoreCache);

        Shared.api.done(function(result) {
            that.log('getEvents: ' + paramsString + ' - ' +  JSON.stringify(result));
            if (that._done) {
                that._done(result.events);
            } 
        }).fail(function(error) {
            that.warn('getEvents: ' + paramsString + ' - ' + JSON.stringify(error));
            if (that._fail) {
                that._fail(error);
            }  
        }).execute();

        return that;
    },

    getCategories: function() {

        var that = this;

        var params = {};
        if (this._categoryID != '') {
            params = { eventCategoryID: this._categoryID };
        } 

        Shared.api
        .resource('Calendar/EventCategories')
        .params(params);

        var paramsString = JSON.stringify(params);

        Shared.api.ignoreCache(this._ignoreCache);

        Shared.api.done(function(result) {
            that.log('getEvents: ' + paramsString + ' - ' +  JSON.stringify(result));
            if (that._done) {
                that._done(result.eventCategories);
            } 
        }).fail(function(error) {
            that.warn('getEvents: ' + paramsString + ' - ' + JSON.stringify(error));
            if (that._fail) {
                that._fail(error);
            }  
        }).execute();

        return that;

    },
    
};

export default eventsApi;