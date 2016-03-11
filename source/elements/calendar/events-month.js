
import EventsListCollection from 'EventsListCollection';
import Shared from 'shared';

Polymer({
    is: 'events-month',

    properties: {
      month: {
        type: Number,
        value: 0,
        observer: '_monthChanged'
      },

      year: {
        type: Number,
        value: 2016
      },

      monthCssClass: {
        type: String,
        value: '',
        computed: '_computeMonthCssClass(month)'
      },

      monthName: {
        type: String,
        value: '',
        computed: '_computeMonthName(month)'
      },

      isLoading: {
        type: Number,
        value: false,
        reflectAttribute: true,
      },

      isMonth: {
        type: Number,
        value: true,
        reflectAttribute: true,
      },

      eventData: {
        type: Array,
        value: [],
        reflectToAttribute: true,
      },

      events: {
        type: Array,
        value: [],
        reflectToAttribute: true,
      }
     
    },

    listeners: {

    },

    ready: function() {

    },

    _monthChanged: function() {
      //this.getMonthEvents();
    },

    _eatEvent: function(e) {
      e.stopPropagation();
    },

    /*
eventAllDay: "0"
eventCategoryID: ""
eventDate: "20160128"
eventDateEnd: ""
eventDateStart: ""
eventDescription: ""
eventEndDate: "28/01/2016 23:59"
eventExParticipants: ""
eventID: "158842"
eventLocation: ""
eventName: ""
eventOwner: ""
eventOwnerIsParticipant: ""
eventParticipants: Object
eventParticipantsLdap: Array[0]
eventPriority: ""
eventStartDate: "28/01/2016 23:00"
eventTimeEnd: ""
eventTimeStart: ""
eventType: ""
*/

    callbackLoadingMonths: function(data) {
      var arr_items = [];

      var that = this;

      var currentIndex = 0;
      var isResponseFromCurrentMonth = true;
      _.each(data.events, function(item) {

        var attrs = {};
        currentIndex = currentIndex + 1;

        attrs["index"] = currentIndex;
        attrs["eventID"] = item.get("eventID"); 
        attrs["eventName"] = item.get("eventName"); 
        attrs["eventDate"] = item.get("eventDate");

        attrs["eventStartDate"] = item.get("eventStartDate");
        attrs["eventEndDate"] = item.get("eventEndDate");

        attrs["eventDay"] = item.get("eventStartDate").split('/')[0];
        attrs["eventMonth"] = item.get("eventStartDate").split('/')[1];

        
        if (parseInt(attrs["eventMonth"]) != that.month) {
          console.log("isResponseFromCurrentMonth: " + attrs["eventMonth"] + " - " + that.month);
          isResponseFromCurrentMonth = false;
          
        }

        if (isResponseFromCurrentMonth) {
          arr_items.push(attrs);
        }
        
      });

      if (isResponseFromCurrentMonth) {
        this.isLoading = false;
        this.events = arr_items;
      }
    },

    getMonthEvents: function() {
      this.isLoading = true;

      var pad = "00";
      var fmonth = pad.substring(0, pad.length - ("" + this.month).length) + ("" + this.month);

      if (this.year != undefined) {
        var lastDay = new Date(this.year, this.month, 0);
        lastDay = lastDay.getDate();

        var pDateStart = '01/' + fmonth + '/' + this.year;
        var pDateEnd = lastDay + '/' + fmonth + '/' + this.year;

        this.listEvents(pDateStart, pDateEnd, true);
      }
    },

    listEvents: function(pDateStart, pDateEnd, ignoreCache) {
      var that = this;
      var eventsData = new EventsListCollection();
      eventsData.done(function(data) {
          var data = {
              events: data.models
          };

          that.callbackLoadingMonths(data);

      })
      .fail(function(data) {
          var data = {
              error: data.error
          };

          that.callbackLoadingMonths(data);
      }).listEvents(pDateStart, pDateEnd, ignoreCache);
    },



    _computeMonthName: function() {
      var name = '';
      if (this.month == 1) { name='Janeiro'; }
      if (this.month == 2) { name='Fevereiro'; }
      if (this.month == 3) { name='Março'; }
      if (this.month == 4) { name='Abril'; }
      if (this.month == 5) { name='Maio'; }
      if (this.month == 6) { name='Junho'; }
      if (this.month == 7) { name='Julho'; }
      if (this.month == 8) { name='Agosto'; }
      if (this.month == 9) { name='Setembro'; }
      if (this.month == 10) { name='Outubro'; }
      if (this.month == 11) { name='Novembro'; }
      if (this.month == 12) { name='Dezembro'; }
      return name;
    },

    _computeMonthCssClass: function(month) {
      var name = 'mdl-card__title month_bg_' + month;
      return name;
    },

    _computeShowLoadingStyle: function() {
      if (this.isLoading) {
        return '';
      } else {
        return 'display: none;';
      }
      
    },

    _decodeHTMLEntities: function(val) {
      var t = document.createElement('textarea');
      t.innerHTML = val;
      return t.textContent;
    },

    showMessage: function(message,msgType) {

      if (msgType == undefined) {
        msgType = 'info';
      }

      this.fire('iron-signal', {
        name: 'toaster-bake',
        data: {
          text: message,
          type: msgType,
        }
      });

    },
    
  });