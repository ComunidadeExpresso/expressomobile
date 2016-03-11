
import Shared from 'shared';
import expressoAPI from 'expressoAPI';
import ContactsListCollection from 'ContactsListCollection';
import ContactModel from 'ContactModel';
import page from 'page';
import AppPageBehavior from 'AppPageBehavior';

Polymer({
    is: 'contact-list',

    behaviors: [
      AppPageBehavior
    ],

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
      // tempItems: {
      //   type: Array, 
      //   reflectAttribute: true,
      //   value: []
      // },
      selectedPage: {
        type: Number,
        value: 0
      },
      showSelection: {
        type: Boolean,
        value: false,
        observer: '_showSelectionChanged'
      },
      // isLoading: {
      //   type: Boolean,
      //   value: true,
      // },


      currentContact: {
        type: Object
      },


      searchMustBeMoreSpecific: {
        type: Boolean,
        value: false,
      },

      searchReturnedTooManyResults: {
        type: Boolean,
        value: false,
      },

    },

    listeners: {
      'evt-click-menu-fab-item': 'clickFabMenu',
      'evt-unselect-item' : '_onUnSelectItem',
      'evt-select-item' : '_onSelectItem',
      'evt-select-row' : '_onSelectRow',
      'evt-edit-cancel': '_cancelEdit',
      'evt-edit-success': '_hasEditedContact',
      'evt-delete-success': '_hasEditedContact',
      'evt-edit-contact' : '_editContact',
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

    setPageTitle: function(Ptitle,Psubtitle) {
      this.fire('iron-signal', {
        name: 'page-title',
        data: {
          title: Ptitle,
          subtitle: Psubtitle,
        }
      });
    },

    refreshMenuItems: function() {

      var menuNormal = [
        {iconClass: "social:person-add", type: 'route', route: "contact-create",title: "Novo Contato"}
      ];
      var menuSingleSelect = [ 
        {iconClass: "social:person-add", type: 'route', route: "contact-create",title: "Novo Contato"},
        {iconClass: "delete",  type: 'signal', route: "contact-delete",title: "Apagar Contato"},
        {iconClass: "social:person", type: 'route', route: "contact-edit",title: "Alterar Contato"},
        {iconClass: "create", type: 'route', route: "contact-compose",title: "Escrever Email"},
      ];
      var menuMultiSelected = [
        {iconClass: "social:person-add", type: 'route', route: "contact-create",title: "Novo Contato"},
        {iconClass: "delete", type: 'signal', route: "contact-delete",title: "Apagar Contato(s)"},
        {iconClass: "create", type: 'signal', route: "contact-compose",title: "Escrever Email"},
      ];

      var menuItems = [];

      if (this.showSelection == false) {
        menuItems = menuNormal;
      } else {
        if (this.selectedItems.length == 1) {
          menuItems = menuSingleSelect;
        } else {
          menuItems = menuMultiSelected;
        }
        
      }

      this.setMenuItems(menuItems);

    },
    _computedClass: function(isSelected) {
      var classes = 'item';
      if (isSelected) {
        classes += ' selected';
      }
      return classes;
    },

    reloadContent: function() {
      this.searchMustBeMoreSpecific = false;
      this.searchReturnedTooManyResults = false;
      this.setBackButtonEnabled(false);
      this.setRefreshButtonEnabled(false);
      if (this.personalContacts) {
        this.getContacts(this.search,1,this.ignoreCache);
      } else {
        this.getContacts(this.search,2,this.ignoreCache);
      }
    },

    _searchChanged: function() {
      if (this.search != '') {
        console.log('searchChanged');
        this.reloadContent();
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
      // if (name == 'selectedItems') {
      //   this.refreshMenuItems();
      // }
    },

    getContact: function(contactID) {
      return this.contactListCollection.getContactByID(contactID);
    },

    getContacts: function(pSearch,ptype,ignorecache) {

      this.searchMustBeMoreSpecific = false;
      this.searchReturnedTooManyResults = false;
      this.setLoading(true);
      // this.isLoading = true;

      if (ptype == 1) {
        this.pageTitle = "Contatos Pessoais";
        this.setPageTitle(this.pageTitle);
      } 
      

      this.contacts = [];

      this.contactListCollection =  new ContactsListCollection();
      var that = this;

      this.contactListCollection.done(function(data) {
          var currentIndex = 0;
          var arr_items = [];

          var lastLetter = '';

          _.each(data.models, function(item) {

              var currentLetter = item.get("contactFullName")[0];
              if (currentLetter.toUpperCase() != lastLetter.toUpperCase()) {

                lastLetter = currentLetter;
                var data = {};
                data["isContact"] = false;
                data["letter"] = lastLetter.toUpperCase();

                arr_items.push(data);
              }

              var attrs = {};
              currentIndex = currentIndex + 1;

              var hasImagePicture = true;

              //PERFORMANCE ISSUE
              //ONLY DON'T LOAD PICTURES FROM GENERAL CONTACTS THAT DOESN'T HAVE.
              if (!that.personalContacts) {
                  if (item.get("contactHasImagePicture") == 0) {
                    hasImagePicture = false;
                  }
              }

              if (that.personalContacts) {
                attrs["personalContact"] = true;
              } else {
                attrs["personalContact"] = false;
              }

              attrs["isContact"] = true;
              attrs["index"] = currentIndex;
              attrs["contactID"] = item.get("contactID"); 
              attrs["contactFullName"] = item.get("contactFullName"); 
              attrs["contactMail"] = item.get("contactMails")[0];
              attrs["contactHasImagePicture"] = hasImagePicture;

              arr_items.push(attrs);

          });

          that.contacts = arr_items;

          that.setLoading(false);
          // that.isLoading = false;

          that.refreshMenuItems();

      })
      .fail(function(data) {

        console.log(data.error)

        var error = data.error;

        that.setLoading(false);
        // that.isLoading = false;

        if (error.code == "1001") {
          that.searchMustBeMoreSpecific = true;
        }

        if (error.code == "1019") {
           that.searchReturnedTooManyResults = true;
        }
        
      }).getContacts(pSearch, ptype, true);
    },

    _onSelectRow: function(e) {
      var contactID = e.detail.eventData.get('contactId');
      var contact = this.getContact(contactID);

      // this.$.contactCard.personalContact = this.personalContacts;
      var personal = '2';
      if (this.personalContacts) {
        personal = '1';
      } 

      var app = document.querySelector('#app');
      page(app.baseUrl + 'contact-detail/' + personal + '/' + contactID);

      // this.currentContact = contact.attributes;
      // this.selectedPage = 1;

    },

    _hasEditedContact: function(e) {
      e.stopPropagation();

      this.selectedPage = 0;

      this.getContacts(this.search,1,true);
    },

    _signalContactDelete: function() {
      this.$.confirmDeleteDialog.open();
    },

    _signalContactCompose: function() {
      this._composeEmailToSelectedContacts();
    },


    closeContactCard: function() {
      this.selectedPage = 0;
    },

    deleteContact: function(e) {
      console.log(e);
    },

    clickFabMenu: function(e) {
      // e.stopPropagation();
      var route = e.target.get("currentMenu").get("item.route");


      if (route == 'contact-create') {
        this.$.contactEdit.clean();
        this.selectedPage = 2;
      }

      if (route == 'contact-edit') {
        this._editSelectedContact();
      }

    },

    _closeDeleteConfirmationDialog: function() {
      this.$.confirmDeleteDialog.close();
    },

    _cancelEdit: function() {
      this.selectedPage = 0;
    },

    _editContact: function(e) {
      console.log("_editContact");
      var contact = e.detail.contact;
      this._setContactEdit(contact);
      this.selectedPage = 2;
    },

    _setContactEdit: function(contact) {
      this.$.contactEdit.contactId = contact.contactId;
      this.$.contactEdit.name = contact.name;
      this.$.contactEdit.email = contact.email;
      this.$.contactEdit.phone = contact.phone;
    },

    _editSelectedContact: function() {
      console.log("_editSelectedContact");
      var contact = this.selectedItems[0];
      this._setContactEdit(contact);
      this.selectedPage = 2;
    },

    _composeEmailToSelectedContacts: function() {
      var contactEmails = '';
      for (var i in this.selectedItems) {
        contactEmails = contactEmails + "," + this.selectedItems[i].email;
      }

      contactEmails = contactEmails.substr(1,contactEmails.length);

      var app = document.querySelector('#app');
      page(app.baseUrl + 'mail-compose/' + contactEmails);

      console.warn("//TODO: contact-compose: " + contactEmails);
      // this.showMessage("Esta função ainda não está disponível.","error");
    },

    _deleteSelectedContacts: function() {

      this.$.confirmDeleteDialog.close();

      var contactIds = '';
      for (var i in this.selectedItems) {
        contactIds = contactIds + "," + this.selectedItems[i].contactId;
      }

      contactIds = contactIds.substr(1,contactIds.length);

      console.log("//TODO: contact-delete: " + contactIds);
      this.showMessage("Esta função ainda não está disponível.","error");
    },

    _eatEvent: function(e) {
      e.stopPropagation();
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

    toolbarChange: function(title,subtitle) {

      this.fire('iron-signal', {
        name: 'toolbarchange',
        data: {
          title: title,
          subtitle: subtitle,
        }
      });

    },
    
  });