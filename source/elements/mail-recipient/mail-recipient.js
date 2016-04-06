
import _ from 'underscore';
import $ from 'jquery';
import Shared from 'shared';
import contactsApi from 'contactsApi';
import SharedBehavior from 'SharedBehavior';


Polymer({
    is: 'mail-recipient',

    behaviors: [
      SharedBehavior,
    ],

    properties: {
      recipientTitle: {
        type: String,
        value: 'Para:',
      },
      recipientValue: {
        type: String,
        value: '',
        notify: true,
        reflectAttribute: true,
      },
      recipients: {
        type: Array,
        value: [],
        notify: true,
        reflectAttribute: true,
      },

      contacts: {
        type: Array,
        value: [],
      },

      hasSearched: {
        type: Boolean,
        value: false,
      },

      visible: {
        type: Boolean,
        value: true,
      },

    },

    listeners: {
      'pt-item-confirmed' : 'itemConfirmed'
    },

    _isEmpty: function(value) {
      if (value == '') {
        return true;
      } else { 
        return false; 
      }
    },

    ready: function() {
      // this.getContacts('',1,false);
    },

    focusRecipient: function() {
       this.$.msgRecipientTyper.focus();
    },

    itemConfirmed: function(e) {
      console.log('itemConfirmed');
      
      this.addRecipient($.trim(e.target.inputValue),'');
    },

    checkRecipientValue: function(e) {

      if (!this.hasSearched) {
        this.getContacts('',1,false);
      }

      var email = e.target.value;
      var fEmail = email.substring(0,email.length - 1);

      //13 - ENTER
      //32 - ESPAÇO 
      //9 - TAB
      //59 - PONTO E VIRGULA
      //188 - VIRGULA
      //8 - BACKSPACE

      //ENTER E NÃO FOI SHIFT, VIRGULA, PONTO E VIRGULA, ESPAÇO
      if ((e.keyCode == 13 && !e.shiftKey) || (e.keyCode == 32) || (e.keyCode == 188) || (e.keyCode == 59)) {
          if (e.keyCode == 13 && !e.shiftKey) {
            fEmail = email;
          }

          if (this.validateEmail($.trim(fEmail))) {

              console.log('checkRecipientValue:' + email);

              this.addRecipient(fEmail,'');

              //VIRGULA, PONTO E VIRGULA, ESPAÇO
              if ((e.keyCode == 188) || (e.keyCode == 59) || (e.keyCode == 32)) {
                  e.preventDefault();
              }
          } else {
              //ENTER E NÃO FOI SHIFT E EMAIL = ''
              if ((e.keyCode == 13 && !e.shiftKey && email == "") || (e.keyCode == 9)) {
                  // $("#" + nextOrder + "Input").focus();

              }
          }
      }
      if ((e.keyCode == 8) && ($.trim(email) == "")) {
          this.splice('recipients', this.recipients.length - 1, 1);
      }

    },

    indexOfEmail: function(email) {
      var index = -1;
      var len = this.recipients.length;
      for (var i = 0; i < len; i++) { 
          if (email == this.recipients[i].email) {
            index = i;
          }
      }
      return index;
    },

    removeRecipientItem: function(e) {
      var email = e.target.dataEmail;
      var index = this.indexOfEmail(email);
      if (index != -1) {
         this.splice('recipients', index, 1);
      }
    },

    validateEmail: function(email) {
        var ck_email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return ck_email.test(email);
    },

    addRecipient: function(email,name) {
      console.log('addRecipient:' + email);
      var index = this.indexOfEmail(email);
      if (index == -1) {
        if (this.validateEmail($.trim(email))) {
          console.log('addRecipient:' + email);
          this.push('recipients', { 'name': name, 'email': email } );
          console.log(this.recipients);
        }
      }
      
      this.$.msgRecipientTyper.value = '';
      this.recipientValue = '';

    },


    getContacts: function(pSearch,ptype,ignorecache) {

      this.contacts = [];

      var that = this;

      contactsApi
      .init()
      .ignoreCache(ignorecache)
      .contactType(ptype)
      .search(pSearch)
      .done(function(response) { 

        var currentIndex  = 0;
        var arr_items     = [];
        var lastLetter    = '';

        for (var i in response) {
          var item = reponse[i];
          arr_items.push(item["contactMails"][0]);
        }

        that.contacts = arr_items;

      })
      .fail(function(error) {
        console.log(error);
      })
      .getContacts();

    },

  });