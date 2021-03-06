import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';
import EventModel from 'EventModel';
import LoadingView from 'LoadingView';
var CalendarDeleteEventView = Backbone.View.extend({
    eventID: 0,
    year: '',
    month: '',
    day: '',

    render: function(options) {
        var self = this;

        if (!Shared.isSmartPhoneResolution())
            this.$el = $('#contentDetail');

        var loadingView = new LoadingView({
            el: this.$el
        });
        loadingView.render();


        var callbackSuccess = function(data) {
            Shared.router.navigate('/Calendar/' + self.year + '/' + self.month + '/' + self.day + '/OK', {
                trigger: true
            });
        }

        var callbackFail = function(error) {
            Shared.router.navigate('/Calendar/Events/' + self.eventID + '/Error', {
                trigger: true
            });
        }

        this.deleteEvent(callbackSuccess, callbackFail);
    },

    deleteEvent: function(callbackSucess, callbackFail) {
        var eventModel = new EventModel();
        eventModel.deleteEvent(this.eventID)
            .done(function(data) {
                if (callbackSucess)
                    callbackSucess(data);
            })
            .fail(function(error) {
                if (callbackFail)
                    callbackFail(error);
            });
    },

    initialize: function(options) {}

});

export default CalendarDeleteEventView;
