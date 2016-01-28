
import ContactsListCollection from 'ContactsListCollection';
import ContactModel from 'ContactModel';
import Shared from 'shared';

Polymer({
    is: 'contact-list',

    properties: {

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

      search: {
        type: String,
        value: '',
        notify: true,
        reflectToAttribute: true,
        observer: '_searchChanged',
      },

      personalContacts: {
        type: Boolean,
        value: true
      },

      ignoreCache: {
        type: Boolean,
        value: false
      },

      contacts: {
        type: Array,
        value: [],
        reflectToAttribute: true,
      },

      selectedItems: {
        type: Array, 
        value: [],
        notify: true,
        reflectAttribute: true,
      },
      tempItems: {
        type: Array, 
        reflectAttribute: true,
        value: []
      },
      selectedPage: {
        type: Number,
        value: 0
      },
      showSelection: {
        type: Boolean,
        value: false,
        observer: '_showSelectionChanged'
      },
      isLoading: {
        type: Boolean,
        value: true,
      },


      currentContact: {
        type: Object
      }

    },

    listeners: {
      'evt-click-menu-fab-item': 'clickFabMenu',
      'evt-unselect-item' : '_onUnSelectItem',
      'evt-select-item' : '_onSelectItem',
      'evt-select-row' : '_onSelectRow',
      'evt-edit-cancel': '_CancelEdit',
      'evt-edit-success': '_hasEditedContact',
      'evt-delete-success': '_hasEditedContact',
    },

    created: function() {

    },

    _CancelEdit: function() {
      this.selectedPage = 0;
    },

    

    ready: function() {

      if (this.personalContacts) {
        this.getContacts(this.search,1,this.ignoreCache);
      } else {
        this.getContacts(this.search,2,this.ignoreCache);
      }

    },

    _isSelected: function(email) {
      var found = false;

      for (var i in this.selectedItems) {
        if (this.selectedItems[i].email == email) {
          found = true;
        }
      }
      return found;
    },

    _onUnSelectItem: function(e) {
      //console.log('_onUnSelectItem');
      var email = '';

      if (e.model != undefined) {
        email = e.model.item.email;
      } else {
        email = e.detail.eventData.email;
      }

      var newItems = [];
      for (var i in this.selectedItems) {
        if (this.selectedItems[i].email != email) {
          newItems.push(this.selectedItems[i]);
        }
      }
      this.selectedItems = newItems;
      if (this.selectedItems.length == 0) {
        this.showSelection = false;
      }
      // console.log(this.selectedItems);
      this.refreshMenuItems();
    },

    _onSelectItem: function(e) {
      //console.log("_onSelectItem");
      var item = e.detail.eventData;

      var newItems = [];

      var found = this._isSelected(item.email);

      for (var i in this.selectedItems) {
        newItems.push(this.selectedItems[i]);
      }
      if (!found) {
        newItems.push(item);
      }
      this.selectedItems = newItems;

      this.showSelection = true;
      this.refreshMenuItems();

    },

    iconForItem: function(isSelected) {
      return isSelected ? 'star' : 'star-border';
    },

    refreshMenuItems: function() {

      var menuNormal = [
        {iconClass: "social:person-add", route: "contact-create",title: "Novo Contato"}
      ];
      var menuSingleSelect = [ 
        {iconClass: "social:person-add", route: "contact-create",title: "Novo Contato"},
        {iconClass: "delete", route: "contact-delete",title: "Apagar Contato"},
        {iconClass: "social:person", route: "contact-edit",title: "Editar Contato"},
        {iconClass: "create", route: "contact-compose",title: "Escrever Email"},
      ];
      var menuMultiSelected = [
        {iconClass: "social:person-add", route: "contact-create",title: "Novo Contato"},
        {iconClass: "delete", route: "contact-delete",title: "Apagar Contato(s)"},
        {iconClass: "create", route: "contact-compose",title: "Escrever Email"},
      ];

      if (this.showSelection == false) {
        this.menuItems = menuNormal;
      } else {
        if (this.selectedItems.length == 1) {
          this.menuItems = menuSingleSelect;
        } else {
          this.menuItems = menuMultiSelected;
        }
        
      }

    },
    _computedClass: function(isSelected) {
      var classes = 'item';
      if (isSelected) {
        classes += ' selected';
      }
      return classes;
    },

    _searchChanged: function() {
      if (this.personalContacts) {
        this.getContacts(this.search,1,this.ignoreCache);
      } else {
        this.getContacts(this.search,2,this.ignoreCache);
      }
    },

    _showSelectionChanged: function() {
      // if (!this.isLoading) {
        this.$.selectedItemsList.fire('resize');
        this.refreshMenuItems();
      // }
    },


    attributeChanged: function(name, type) {
      // console.log(this.localName + '#' + this.id + ' attribute ' + name + ' was changed to ' + this.getAttribute(name));
      if (name == 'selectedItems') {
        this.refreshMenuItems();
      }
    },

    getContact: function(contactID) {
      return this.contactListCollection.getContactByID(contactID);
    },

    getContacts: function(pSearch,ptype,ignorecache) {

      this.isLoading = true;

      this.contacts = [];

      this.contactListCollection =  new ContactsListCollection();
      var that = this;

      this.contactListCollection.done(function(data) {
          var currentIndex = 0;
          var arr_items = [];

          var lastLetter = '';

          _.each(data.models, function(item) {

              var currentLetter = item.get("contactFullName")[0];
              if (currentLetter != lastLetter) {

                lastLetter = currentLetter;
                var data = {};
                data["isContact"] = false;
                data["letter"] = lastLetter;

                arr_items.push(data);
              }

              var attrs = {};
              currentIndex = currentIndex + 1;

              attrs["isContact"] = true;
              attrs["index"] = currentIndex;
              attrs["contactID"] = item.get("contactID"); 
              attrs["contactFullName"] = item.get("contactFullName"); 
              attrs["contactMail"] = item.get("contactMails")[0];

              arr_items.push(attrs);

          });

          that.contacts = arr_items;

          that.isLoading = false;

          that.refreshMenuItems();

      })
      .fail(function(data) {
          // callbackFail({
          //     error: data.error,
          //     _: _
          // });
      }).getContacts(pSearch, ptype, true);
    },

    _onSelectRow: function(e) {
      var contactID = e.detail.eventData.get('contactId');
      var contact = this.getContact(contactID);

      this.currentContact = contact.attributes;

      this.selectedPage = 1;

    },

    _hasEditedContact: function(e) {
      e.stopPropagation();

      this.selectedPage = 0;

      this.getContacts(this.search,1,true);
    },

    formResponse: function(event) {

    },


    closeContactCard: function() {
      this.selectedPage = 0;
    },

    deleteContact: function(e) {
      console.log(e);
    },

    clickFabMenu: function(e) {
      e.stopPropagation();
      var route = e.target.get("currentMenu").get("item.route");
      // console.log(route);

      if (route == 'contact-create') {
        this.$.contactEdit.clean();
        this.selectedPage = 2;
      }


      if (route == 'contact-delete') {

        var contactIds = '';
        for (var i in this.selectedItems) {
          contactIds = contactIds + "," + this.selectedItems[i].contactId;
        }

        contactIds = contactIds.substr(1,contactIds.length);

        console.log("contact-delete: " + contactIds);

      }

      if (route == 'contact-compose') {

        var contactEmails = '';
        for (var i in this.selectedItems) {
          contactEmails = contactEmails + "," + this.selectedItems[i].email;
        }

        contactEmails = contactEmails.substr(1,contactEmails.length);

        console.log("contact-compose: " + contactEmails);

      }
      //contact-delete
      //contact-create
      //contact-edit
      //contact-compose

    },

    _eatEvent: function(e) {
      e.stopPropagation();
    },

    _decodeHTMLEntities: function(val) {
      var t = document.createElement('textarea');
      t.innerHTML = val;
      return t.textContent;
    },
    
  });