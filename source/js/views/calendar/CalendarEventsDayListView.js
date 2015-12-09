import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';
import EventsListCollection from 'EventsListCollection';
import LoadingView from 'LoadingView';
import calendarEventsDayListTemplate from 'calendarEventsDayListTemplate';
var CalendarEventsDayListView = Backbone.View.extend({
    year: '',
    month: '',
    day: '',
    data: {},

    events: {
        'click #events li a': 'selectItem'
    },

    render: function() {
        var events = new EventsListCollection();
        var date = new Date(this.year, this.month - 1, this.day);

        for (var i in this.data.events) {
            var dateStart = ((this.data.events[i].get('eventStartDate')).split(' ')[0]).split('/');
            dateStart = new Date(dateStart[2], (dateStart[1] - 1), dateStart[0]);

            if (dateStart.getTime() == date.getTime())
                events.add(this.data.events[i]);
        }

        var newData = {
            events: events.models,
            year: this.year,
            month: this.month,
            day: this.day,
            _: _
        };

        var htmlTemplate = _.template(calendarEventsDayListTemplate);
        var htmlWithData = htmlTemplate(newData);

        this.$el.html(htmlWithData);
        $('#eventsList').empty().append(this.$el);
    },

    initialize: function() {},

    selectItem: function(e) {
        e.preventDefault();
        Shared.router.navigate(e.currentTarget.getAttribute("href"), {
            trigger: true
        });
    }

});

export default CalendarEventsDayListView;
