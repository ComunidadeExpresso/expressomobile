
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

      isEdition: {
        type: Boolean,
        value: false
      },

      pageTitle: { 
        type: String,
        value: 'Novo Contato',
      },

      cardImage: {
        type: String,
        value: '',
      },

      contactId: {
        type: String,
        value: '',
        notify: true,
        reflectToAttribute: true,
        observer: '_contactIdChanged',
      },

      phone: {
        type: String,
        value: '',
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

    },

    updateCardImage: function() {
      // console.log('updateCardImage');
      var RandomCard = Shared.getRandomCardBackground();
      this.cardImage = '../../imgs/paper-card-backgrounds/' + RandomCard;
    },

     attributeChanged: function(name, type) {
        
        if (name == 'name') {

          this.updateCardImage();
        }

        if (this.isEdition) {
          this.pageTitle = 'Alterar Contato';
        } else {
          this.pageTitle = 'Novo Contato';
        }
    },

    open: function() {
      
    },

    created: function() {

    },

    ready: function() {
      this.updateCardImage();
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

      if (this.$.formGet.validate()) {

  	    var params = {
  	        contactAlias: this.name,
  	        contactGivenName: this.name,
  	        contactFamilyName: '',
  	        contactEmail: this.email,
  	        contactPhone: this.phone,      
  	    };

        var that = this;

        if (this.isEdition) {

          this.showMessage('Esta função ainda não está disponível.','error');
          console.warn("//TODO: edit-contact : Alterar a API para permitir a edição de contatos passando o contactID. ");
          params.contactID = this.contactId;

        } else {

          var contactModel = new ContactModel();
          contactModel.addContact(params)
          .done(function(data) {

            that.showMessage("Contato adicionado com sucesso!");
            that.fire('evt-edit-success');
              
          })
          .fail(function(data) {

              Shared.handleErrors(data.error);

              var codeError = data.error.code;
              
              var msg = "Não foi possível adicionar o contato!";
              if (codeError == "1053") {
                msg = "Já existe um contato cadastrado com esse email.";
              }
              that.showMessage(msg,"error");
          });

        }

	    }

    },

    _contactIdChanged: function() {
      var retVal = true;
      if (this.contactId == '') {
        retVal = false;
      }
      this.isEdition = retVal;
      // console.log("isEdition: "+ this.isEdition);
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

    closeCard: function() {
    	this.fire('evt-edit-cancel');
    },


  });