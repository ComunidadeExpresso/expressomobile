
// import EventsListCollection from 'EventsListCollection';
import Shared from 'shared';
import AppPageBehavior from 'AppPageBehavior';
import SharedBehavior from 'SharedBehavior';
import moment from 'moment';
import eventsApi from 'eventsApi';
import page from 'page';

Polymer({
    is: 'events-list',

    behaviors: [
      AppPageBehavior,
      SharedBehavior,
    ],

    properties: {

      selectedPage: {
        type: Number,
        value: 0,
        notify: true,
      },

      eventID: {
        type: String,
        value: '',
      },

      selected: {
        type: Number,
        value: 0,
        notify: true,
      },

      ignoreCache: {
        type: Boolean,
        value: false,
        notify: true,
      },

      curDate: {
        type: Object,
        value: 0,
        notify: true,
        reflectToAttribute: true,
        observer: 'curDateChanged',
      },

      curEvent: {
        type: Object,
        value: 0,
        observer: 'curEventChanged',
      },

      events: {
        type: Array,
        value: [],
        reflectToAttribute: true,
        notify: true,
      }, 

    },

    listeners: {
      'evt-calendar-day-change': 'dayChange',
      'evt-calendar-day-selected': 'daySelected',
      'evt-calendar-switch-page': 'switchPage',
      'evt-calendar-event-selected': 'eventSelected',
    },

    /* SIGNALS */
    _signalRefresh: function() {
      console.log('_signalRefresh');
      this.ignoreCache = true;
      this.refresh();
      this.curDateChanged(this.curDate);
      // if (this.signals) {
      //   this.reloadContent(true);
      // }
    },


    refresh: function() {
      this.setLoading(false);
      this.setPageTitle("Agenda","");
      this.setRefreshButtonEnabled(true,'events-list-refresh');
      this.refreshMenuItems();

      this.setBackButtonEnabled(false);
      if (this.selectedPage == 0) {

      }

      if (this.selectedPage == 1) {
        this.setPageTitle("","");
        this.setBackButtonEnabled(true);
        this.getEvent(this.eventID);
      }
    },

    //FAB MENU//
    refreshMenuItems: function() {

      var menuNormal = [
        {iconClass: "icons:event", type: 'signal', route: "event-create",title: "Novo Evento"}
      ];

      var menuDetail = [
        {iconClass: "icons:event-note", type: 'signal', route: "event-edit",title: "Editar Evento"}
      ];

      var menuItems = [];
      menuItems = menuNormal;
      this.setMenuItems(menuItems);
    },

    switchPage: function(event,detail) {
      var page = 'events-list/' + detail.curDate.format("DD-MM-YYYY") + "/" + detail.selected; 
      this.openPage(page);
    },

    daySelected: function(event,detail) {
      var page = 'events-list/' + detail.curDate.format("DD-MM-YYYY") + "/2";
      this.openPage(page);
    },

    dayChange: function(event,detail) {
      var page = 'events-list/' + detail.curDate.format("DD-MM-YYYY") + "/" + this.selected;
      this.openPage(page);
    },

    eventSelected: function(event,detail) {
      var page = 'event/' + detail.curEvent.eventID;
      this.openPage(page);
    },


    firstDateInCalendar: function(curDate) {
      return moment(curDate).startOf('month').startOf('week');
    },
    lastDateInCalendar: function(curDate) {
      return moment(curDate).endOf('month').endOf('week');
    },

    getEventObject: function(item) {
      var attrs = {
        eventID: item["eventID"], 
        eventName: item["eventName"],
        eventDescription: item["eventDescription"],
        eventCategoryID: item["eventCategoryID"],
        eventAllDay: item["eventAllDay"],
        eventOwner: item["eventOwner"],
        eventOwnerIsParticipant: item["eventOwnerIsParticipant"],
        eventParticipants: item["eventParticipants"],
        eventParticipantsLdap: item["eventParticipantsLdap"],
        eventType: item["eventType"],
        eventPriority: item["eventPriority"],
        eventLocation: item["eventLocation"],

        eventStartDate: moment(item["eventDateStart"] + " " + item["eventTimeStart"],["DD/MM/YYYY h:m"]),
        eventEndDate: moment(item["eventDateEnd"] + " " + item["eventTimeEnd"],["DD/MM/YYYY h:m"]),
        start: moment(item["eventStartDate"],["DD/MM/YYYY h:m"]),
        end: moment(item["eventEndDate"],["DD/MM/YYYY h:m"]),

      };

      return attrs;
    },

    getEvents: function(startDay,endDay) {

      this.events = [];
      var that = this;
      that.setLoading(true);

      eventsApi
      .init()
      .ignoreCache(this.ignoreCache)
      .dateStart(startDay)
      .dateEnd(endDay)
      .done(function(result) { 

        var arr_items = [];
        for(var x in result) {
          var attrs = that.getEventObject(result[x]);
          arr_items.push(attrs);
        }
        that.events = arr_items;
        that.setLoading(false);
        that.ignoreCache = false;

      })
      .fail(function(response) { 


      });

      this.isLoggedIn(function() { 
        eventsApi.getEvents();
      });
    },

    getEvent: function(eventID) {
        this.events = [];
      var that = this;
      that.setLoading(true);

      eventsApi
      .init()
      .ignoreCache(this.ignoreCache)
      .eventID(eventID)
      .done(function(result) { 

        var curEvent = that.getEventObject(result[0]);
        that.curEvent = curEvent;
        that.setLoading(false);
        that.ignoreCache = false;

      })
      .fail(function(response) { 


      });

      this.isLoggedIn(function() { 
        eventsApi.getEvent();
      });
    },

    curEventChanged: function(newValue,oldValue) {
      this.setPageTitle(newValue.eventName,newValue.eventDescription);
    },

    curDateChanged: function(newValue,oldValue) {

      if (this.selectedPage != 1) {
        var startDay = this.firstDateInCalendar(newValue).format('DD/MM/YYYY');
        var endDay = this.lastDateInCalendar(newValue).format('DD/MM/YYYY');
      
        this.getEvents(startDay,endDay,'');
      }

    },


  });