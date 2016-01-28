
import ContactsListCollection from 'ContactsListCollection';
import ContactModel from 'ContactModel';
import Shared from 'shared';

Polymer({
    is: 'contact-edit',

    properties: {

	  menuItems: {
        type: Array,
        value: [{iconClass: "icons:done", route: "contact-save",title: "Salvar Contato"}],
        notify: true,
        reflectToAttribute: true,
      },

      contactId: {
        type: String,
        value: '',
      },

      phone: {
        type: String,
        value: '',
      },

      name: {
        type: String,
        value: '',
      },

      email: {
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

    clean: function() {
    	console.log('clean');
    	this.name = '';
    	this.email = '';
    	this.phone = '';
    	this.contactId = '';
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

    submitForm: function(event) {

	    var params = {
	        contactAlias: this.name,
	        contactGivenName: this.name,
	        contactFamilyName: '',
	        contactEmail: this.email,
	        contactPhone: this.phone,
	    };

	    var that = this;

	    var contactModel = new ContactModel();
	    contactModel.addContact(params)
	    .done(function(data) {

        that.showMessage("Contato adicionado com sucesso!");
        that.fire('evt-edit-success');
	        
	    })
	    .fail(function(error) {
	      console.log("Erro adicionando");
          var codeError = error.error.code;
          console.log(codeError);

          var msg = "Não foi possível adicionar o contato!";
          if (codeError == "1053") {
            msg = "Já existe um contato cadastrado com esse email.";
          }
          that.showMessage(msg);
	    });

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


  });