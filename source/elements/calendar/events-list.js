
import EventsListCollection from 'EventsListCollection';
import Shared from 'shared';

Polymer({
    is: 'events-list',

    properties: {

      currentMonth: {
        type: Number,
        value: 0
      },

      currentYear: {
        type: Number,
        value: 2013
      },

      months: {
        type: Array,
        value: [],
        notify: true,
        reflectToAttribute: true,
      },

      monthsPerPage: {
        type: Number,
        value: 10,
      },

      menuItems: {
        type: Array,
        value: [],
        notify: true,
        reflectToAttribute: true,
      },
      elementIndex: {
        type: String,
        value: '',
        notify: true,
        reflectToAttribute: true,
      },

      elementID: {
        type: String,
        value: '',
        notify: true,
        reflectToAttribute: true,
      },

      selectedPage: {
        type: Number,
        value: 0
      },
      isLoading: {
        type: Boolean,
        value: true,
      },
      isLoadingNextPage: {
        type: Number,
        value: false,
        reflectAttribute: true,
      },


      lastIndexScroll: {
        type: String,
        value: '',
      },
     
    },

    listeners: {
      'finished-loading-next-page': "_finishedLoadingNextPage"
    },

    _finishedLoadingNextPage: function() {
      console.log("finished-loading-next-page:" + this.lastIndexScroll + " - " + this.lastScrollTopBeforeLoad);
      this.$.itemsList.scrollToIndex(this.lastIndexScroll);
      // console.log(this.$.itemsList);
      // console.log(Polymer.dom(this.$.itemsList));
      // Polymer.dom(this.$.itemsList).scroll(this.lastScrollTopBeforeLoad - 700,0);
      // this.$.itemsList.scroll(this.lastScrollTopBeforeLoad - 700,0);
      // this.$.itemsList.scrollTop = this.lastScrollTopBeforeLoad - 700;
    },

    ready: function() {

      this._addNextMonths(12);

    },

    _eatEvent: function(e) {
      e.stopPropagation();
    },

    _setMonthAsLoaded: function(month,year) {

      // console.log("_setMonthAsLoaded:" + year + month);

      // var arr_months = [];

      // for (var i = 0; i <= this.months.length - 1; i++) {
      //   var currentMonth = this.months[i];
      //   if (currentMonth["isMonth"]) {
      //     if (parseInt(currentMonth["month"]) == month){
      //       if (currentMonth["year"] == year) {
      //         currentMonth["isLoading"] = false;
      //         console.log("loading: false");
      //       }
      //     }
      //   }
      //   arr_months.push(currentMonth);
      // }

      // this.months = arr_months;

    },

    _getLastMonthIndex: function() {
      var lastMonthIndex = 0;
      for (var i = 0; i <= this.months.length - 1; i++) {
        var currentMonth = this.months[i];
        
        if (currentMonth["isMonth"]) {
          lastMonthIndex = i;
        }
      }
      return lastMonthIndex;
    },

    _addEvent: function(item) {
      var arr_months = [];

      var month = parseInt(item["eventData"]["eventMonth"]);
      var year = parseInt(item["eventData"]["eventYear"]);
      var day = parseInt(item["eventData"]["eventDay"]);
      var eventID = item["eventData"]["eventID"];

      var found = false;

      for (var i = 0; i <= this.months.length - 1; i++) {
        var currentMonth = this.months[i];
        
        if (!currentMonth["isMonth"]) {
          if (eventID == currentMonth["eventData"]["eventID"]) {
            found = true;
          }
        }
      }

        for (var i = 0; i <= this.months.length - 1; i++) {
          var currentMonth = this.months[i];

           if (found) {
            if (currentMonth["isMonth"]) {
              if (parseInt(currentMonth["month"]) == month){
                if (currentMonth["year"] == year) {
                  currentMonth["isLoading"] = false;
                }
              }
            }
          }

          arr_months.push(currentMonth);

          if (!found) {
            if (currentMonth["isMonth"]) {
              if (parseInt(currentMonth["month"]) == month){
                if (currentMonth["year"] == year) {
                  arr_months.push(item);
                }
              }
            }
          }
        }
      

      this.months = arr_months;
    },

    _addNextMonths: function(qtdMonths) {

      var arr_months = [];

      // console.log("_addNextMonths");
      // console.log(this.months);

      // if (this.months.length != 0) {
      //   for (var i = 0; i <= this.months.length - 1; i++) {
      //     arr_months.push(this.months[i]);
      //   }
      // }

      var startMonth = this.currentMonth + 1;
      var startYear = this.currentYear;
      if (startMonth == 13) {
        startMonth = 1;
        startYear = startYear + 1;
      }
      
    
      var currentIndex = this.months.length;

      for (var i = 1; i <= qtdMonths; i++) {
        
        if (this.currentMonth == 12) {
          this.currentMonth = 0;
          this.currentYear = this.currentYear + 1;
        }
        this.currentMonth = this.currentMonth + 1;

        var data = {};

        currentIndex = currentIndex + 1;
        data["index"] = this.currentYear + "" + this.currentMonth + "00001";
        data["isMonth"] = true;
        data["month"] = this.currentMonth;
        data["year"] = this.currentYear;
        data["isLoading"] = true;
        data["eventData"] = [];

        if (this.months.length == 0) {
          arr_months.push(data);
        } else {
          this.months.push(data);
        }
        

      }

      if (this.months.length == 0) {
        console.log("arr_months");
        this.months = arr_months;
      } 

      

      //this.fire('months-changed');

      this.getMonthEvents(startMonth,startYear,qtdMonths);

      //console.log(this.months);
    },


    getMonthEvents: function(month,year,qtdNextMonths) {
      this.isLoading = true;

      var nextMonth = month + qtdNextMonths;
      var nextYear = year;

      if (nextMonth >= 12) {
        nextMonth = nextMonth - 12;
        nextYear = nextYear + 1;
      }
 
      var pad = "00";
      var fmonth = pad.substring(0, pad.length - ("" + month).length) + ("" + month);
      
      var fNmonth = pad.substring(0, pad.length - ("" + nextMonth).length) + ("" + nextMonth);


      if (year != undefined) {
        var lastDay = new Date(nextYear, nextMonth, 0);
        lastDay = lastDay.getDate();

        var pDateStart = '01/' + fmonth + '/' + year;
        var pDateEnd = lastDay + '/' + fNmonth + '/' + nextYear;

        var that = this;

        var callbackSuccess = function(data) {

          that.isLoadingNextPage = false;

          var currentIndex = 1;
          var arr_items = [];

          var eventsArray = [];
          if (data.events != undefined) {
            eventsArray = data.events.reverse();
          }

          for (var i in eventsArray) {

            var item = eventsArray[i];

            var attrs = {};
            currentIndex = currentIndex + 1;
            
            attrs["isMonth"] = false;
            attrs["isLoading"] = false;
            attrs["eventData"] = [];
            attrs["eventData"]["eventID"] = item.get("eventID"); 
            attrs["eventData"]["eventName"] = item.get("eventName"); 
            attrs["eventData"]["eventDate"] = item.get("eventDate");

            attrs["eventData"]["eventStartDate"] = item.get("eventStartDate");
            attrs["eventData"]["eventEndDate"] = item.get("eventEndDate");

            attrs["eventData"]["eventDay"] = item.get("eventStartDate").split('/')[0];
            attrs["eventData"]["eventMonth"] = item.get("eventStartDate").split('/')[1];
            attrs["eventData"]["eventYear"] = item.get("eventStartDate").split('/')[2].split(' ')[0];

            var Fmonth = attrs["eventData"]["eventMonth"];
            var Fyear  = attrs["eventData"]["eventYear"];

            attrs["index"] = Fyear + "" + Fmonth + "0000" + currentIndex;

            that._addEvent(attrs);

          }

          that.fire('finished-loading-next-page');
        }

        this.listEvents(pDateStart, pDateEnd, true,callbackSuccess,callbackSuccess);
      }
    },

    //_startLoadingMonths: function() {

      // var that = this;

      // var arr_months = this.months;

      // for (var i = 0; i <= arr_months.length - 1; i++) {
      //   if (arr_months[i]["isLoading"]) {
      //     this.getMonthEvents(arr_months[i]["month"],arr_months[i]["year"]);
      //   }
      // }

    //},

    listEvents: function(pDateStart, pDateEnd, ignoreCache, callbackSucess, callbackFail) {
      var eventsData = new EventsListCollection();
      eventsData.done(function(data) {
          var data = {
              events: data.models
          };

          if (callbackSucess)
              callbackSucess(data);
      })
      .fail(function(data) {
          var data = {
              error: data.error
          };

          if (callbackFail)
              callbackFail(data);
      }).listEvents(pDateStart, pDateEnd, ignoreCache);
    },


    onScroll: function(e) {

      if (!this.isLoadingNextPage) {

        // console.log("onScroll");

        // console.log("scrollTop:" + (e.target.scrollTop + e.target.offsetHeight));
        // console.log("scrollHeight:" + e.target.scrollHeight);

        if (e.target.scrollTop + e.target.offsetHeight >= e.target.scrollHeight -  100) {

          this.lastIndexScroll = this._getLastMonthIndex();
          this.isLoadingNextPage = true;
          this._addNextMonths(12);
          
        }
        
      } 
    },

    _computeShowLoadingNextPageStyle: function(isLoadingNextPage) {
      if (isLoadingNextPage) {
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