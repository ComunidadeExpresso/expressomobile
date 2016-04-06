
import Shared from 'shared';
import contactsApi from 'contactsApi';

import AppPageBehavior from 'AppPageBehavior';
import SharedBehavior from 'SharedBehavior';
import page from 'page';


Polymer({
    is: 'contact-card',

    behaviors: [
      AppPageBehavior,
      SharedBehavior,
    ],

    properties: {

      contactType: {
        type: Number,
        value: 1,
      },

      contactId: {
        type: String,
        value: '',
        notify: true,
        reflectToAttribute: true,
      },

      phones: {
        type: Array,
        value: [],
        notify: true,
        reflectToAttribute: true,
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
        notify: true,
        reflectToAttribute: true,
      },

      notes: {
        type: String,
        value: '',
        notify: true,
        reflectToAttribute: true,
      },

      hasImagePicture: {
        type: Boolean,
        value: false, 
      },

      personalContact: {
        type: Boolean,
        value: true,
      },

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
      this.setLoading(true);
      if (this.contactType == 1) {
        this.personalContact = true;
        that.setPageTitle("Contatos Pessoais","");
      } else {
        that.setPageTitle("Catálogo Geral","");
        this.personalContact = false;
      }
      var doneCallback = function(contact) {

        that.name = contact.contactFullName;
        that.email = contact.contactMails[0];
        if (contact.contactPhones != null) {
          that.phones = contact.contactPhones;
        } else {
          that.phones = contact.contactPhones;
        }
        
        that.setBackButtonEnabled(true);
        that.setRefreshButtonEnabled(false);
        that.setLoading(false);
        that.isLoading = false;
        that.updateBackgroundImage();
        that.refreshMenuItems();

      }
      this.getContact(this.contactType,this.contactId,false,doneCallback);
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

    deleteContact: function() {
      var that = this;

      contactsApi.init().contactID(this.contactId)
      .done(function(data) {
        that.showMessage("Contato removido com sucesso!");
        that.openPage('contact-list');
      })
      .fail(function(error) {
        that.showMessage("Não foi possível remover o contato!","error");
        that.openPage('contact-list');
      }).deleteContact();

    },

    composeEmail: function() {
      var app = document.querySelector('#app');
      page(app.baseUrl + 'mail-compose/' + this.email);
    },


  });