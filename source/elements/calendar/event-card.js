
import Shared from 'shared';
import AppPageBehavior from 'AppPageBehavior';
import SharedBehavior from 'SharedBehavior';
import moment from 'moment';
import eventsApi from 'eventsApi';
import contactsApi from 'contactsApi';
import page from 'page';


Polymer({
    is: 'event-card',

    behaviors: [
      AppPageBehavior,
      SharedBehavior,
    ],

    properties: {

      eventID: {
        type: String,
        value: '',
        notify: true,
        reflectToAttribute: true,
      },

      eventCategories: {
        type: Array,
        value: [],
      },

      curEvent: {
        type: Object,
        value: 0,
        notify: true,
        reflectToAttribute: true,
      },

      curEventPriority: {
        type: String,
        value: '',
        computed: '_computePriority(curEvent)'
      },

      curEventCategories: {
        type: String,
        value: '',
        computed: '_computeEventCategories(curEvent)'
      },

      curEventParticipants: {
        type: Array,
        value: [],
      }

    },

    _computePriority: function(curEvent) {
      var result = "Nenhum";
      if (curEvent.eventPriority == "1") { result = "Baixo"; } 
      if (curEvent.eventPriority == "2") { result = "Normal"; } 
      if (curEvent.eventPriority == "3") { result = "Alto"; } 
      if (curEvent.eventPriority == "") { result = "Nenhum"; } 
      return result;
    },

    _computeEventCategories: function(curEvent) {
      return "Categorias";
    },

    refreshMenuItems: function() {

      var routeEdit = 'contact-edit/' + this.contactType + "/" + this.contactId;
      var menuNormal = [
        {iconClass: "icons:create", type:'route', route: routeEdit,title: "Editar Contato"}
      ];
      var menuGeneralContact = [ 
        {iconClass: "social:person-add", type:'route', route: routeEdit,title: "Novo Contato"},
      ];
      var menuItems = [];
      if (this.personalContact) {
        menuItems = menuNormal;
      } else {
        menuItems = menuGeneralContact;
      }
      this.setMenuItems(menuItems);

    },

    refresh: function() {
      var that = this;
      this.isLoading = true;
      this.setPageTitle("","");

      var doneCategories = function(categories) {

        var thot = that;

        var doneCallback = function(curEvent) {

          thot.curEvent = curEvent;

          thot.setPageTitle(curEvent.eventName,curEvent.eventDescription);

          thot.setBackButtonEnabled(true);
          thot.setRefreshButtonEnabled(false);
          thot.updateBackgroundImage();
          thot.refreshMenuItems();

        }
        that.getEvent(that.eventID,doneCallback);

      }
      this.getCategories(doneCategories);
      
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

    getCategories: function(doneCallback) {
      var that = this;

      eventsApi
      .init()
      .ignoreCache(this.ignoreCache)
      .done(function(data) { 
        doneCallback(data);
      })
      .fail(function(response) { 

      });

      this.isLoggedIn(function() { 
        eventsApi.getCategories();
      });
    },

    getEvent: function(eventID,doneCallback) {
      var that = this;

      that.setLoading(true);
      eventsApi
      .init()
      .ignoreCache(this.ignoreCache)
      .eventID(eventID)
      .done(function(data) { 

        that.setLoading(false);

        if (data.length != 0) {
          var curEvent = that.getEventObject(data[0]);
          doneCallback(curEvent);
        } else {
          that.showMessage('Evento não encontrado!',"warn");
          that.openPage('events-list');
        }

      })
      .fail(function(response) { 

        that.setLoading(false);
        that.showMessage('Evento não encontrado!',"warn");
        that.openPage('events-list');

      });

      this.isLoggedIn(function() { 
        eventsApi.getEvent();
      });
    },

    getContact: function(contactType,contactID,ignoreCache,doneCallback) {

      var that = this;
      that.isLoading = true;
      that.setLoading(true);

      contactsApi.init().ignoreCache(ignoreCache).contactType(contactType).contactID(contactID)
      .done(function(data) {

        that.setLoading(false);

        if (data.length != 0) {
          var item = data[0];
          doneCallback(item);
        } else {
          that.showMessage('Contato não encontrado!',"warn");
          that.openPage('contact-list');
        }

      })
      .fail(function(error) {

        that.setLoading(false);

        that.showMessage('Contato não encontrado!',"warn");
        that.openPage('contact-list');
        
      }).getContacts();

    },

    formatDate: function(date) {
      return moment(date).format('DD/MM/YYYY h:mm a');
    },

  });