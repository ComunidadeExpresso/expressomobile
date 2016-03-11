
import Shared from 'shared';
import expressoAPI from 'expressoAPI';
import MessagesCollection from 'MessagesCollection';
import FoldersModel from 'FoldersModel';
import FoldersCollection from 'FoldersCollection';
import moment from 'moment';
import moment_ptBR from 'moment_ptBR';
import page from 'page';
import AppPageBehavior from 'AppPageBehavior';


Polymer({
    is: 'mail-messages',

    behaviors: [
      AppPageBehavior
    ],

    listeners: {
      'evt-click-menu-fab-item': 'clickFabMenu',
      // 'evt-mail-messages-reload-first-page': 'reloadFirstPage',
      'evt-unselect-thread': '_onUnSelectItem',
      'evt-select-thread': '_onSelectItem',
      'evt-toolbar-back' : '_onToolbarBack',
      // 'evt-toolbar-refresh' : '_onToolbarRefresh',
      'evt-move-selected-messages' : '_MoveSelectedMessagesToFolder',
    },

    _onToolbarRefresh: function(e) {
      // e.stopPropagation();
      if (this.selectedPage == 0) {
        this.reloadFirstPage();
      }
    },
    _onToolbarBack: function(e) {
      e.stopPropagation();
      if (this.selectedPage == 1) { 
        this.selectedPage = 0;
      }
    },

    onScroll: function(e) {

      if ((this.hasMoreMessages) && (!this.isLoading)) {


        if (e.target.scrollTop + e.target.offsetHeight >= e.target.scrollHeight - 100) {

          // Polymer.dom(this.$.loadingArea).classList.remove('hidden');
          this.setLoading(true);
          // this.isLoadingNextPage = true;
          // this.fire('lower-trigger');
          this.loadPage();

        }
        
      }

    },

    _MoveSelectedMessagesToFolder: function(e) {

      console.log('_MoveSelectedMessagesToFolder');

      var destinFolder = e.detail.folder;
      var destinFolderName = e.detail.folder.folderName;
      var qtdMsgs = this.selectedItems.length;

      if (qtdMsgs == 0) {
        that.showMessage('Não foi possível mover as mensagens.');
      }

      var msgsIDs = '';
      for (var i in this.selectedItems) {
        msgsIDs = msgsIDs + "," + this.selectedItems[i].msgid;
      }
      msgsIDs = msgsIDs.substr(1,msgsIDs.length);

      
      
      console.log('_MOVE_: ' + this.folderId + ' - ' + msgsIDs + ' - Destino:' + destinFolder.folderID);

      var that = this;
      this.foldersCollection = new FoldersCollection();
      this.foldersCollection.moveMessages(this.folderId, msgsIDs, destinFolder.folderID).done(function(data) {

        that.reloadFirstPage();
        that.showMessage(qtdMsgs + ' mensagen(s) movida(s) para pasta "' + destinFolderName + '".');
      }).fail(function(data) {
        that.showMessage('Não foi possível mover as mensagens.','warn');

      }).execute();;

    },

    _isSelected: function(msgid) {
      var found = false;

      for (var i in this.selectedItems) {
        if (this.selectedItems[i].msgid == msgid) {
          found = true;
        }
      }
      return found;
    },

    _onUnSelectItem: function(e) {
      //console.log('_onUnSelectItem');
      var msgid = '';

      if (e.model != undefined) {
        msgid = e.model.item.msgid;
      } else {
        msgid = e.detail.eventData.msgid;
      }

      var newItems = [];
      for (var i in this.selectedItems) {
        if (this.selectedItems[i].msgid != msgid) {
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

      var found = this._isSelected(item.msgid);

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

    refreshMenuItems: function() {

      var menuNormal = [
        {iconClass: "create", type: 'route', route: "mail-create",title: "Escrever Email", data: ""}
      ];
      var menuSingleSelect = [ 
        {iconClass: "create", type: 'route', route: "mail-create",title: "Escrever Email", data: ""},
        {iconClass: "delete", type: 'signal', route: "mail-delete",title: "Apagar Mensagem", data: ""},
        {iconClass: "forward", type: 'signal', route: "mail-forward",title: "Encaminhar Mensagem", data: ""},
        {iconClass: "forward", type: 'signal', route: "mail-move",title: "Mover Mensagem", data: ""},
        {iconClass: "reply", type: 'signal', route: "mail-reply",title: "Responder Email", data: ""},
      ];
      var menuMultiSelected = [
        {iconClass: "create", type: 'route', route: "mail-create",title: "Escrever Email", data: ""},
        {iconClass: "delete", type: 'signal', route: "mail-delete",title: "Apagar Mensagens", data: ""},
        {iconClass: "forward", type: 'signal', route: "mail-forward",title: "Encaminhar Mensagens", data: ""},
        {iconClass: "forward", type: 'signal', route: "mail-move",title: "Mover Mensagens", data: ""},
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

    

    loadPage: function(ignoreCache) {

      if (ignoreCache == undefined) {
        ignoreCache = false;
      }
      // console.log('loadPage:' + this.folderId);
      var that = this;

      var doneRefreshCallback = function(arr_items, appendAtEnd) {
        that.addItems(arr_items);
      };

      this.page = this.page + 1;
      this.getMessages(this.folderId, this.search, this.page, true, ignoreCache,doneRefreshCallback);
    },

    _refreshFolder: function() {

      //event only fired when toolbar is not hidden (material-search uses this element with toolbar-hidden )
      if (!this.toolbarHidden) {
        this.reloadFirstPage(true);
      }
      
    },

    reloadFirstPage: function(ignoreCache) {
      console.log("reloadFirstPage");
      this.items = [];
      this.page = 0;
      this.selectedPage = 0;

      this.setBackButtonEnabled(false);
      this.setRefreshButtonEnabled(true,'mail-messages-refresh-folder');

      this.selectedItems =[];
      this.showSelection = false;
      this.hasMoreMessages = true;
      this.setLoading(true);
      // this.isLoadingNextPage = true;
      this.refreshMenuItems();
      this.loadPage(ignoreCache);
    },

    doSearch: function(searchValue) {
      this.page = 0;
      this.items = [];
      this.search = searchValue;
      this.setLoading(true);
      // this.isLoadingNextPage = true;
      this.loadPage();
    },

    addItems: function(nextPageItems) {

      //HAS FINISHED LOADING PAGES
      this.setLoading(false);
      // this.isLoadingNextPage = false;

      if (nextPageItems.length == 0) {
      
        this.hasMoreMessages = false;

      } else {

        var that = this;

        _.each(nextPageItems, function(message){ 
          that.push('items',message);
        });

      }

    },

    ready: function() {

      // document.addEventListener('evt-toolbar-refresh', function(e) {
      //   this._onToolbarRefresh();
      // }.bind(this));

      // Polymer.dom(this.$.scrollList).setAttribute('style', 'height: ' + (document.body.clientHeight) + 'px;');

      this.items = [];

      //this.loadPage();

    },

    _mailMove: function(e) {
      this.$.dialogMoveMessages.open();
    },

    _mailDelete : function(e) {
      this.deleteSelectedMails();
    },

    clickFabMenu: function(e) {
      // e.stopPropagation();
      // var route = e.target.get("currentMenu").get("item.route");

      // if (route == 'mail-create') {
        
      // }

      // if (route == 'mail-delete') {
      //   this.deleteSelectedMails();
      // }

      // if (route == 'mail-move') {
      //   this.$.dialogMoveMessages.open();
      // }

    },

    deleteSelectedMails: function() {
      console.log("deleteSelectedMails");
    },

    attributeChanged: function(name, type) {
      console.log('attribute: '+ name);
      if (name == 'folder-id') {
        this.page = 0;
        this.loadPage();
          
      }

      if (name == 'search') {
        this.page = 0;
        this.loadPage();
      }
      
    },

    

    getMessages: function(pFolderID, pSearch, pPage, appendAtEnd, ignoreCache, doneCallback) {

        var messagesData = new MessagesCollection();
        var foldersCollection = new FoldersCollection();

        var index = 0;

        var that = this;

        foldersCollection.getFolders(pFolderID, pSearch).done(function(foldersData) {

                var currentFolder = foldersData.getFolderByID(that.folderId);
                var parentFolders = foldersData.getSubFoldersFromFolderID(that.folderId);

                that.currentFolder = currentFolder;

                if (currentFolder != undefined) {
                  if (currentFolder.attributes != undefined) {
                    that.pageTitle = currentFolder.attributes.folderName;
                    that.setPageTitle(that.pageTitle);
                  }
                  
                }

                 // console.log("currentfolder");
                 // console.log(currentFolder);
                that.parentFolders = parentFolders;

                if (ignoreCache == true) {
                    messagesData.ignoreCache(true);
                }

                messagesData.getMessagesInFolder(pFolderID, '', pSearch, pPage).done(function(data) {

                        that.collection = data.models;

                        var messages = data.models;

                        var parentFolders = that.parentFolders;

                        var arr_items = [];

                        var currentIndex = 0;

                        if (!appendAtEnd) {

                            _.each(parentFolders, function(folder) {

                                var attrs = {};

                                currentIndex = currentIndex + 1;

                                attrs["index"] = currentIndex + 1;
                                attrs["isFolder"] = true; //FOLDER
                                attrs["folderID"] = folder.get("folderID");
                                attrs["folderName"] = folder.get("folderName");
                                attrs["route"] = folder.route();

                                arr_items.push(attrs);

                            });

                        }

                        _.each(messages, function(message) {

                            var attrs = {};

                            currentIndex = currentIndex + 1;

                            attrs["index"] = (((pPage - 1) * Shared.settings.resultsPerPage) + parentFolders.length) + currentIndex;
                            attrs["isFolder"] = false; //MESSAGE
                            attrs["subject"] = message.get("msgSubject");
                            attrs["from"] = message.get("msgFrom").fullName;
                            attrs["fromemail"] = message.get("msgFrom").mailAddress;
                            attrs["date"] = message.getTimeAgo();
                            attrs["bodyresume"] = message.get("msgBodyResume");
                            attrs["msgID"] = message.get("msgID");
                            attrs["folderID"] = message.get("folderID");
                            attrs["route"] = message.route();

                            if (message.get("msgHasAttachments") == "1") {
                                attrs["hasAttachments"] = true;
                            } else {
                                attrs["hasAttachments"] = false;
                            }

                            if (message.get("msgFlagged") == "1") {
                                attrs["starred"] = true;
                            } else {
                                attrs["starred"] = false;
                            }

                            if (message.get("msgSeen") == "0") {
                                attrs["unread"] = true;
                            } else {
                                attrs["unread"] = false;
                            }

                            arr_items.push(attrs);

                        });

                        if (doneCallback) {
                            doneCallback(arr_items,appendAtEnd);
                        }

                    })
                    .fail(function(result) {

                        Shared.handleErrors(result.error);

                        $(that.elementID).empty();


                        return false;
                    })
                    .execute();

            })
            .fail(function(result) {

                Shared.handleErrors(result.error);

                $(that.elementID).empty();

                return false;
            })
            .execute();

    },

    openMessage: function(event) {

      var messageView = event.currentTarget;
      var msgid = messageView.get("msgid");
      var folderid = messageView.get("folderid");
      var route = messageView.get("route");

      this.currentMessage = {"msgid": msgid, "folderid": folderid, "route": route };
      page(route);

      //this.$.mailDetail.loadMessage();

      //this.selectedPage = 1;

    },

    _openFolder: function(event) {

      var folderView = event.currentTarget;

      var folderId = folderView.get("folderId");

      this.currentFolder = {"folderId": folderId};


      // var messagesView = event.currentTarget;

      console.log("_openFolder");
      // console.log(messagesView.currentFolder);

      var folder = new FoldersModel({
          'folderId': folderId
      });

      folder.set('folderID', folderId);

      // console.log(folder.route());

      Shared.router.navigate(folder.route(), {
          trigger: true
      });

      // this.fire('evt-open-folder', {folder: this});

    },

    _onThreadSelectorChange: function(event) {
      console.log("_onThreadSelectorChange");
      //console.log(event);
      // console.log(event.detail.get('items'));

      for (var thread in this.selectedMessages) {
        //console.log(this.selectedMessages[thread].get('msgid'));
        // console.log("obj." + thread.get('msgid') + " = " + thread.get('folderid'));
      }

      this.fire('evt-select-messages', {thread: this});
    },

    

    _onThreadSelectChange: function(event) {

      var message = {};

      for (var thread in this.tempMessages) {

        msgID = this.tempMessages[thread].get('msgid');
        folderID = this.tempMessages[thread].get('folderid');
        message = { msgid: msgID, folderid: folderID, selected: true };
      }

      var found = false;
      var newArr = [];
      for (var thread in this.selectedMessages) {
        if (thread.msgid == message.msgid) {
          found = true;
        } else {
          newArr.push(thread);
        }
      }

      if (!found) {
        this.selectedMessages.push(message);
      } else {
        this.selectedMessages = newArr;
      }

      console.log(this.selectedMessages);

      // this.fire('evt-select-messages', {thread: this});

      this.fire('evt-selector-messages', {thread: message});
    },

    getSelectedMessages: function() {

      return this.selectedMessages;
      // var arrMessages = [];
      //  for (var thread in this.selectedMessages) {
      //   arrMessages.push({msgid: this.selectedMessages[thread].get('msgid'), folderid: this.selectedMessages[thread].get('folderid')});
      // }
      // return arrMessages;
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

    _computeShowMoreMessagesStyle: function(hasMoreMessages) {
      if (!hasMoreMessages) {
        return '';
      } else {
        return 'display: none;';
      }
      
    },

    _computeShowLoadingNextPageStyle: function(isLoadingNextPage) {
      if (isLoadingNextPage) {
        return '';
      } else {
        return 'display: none;';
      }
      
    },

    _showSelectionChanged: function() {
      // if (!this.isLoading) {
        this.$.selectedItemsList.fire('resize');
        this.refreshMenuItems();
      // }
    },

    _decodeHTMLEntities: function(val) {
      var t = document.createElement('textarea');
      t.innerHTML = val;
      return t.textContent;
    },

    resize: function() {
       // Polymer.dom(this.$.scrollList).setAttribute('style', 'height: ' + (document.body.clientHeight - 500) + 'px;');
    },

    properties: {
      items: {
        type: Array, 
        value: [],
        reflectAttribute: true
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
      selectedPage: {
        type: Number,
        value: 0
      },

      hostElementID: {
        type: String,
        value: 'content_HostID',
        reflectAttribute: true,
      },
      
      tempMessages: {
        type: Array, 
        reflectAttribute: true,
        value: []
      },
      selectedMessages: {
        type: Array, 
        reflectAttribute: true,
        value: []
      },
      currentMessage: {
        type: Array,
        value: [],
        reflectAttribute: true,
        notify: true,
      },
      currentFolder: {
        type: Array,
        value: []
      },
      folderId: {
        type: String,
        value: 'INBOX',
        notify: true, 
        reflectAttribute: true,
      },
      search: {
        type: String,
        value: '',
        notify: true, 
        reflectAttribute: true,
      },
      page: {
        type: Number,
        value: 0,
        notify: true, 
        reflectAttribute: true,
      },
      hasMoreMessages: {
        type: Number,
        value: true,
        reflectAttribute: true,
      },
    }

    
  });