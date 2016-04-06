
import Shared from 'shared';
import expressoAPI from 'expressoAPI';
import contactsApi from 'contactsApi';
import AppPageBehavior from 'AppPageBehavior';
import SharedBehavior from 'SharedBehavior';
import page from 'page';

Polymer({
    is: 'contact-list',

    behaviors: [
      AppPageBehavior,
      SharedBehavior,
    ],

    listeners: {
      'evt-unselect-item' : '_onUnSelectItem',
      'evt-select-item' : '_onSelectItem',
      'evt-select-row' : '_onSelectRow',
    },

    properties: {

      previousSearches: {
        type: Array,
        value: [],
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
        type: Number,
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

      showSelection: {
        type: Boolean,
        value: false,
        observer: '_showSelectionChanged'
      },

      selectionEnabled: {
        type: Number,
        value: true,
        reflectToAttribute: true
      },

      searchMustBeMoreSpecific: {
        type: Boolean,
        value: false,
      },

      searchReturnedTooManyResults: {
        type: Boolean,
        value: false,
      },

      searchReturnedNoResults: {
        type: Boolean,
        value: false,
      },

      showCard: {
        type: Boolean,
        value: false,
      },

      cardTitle: {
        type: String,
        value: '',
      },

      cardSubTitle: {
        type: String,
        value: '',
      },

      cardHelp: {
        type: String,
        value: '',
      },

      signals: {
        type: Number,
        value: true,
      },

    },

    setupCard: function(title,subtitle,help) {
      this.cardTitle = title;
      this.cardSubTitle = subtitle;
      this.cardHelp = help;
      this.showCard = true;
    },

    /* SIGNALS */
    _signalRefresh: function() {
      if (this.signals) {
        this.reloadContent(true);
      }
    },

    _signalContactDelete: function() {
      if (this.signals) {
        this.$.confirmDeleteDialog.open();
      }
    },
    _signalContactCreate: function() {
      if (this.signals) {
        this.openPage('contact-edit');
      }
    },

    _signalContactEdit: function() {
      if (this.signals) {
        this.openPage('contact-edit/1/' + this.selectedItems[0].contactId);
      }
    },

    _signalContactCompose: function() {
      if (this.signals) {
        this._composeEmailToSelectedContacts();
      }
    },


    //FAB MENU//
    refreshMenuItems: function() {

      var menuNormal = [
        {iconClass: "social:person-add", type: 'signal', route: "contact-create",title: "Novo Contato"}
      ];
      var menuSingleSelect = [ 
        {iconClass: "social:person-add", type: 'signal', route: "contact-create",title: "Novo Contato"},
        {iconClass: "delete",  type: 'signal', route: "contact-delete",title: "Apagar Contato"},
        {iconClass: "social:person", type: 'signal', route: "contact-edit",title: "Alterar Contato"},
        {iconClass: "create", type: 'signal', route: "contact-compose",title: "Escrever Email"},
      ];
      var menuMultiSelected = [
        {iconClass: "social:person-add", type: 'signal', route: "contact-create",title: "Novo Contato"},
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


    /* SELECTION */
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
      this.refreshMenuItems();
    },

    _onSelectItem: function(e) {
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


    _onSelectRow: function(e) {
      var contactID = e.detail.eventData.get('contactId');

      var personal = '2';
      if (this.personalContacts) {
        personal = '1';
      } 

      var route = 'contact-detail/' + personal + '/' + contactID;
      this.openPage(route);

    },

    _showSelectionChanged: function() {
      this.$.selectedItemsList.fire('resize');
      this.refreshMenuItems();
    },


    reloadContent: function(ignoreCache,callBack) {

      this.ignoreCache = ignoreCache;
      this.searchMustBeMoreSpecific = false;
      this.searchReturnedTooManyResults = false;
      this.setBackButtonEnabled(false);
      this.setRefreshButtonEnabled(true,'contact-list-refresh');
      if (this.personalContacts) {
        this.getContacts(this.search,1,this.ignoreCache,callBack);
      } else {
        this.getContacts(this.search,2,this.ignoreCache,callBack);
      }
    },

    _searchChanged: function() {
      if (this.search != '') {
        // console.log('searchChanged');
        this.reloadContent(true);
      }
    },


    _closeDeleteConfirmationDialog: function() {
      this.$.confirmDeleteDialog.close();
    },

    _composeEmailToSelectedContacts: function() {
      var contactEmails = '';
      for (var i in this.selectedItems) {
        contactEmails = contactEmails + "," + this.selectedItems[i].email;
      }

      contactEmails = contactEmails.substr(1,contactEmails.length);

      this.openPage('mail-compose/' + contactEmails);

    },

    _deleteSelectedContacts: function() {

      this.$.confirmDeleteDialog.close();

      var errors = 0;
      var qtdDeleted = 0;
      var qtdFail = 0;
      var qtdToDelete = this.selectedItems.length;

      var that = this;

      var completeAllDeletions = function() {
        that.selectedItems = [];
        that.reloadContent(true);
        if (qtdFail == 0) { 
          that.showMessage(qtdDeleted + " contato(s) foram apagado(s).");
        } else {
          that.showMessage("Não foi possível apagar " + qtdFail + " contato(s).","error");
          that.showMessage(qtdDeleted + " contatos foram apagados.");
        }
        
      };

      var deleteCallback = function(data) {
        qtdDeleted = qtdDeleted + 1;
        if ((qtdDeleted + qtdFail) == qtdToDelete) {
          completeAllDeletions();
        }
      };

      var failDeleteCallback = function(data) {
        qtdFail = qtdFail + 1;
        if ((qtdDeleted + qtdFail) == qtdToDelete) {
          completeAllDeletions();
        }
      };

      for (var i in this.selectedItems) {

        contactsApi.init().contactID(this.selectedItems[i].contactId)
        .done(function(data) {
          deleteCallback(data);
        })
        .fail(function(error) {
          failDeleteCallback(error);
        }).deleteContact();

      }

    },

    _computeShowCardStyle: function(showCard) {
      if (!showCard) {
        return '';
      } else {
        return 'display: none;';
      }
    },

    getContacts: function(pSearch,ptype,ignorecache,callBack) {

      this.searchMustBeMoreSpecific = false;
      this.searchReturnedTooManyResults = false;
      this.searchReturnedNoResults = false;
      this.showCard = false;
      this.setLoading(true);

      if (ptype == 1) {
        this.setPageTitle("Contatos Pessoais");
      } 
      
      this.contacts = [];

      var that = this;

      contactsApi
      .init()
      .ignoreCache(ignorecache)
      .contactType(ptype)
      .search(pSearch)
      .done(function(contacts) { 

        //   if (callBack != undefined) {
      //     callBack(contacts);
      //   }

        var currentIndex = 0;
        var arr_items = [];
        var lastLetter = '';

        if (contacts.lenght == 0) {
          that.setupCard('Nenhum contato encontrado.','','');
          that.searchReturnedNoResults = true;
        }

        for(var x in contacts) {

          var item = contacts[x];

          var currentLetter = item["contactFullName"][0];

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
              if (item["contactHasImagePicture"] == 0) {
                hasImagePicture = false;
              }
          }

          if (that.personalContacts) {
            attrs["personalContact"] = true;
            attrs["contactID"] = item["contactID"]; 
          } else {
            attrs["personalContact"] = false;
            attrs["contactID"] = item["contactUIDNumber"]; 
          }

          attrs["isContact"] = true;
          attrs["index"] = currentIndex;
          
          attrs["contactFullName"] = item["contactFullName"]; 
          attrs["contactMail"] = item["contactMails"][0];
          attrs["contactHasImagePicture"] = hasImagePicture;

          arr_items.push(attrs);

        }

        that.contacts = arr_items;

        that.setLoading(false);
        that.refreshMenuItems();

      })
      .fail(function(response) { 

        if (callBack != undefined) {
          callBack(response);
        }

        var error = response.error;

        that.setLoading(false);

        var catalogHelp = '<ul><li>Sua consulta deve ter no mínimo 3 caracteres.</li><li>Procure pelo nome e sobrenome.</li><li>Nenhum resultado será exibido caso a sua busca retorne mais do que 200 contatos.</li></ul>';

        if (error.code == "1001") {
          that.searchMustBeMoreSpecific = true;
          that.setupCard('Sua busca deve ser específica.','',catalogHelp);
        }

        if (error.code == "1019") {
          that.setupCard('Sua busca retornou muitos resultados.','',catalogHelp);

           that.searchReturnedTooManyResults = true;
        }

        that.handleErrors(response);

      })
      .getContacts();

      this.ignoreCache = false;
    },


  });