
import MessagesCollection from 'MessagesCollection';
import ContactsListCollection from 'ContactsListCollection';
import Shared from 'shared';
import _ from 'underscore';

Polymer({
    is: 'material-search',

    properties: {
      previousSearches: {
        type: Array,
        value: function() { return []; },
        notify: true,
        reflectToAttribute: true,
      },

      mailResults: {
        type: Array,
        value: function() { return []; },
        notify: true
      },

      contactsResults: {
        type: Array,
        value: function() { return []; },
        notify: true
      },

      tabs: {
        type: Array,
        value: function() { return ['Email','Contatos','Agenda']; },
        notify: true
      },

      activeTab: {
        type: Number,
        value: 0,
        reflectToAttribute: true,
      },

      narrow: {
        type: Boolean,
        value: false
      },

      active: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        notify: true
      },

      loading: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        notify: true
      },

      searchValue: {
        type: String,
        value: null,
        observer: '_searchValueChanged'
      }

    },

    onSelect: function(e, detail) {
      this.async(function() {
        var route = detail.item.dataset.value;

        console.log(route);

        this.active = false;

        Shared.router.navigate(route,{trigger: true});

      }, 250); // Introduce small delay so user sees ripple.
    },

    toggle: function() {
      this.active = !this.active;
      if (this.active) {
        this.$.searchbox.focus();
      }
    },

    getSpeechInput: function(e) {
      var recognition = 'SpeechRecognition' in window ? new SpeechRecognition() :
                        'webkitSpeechRecognition' in window ? new webkitSpeechRecognition() :
                        null;
     if (recognition) {
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = function(e) {
        var result = e.results[0][0].transcript;
        this.searchValue = result;
      }.bind(this);
      recognition.start();
     }
    },

    doSearch: function(e) {
      if (e.keyCode == 13) {
        this._searchValueChanged();
      }
    },

    searchEmail: function() {
      var that = this;

      if ((this.searchValue != undefined) && (this.searchValue != '')) {

        this.messagesCollection = new MessagesCollection();
        this.messagesCollection.getMessagesInFolder('INBOX', '', this.searchValue, 1).done(function(Pdata) {

          var messages = Pdata.models;

          var newResults = [];
          _.each(messages, function(message){

            var subject = message.get("msgSubject");
            var route = "Mail/Messages/0/" + message.get("msgID") + "/" + message.get("folderID");
            var mail = { 
              title: subject,
              route: route,
            };
            newResults.push(mail);

          });

          that.mailResults = newResults;

        }).fail(function(result) {

        }).execute();

      }
    },

    searchContacts: function() {
      var that = this;

      if ((this.searchValue != undefined) && (this.searchValue != '')) {

        this.contactListCollection = new ContactsListCollection();
        this.contactListCollection.done(function(data) {

          var contacts = data.models;

          var newResults = [];
          _.each(contacts, function(contact){

            var contactName = contact.get("contactFullName");
            var contact = { 
              title: contact.get("contactFullName"),
              subtitle: contact.get("contactMails")[0],
            };
            newResults.push(contact);

          });

          that.contactsResults = newResults;

        })
        .fail(function(data) {
            // callbackFail({
            //     error: data.error,
            //     _: _
            // });
        }).getContacts(this.removeAccents(this.searchValue),'2', true);

      }
    },

    /** Fired when a search is made.
     *
     * @event search-change
     * @param {Object} detail
     * @param {Object} detail.searchValue The search string.
     */

    _searchValueChanged: function() {
      if ((this.searchValue != undefined) && (this.searchValue != '')) {
        console.log(this.get("previousSearches"));
        //this.fire('search-change', {value: this.searchValue},{value: this.searchValue});
        if (this.activeTab == 0) {
          this.searchEmail();
        }
        if (this.activeTab == 1) {
          this.searchContacts();
        }
        this.previousSearches.push(this.searchValue);
        //this.searchValue = '';
      }
    },

    _onPageChange:function(e,a) {

      if (this.activeTab == 0) {
        this.searchEmail();
      }
      if (this.activeTab == 1) {
        this.searchContacts();
      }

    },

    _decodeHTMLEntities: function(val) {
      var t = document.createElement('textarea');
      t.innerHTML = val;
      return t.textContent;
    },

    _computeHeaderClass: function(narrow) {
      return narrow ? 'core-narrow' : '';
    },

    removeAccents: function(strAccents) {
        var strAccents = strAccents.split('');
        var strAccentsOut = new Array();
        var strAccentsLen = strAccents.length;
        var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
        var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";

        for (var y = 0; y < strAccentsLen; y++) {
            if (accents.indexOf(strAccents[y]) != -1)
                strAccentsOut[y] = accentsOut.substr(accents.indexOf(strAccents[y]), 1);
            else
                strAccentsOut[y] = strAccents[y];
        }

        strAccentsOut = strAccentsOut.join('');

        return strAccentsOut;
    },
  });