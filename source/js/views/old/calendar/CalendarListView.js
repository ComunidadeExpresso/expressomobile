import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';
import EventsListCollection from 'EventsListCollection';
import LoadingView from 'LoadingView';
import CalendarEventsDayListView from 'CalendarEventsDayListView';
import CalendarFullDayListView from 'CalendarFullDayListView';
import PullToActionView from 'PullToActionView';
import calendarTemplate from 'calendarTemplate';
import primaryContentTemplate from 'primaryContentTemplate';
import jqueryui from 'jqueryui';
import jqueryui_datepicker_ptBR from 'jqueryui_datepicker_ptBR';
var CalendarListView = Backbone.View.extend({
    year: '',
    month: '',
    day: '',
    fullDay: false,
    status: '',
    data: {},
    dayTitle: '',
    onlyDatePicker: false,

    render: function() {
        var self = this;
        var pad = "00";
        var today = new Date();

        if (this.year == '' || this.year == undefined)
            this.year = today.getFullYear();

        if (this.month == '' || this.month == undefined) {
            this.month = today.getMonth() + 1; // Months are zero based;
            this.month = pad.substring(0, pad.length - ("" + this.month).length) + ("" + this.month);
        }

        if (this.day == '' || this.day == undefined) {
            this.day = today.getDate();
            this.day = pad.substring(0, pad.length - ("" + this.day).length) + ("" + this.day);
        }

        this.clean();

        var callback = function(data) {
            self.$el.html(_.template(primaryContentTemplate));
            $('#content').empty().append(self.$el);
            $('#scroller').html(_.template(calendarTemplate));

            self.renderDatePicker();

            if (self.onlyDatePicker === false)
                self.listDayEvents(data);

            self.loaded();
        }

        var lastDay = new Date(this.year, this.month, 0);
        lastDay = lastDay.getDate();

        var pDateStart = '01/' + this.month + '/' + this.year;
        var pDateEnd = lastDay + '/' + this.month + '/' + this.year;

        this.listEvents(pDateStart, pDateEnd, false, callback, callback);


    },

    listEvents: function(pDateStart, pDateEnd, ignoreCache, callbackSucess, callbackFail) {
        var self = this;

        var eventsData = new EventsListCollection();
        eventsData.done(function(data) {
                self.data = {
                    events: data.models,
                    _: _
                };

                if (callbackSucess)
                    callbackSucess(self.data);
            })
            .fail(function(data) {
                self.data = {
                    error: data.error,
                    _: _
                };

                if (callbackFail)
                    callbackFail(self.data);
            }).listEvents(pDateStart, pDateEnd, ignoreCache);
    },

    listDayEvents: function(data) {
        if (!Shared.isSmartPhoneResolution() || this.fullDay) {
            var calendarFullDayListView = new CalendarFullDayListView();
            calendarFullDayListView.year = this.year;
            calendarFullDayListView.month = this.month;
            calendarFullDayListView.day = this.day;
            calendarFullDayListView.data = data;
            calendarFullDayListView.dayTitle = this.dayTitle;
            calendarFullDayListView.render();
        } else {
            var calendarEventsDayListView = new CalendarEventsDayListView();
            calendarEventsDayListView.year = this.year;
            calendarEventsDayListView.month = this.month;
            calendarEventsDayListView.day = this.day;
            calendarEventsDayListView.data = data;
            calendarEventsDayListView.render();
        }

        this.loaded();
    },

    initialize: function() {
        this.container = $('#scroller');
    },

    changeMonthYear: function(y, m, ignoreCache) {
        var self = this;

        var callback = function(data) {
            self.refreshDatePicker();
        }

        var pad = "00";
        var m = pad.substring(0, pad.length - ("" + m).length) + ("" + m);
        var lastDay = new Date(y, m, 0);
        lastDay = lastDay.getDate();

        this.year = y;
        this.month = m;

        var pDateStart = '01/' + m + '/' + y;
        var pDateEnd = lastDay + '/' + m + '/' + y;

        this.listEvents(pDateStart, pDateEnd, ignoreCache, callback, callback);
    },

    highlightDays: function(date) {
        if (!_.isEmpty(this.data.events)) {
            for (var i in this.data.events) {
                var dateStart = ((this.data.events[i].get('eventStartDate')).split(' ')[0]).split('/');
                dateStart = new Date(dateStart[2], (dateStart[1] - 1), dateStart[0]);

                var dateEnd = ((this.data.events[i].get('eventEndDate')).split(" ")[0]).split('/');
                dateEnd = new Date(dateEnd[2], (dateEnd[1] - 1), dateEnd[0]);

                if (date.getTime() == dateStart.getTime() || date.getTime() == dateEnd.getTime()) {
                    return [true, 'hasEvent'];
                }
            }
        }

        return [true, ''];
    },

    refreshDatePicker: function() {
        $('#agenda').datepicker("refresh");
    },

    renderDatePicker: function() {
        var self = this;

        $('#agenda').datepicker({
            dayNamesShort: $.datepicker.regional["pt-BR"].dayNamesShort,
            dayNames: $.datepicker.regional["pt-BR"].dayNames,
            monthNamesShort: $.datepicker.regional["pt-BR"].monthNamesShort,
            monthNames: $.datepicker.regional["pt-BR"].monthNames,
            inline: true,
            autoSize: true,
            nextText: '>',
            prevText: '<',
            dateFormat: 'DD, dd/mm/yy',
            onChangeMonthYear: function(year, month, widget) {
                self.changeMonthYear(year, month, false);
            },
            beforeShowDay: function(date) {
                return self.highlightDays(date);
            },
            onSelect: function(date, obj) {
                var selectedDate = (date.split(', ')[1]).split('/');
                var url = 'Calendar/' + selectedDate[2] + '/' + selectedDate[1] + '/' + selectedDate[0];

                Shared.router.navigate(url, {
                    trigger: true
                });
            }
        });

        if (this.year != '' && this.month != '' && this.day != '')
            $("#agenda").datepicker("setDate", new Date(this.year, this.month - 1, this.day));

        this.dayTitle = $.datepicker.formatDate('DD, dd/mm/yy', new Date(this.year, this.month - 1, this.day));
    },

    loaded: function() {

        var that = this;

        // Shared.scrollerRefresh();
        Shared.menuView.renderContextMenu('calendar', {
            year: this.year,
            month: this.month,
            day: this.day
        });
        Shared.setDefaultIMListeners();

        Shared.setCurrentPageTitle("Agenda");

        var refreshAction = function() {
            that.changeMonthYear(that.year, that.month, true);
        };

        var pullToAction = new PullToActionView({
            refreshAction: refreshAction,
            container: '#pull-to-action-loader'
        });
        pullToAction.render();

        // $('#content .searchArea').remove();
        // $('#contentTitle').text('Agenda');
        // $('#contentTitle').addClass("icon-agenda");

        if (this.status == 'OK') {
            Shared.showMessage({
                type: "success",
                icon: 'icon-agenda',
                title: 'Evento excluído com sucesso.',
                description: '',
                timeout: 3000,
                elementID: '#pageMessage',
            });
        }
    },

    pullDownAction: function() {

        this.changeMonthYear(this.year, this.month, true);

        pullDownEl = document.getElementById('pullDown');
        pullDownEl.className = '';

        Shared.scrollerRefresh();
    },

    clean: function() {
        var contentLoadingView = new LoadingView({
            el: $('#content')
        });
        contentLoadingView.render();

        if (!Shared.isSmartPhoneResolution() && this.onlyDatePicker === false) {
            var contentDetailLoadingView = new LoadingView({
                el: $('#contentDetail')
            });
            contentDetailLoadingView.render();
        }
    }
});

export default CalendarListView;