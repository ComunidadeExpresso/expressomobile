
import Shared from 'shared';
import page from 'page';
import AppPageBehavior from 'AppPageBehavior';
import SharedBehavior from 'SharedBehavior';
import contactsApi from 'contactsApi';

Polymer({
    is: 'contact-edit',

    behaviors: [
      AppPageBehavior,
      SharedBehavior,
    ],

    properties: {

      isEdition: {
        type: Boolean,
        value: false,
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

    refreshMenuItems: function() {
      var menuNormal = [
        {iconClass: "icons:done", type:'signal', route: 'contact-save',title: "Salvar Contato"}
      ];
      this.setMenuItems(menuNormal);
    },

    refresh: function() {



      if ((this.contactType == 1) || (this.contactType == 2)) {
        var that = this;
        var doneCallback = function(contact) {
          that.name = contact.contactFullName;
          that.email = contact.contactMails[0];
          that.phone = contact.contactPhones[0];

          if (that.contactType == 2) {
            that.isEdition = false;
            that.setPageTitle('Novo contato','');
          } else {
            that.setPageTitle('Alterar Contato','');
          }
          that.setBackButtonEnabled(true);
          that.setRefreshButtonEnabled(false);
          // that.setLoading(false);
          that.isLoading = false;
          that.setLoading(false);
          that.updateBackgroundImage();
          that.refreshMenuItems();

        }
        this.getContact(this.contactType,this.contactId,false,doneCallback);
      } else {
        this.clean();
        this.setPageTitle('Novo contato','');
        this.setBackButtonEnabled(true);
        this.setRefreshButtonEnabled(false);
        this.isEdition = false;
        this.setLoading(false);
        this.updateBackgroundImage();
        this.refreshMenuItems();
      }
    },

    clean: function() {
    	this.name = '';
    	this.email = '';
    	this.phone = '';
    	this.contactId = '';
    },

    _contactSave: function() {
      this.submitForm();
    },

    _contactIdChanged: function() {
      var retVal = true;
      if (this.contactId == '') {
        retVal = false;
      }
      this.isEdition = retVal;
    },

    submitForm: function(event) {

      if (this.$.formGet.validate()) {

        var that = this;

        if (this.isEdition) {

          this.showMessage('Esta função ainda não está disponível.','error');
          console.warn("//TODO: edit-contact : Alterar a API para permitir a edição de contatos passando o contactID. ");
          // params.contactID = this.contactId;

        } else {

          contactsApi
          .init()
          .contactName(this.name)
          .addContactEmail(this.email)
          .addContactPhone(this.phone)
          .done(function(data) {
            that.showMessage("Contato adicionado com sucesso!");
            that.openPage('contact-list');
          })
          .fail(function(data) {

            var codeError = data.error.code;

            Shared.handleErrors(data.error);

            var msg = "Não foi possível adicionar o contato!";
              if (codeError == "1053") {
                msg = "Já existe um contato cadastrado com esse email.";
              }
              that.showMessage(msg,"error");
              
          }).saveContact();


        }

      }

    },

    getContact: function(contactType,contactID,ignoreCache,doneCallback) {

      var that = this;
      that.isLoading = true;
      that.setLoading(true);

      contactsApi.init().ignoreCache(ignoreCache).contactType(contactType).contactID(contactID)
      .done(function(data) {

        that.setLoading(false);

        var item = data[0];
        doneCallback(item);

      })
      .fail(function(error) {

        that.showMessage('Contato não encontrado!');
        that.openPage('contact-lit');
        that.setLoading(false);
          
      }).getContacts();

    },

  });