
import ContactsListCollection from 'ContactsListCollection';
import ContactModel from 'ContactModel';
import Shared from 'shared';
import AppPageBehavior from 'AppPageBehavior';

Polymer({
    is: 'contact-card',

    behaviors: [
      AppPageBehavior
    ],

    listeners: {
      'evt-click-menu-fab-item': 'clickFabMenu',
    },


    properties: {

	  menuItems: {
        type: Array,
        value: [{iconClass: "icons:create", route: "contact-edit",title: "Editar Contato"}],
        notify: true,
        reflectToAttribute: true,
      },

      cardImage: {
        type: String,
        value: '',
        notify: true,
        reflectToAttribute: true,
      },

      contactId: {
        type: String,
        value: '',
      },

      phones: {
        type: Array,
        value: [],
      },

      name: {
        type: String,
        value: '',
        notify: true,
        reflectToAttribute: true,
      },

      email: {
        type: String,
        value: '',
      },

      notes: {
        type: String,
        value: '',
      },

      personalContact: {
        type: Boolean,
        value: true,
        observer: '_personalContactChanged'
      },

    },

    open: function() {
      
    },

    created: function() {

    },

    attributeChanged: function(name, type) {
        if (name == 'name') {
          this.updateCardImage();
        }
    },

    updateCardImage: function() {
      this.cardImage = this.getRandomCardBackground('../../imgs/paper-card-backgrounds/');
    },

    ready: function() {
      this.updateCardImage();
    },

    refreshMenuItems: function() {

      var menuNormal = [
        {iconClass: "icons:create", route: "contact-edit",title: "Editar Contato"}
      ];
      var menuGeneralContact = [ 
        {iconClass: "social:person-add", route: "contact-create",title: "Novo Contato"},
      ];

      var menuItems = [];
      if (this.personalContact) {
        menuItems = menuNormal;
      } else {
        menuItems = menuGeneralContact;
      }

      this.setMenuItems(menuItems);

    },

    _personalContactChanged: function() {
      this.refreshMenuItems();
    },

    clickFabMenu: function(e) {
      e.stopPropagation();
      var route = e.target.get("currentMenu").get("item.route");
      console.log("route:" + route);

      if (route == 'contact-edit') {
        this.fire('evt-edit-contact',{contact: this});
      }

      if (route == 'contact-create') {
        var newContact = this;
        newContact.contactId = '';
        newContact.phone = this.phones[0];
        this.fire('evt-edit-contact',{contact: newContact});
      }

    },

    deleteContact: function() {
      console.log("deleteContact:" + this.contactId);

      var that = this;

      var contactModel = new ContactModel();
      contactModel.deleteContact({
        contactID: this.contactId
      })
      .done(function(data) {

        that.showMessage("Contato removido com sucesso!");

        that.fire('evt-delete-success');
          
      })
      .fail(function(error) {
          
      });
    },


    composeEmail: function() {
      console.warn("//TODO: compose-email : Escrever email para " + this.email);
    },

    

    closeCard: function() {
    	this.fire('evt-edit-cancel');
    },

    _eatEvent: function(e) {
      e.stopPropagation();
    },


  });