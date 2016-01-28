
import ContactsListCollection from 'ContactsListCollection';
import ContactModel from 'ContactModel';
import Shared from 'shared';

Polymer({
    is: 'contact-card',

    properties: {

	  menuItems: {
        type: Array,
        value: [{iconClass: "icons:create", route: "contact-edit",title: "Editar Contato"}],
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
      },

      email: {
        type: String,
        value: '',
      },

      notes: {
        type: String,
        value: '',
      },

    },

    open: function() {
      
    },

    created: function() {

    },

    ready: function() {

    },

    listeners: {
      'evt-click-menu-fab-item': 'clickFabMenu',
    },

    clickFabMenu: function(e) {
      e.stopPropagation();
      var route = e.target.get("currentMenu").get("item.route");
      console.log("route");
      console.log(route);

      if (route == 'contact-save') {
        this.submitForm();
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

        Shared.showMessage({
              type: "success",
              icon: 'icon-expresso',
              title: "Contato removido com sucesso!",
              description: "",
              timeout: 3000,
              elementID: "#pageMessage",
          });

        that.fire('evt-delete-success');
          
      })
      .fail(function(error) {
          
      });
    },


    composeEmail: function() {
      console.log("composeEmail: " + this.email);
    },

    showMessage: function(message) {
      Shared.showMessage({
        type: "success",
        icon: 'icon-expresso',
        title: message,
        description: "",
        timeout: 3000,
        elementID: "#pageMessage",
      });
    },

    closeCard: function() {
    	this.fire('evt-edit-cancel');
    },

    _eatEvent: function(e) {
      e.stopPropagation();
    },


  });