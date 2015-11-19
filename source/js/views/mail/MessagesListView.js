define([
  'jquery',
  'underscore',
  'backbone',
  'shared',
  'text!templates/mail/messagesListTemplate.html',
  'views/mail/MessagesListItemsView',
  'views/mail/MessagesListItemView',
  'collections/mail/FoldersCollection',
  'collections/mail/MessagesCollection',
  'views/home/LoadingView',
  'views/mail/DetailMessageView',
  'views/mail/PullToActionView',
  'views/mail/IronScrollTresholdView',
  'material',
  'moment',
  'moment_ptBR',
], function($, _, Backbone, Shared, messagesListTemplate, MessagesListItemsView, MessagesListItemView, FoldersCollection, MessagesCollection,LoadingView,DetailMessageView,PullToActionView,IronScrollTresholdView,Material,moment,moment_ptBR){

  var MessagesListView = Backbone.View.extend({

    currentFolder : [],
    parentFolders : [],
    elementID: "#content",
    detailElementID: "#contentDetail",
    folderID: 'INBOX',
    msgID: '',
    forceReload: "0",
    search: '',
    page: 1,
    doneRoute: '',
    enabledDesktopVersion: false,

    messagesListItemsView: null,

    render: function(){

      this.elementID = "#content";

      var that = this;

      var beforeRenderCallback = function(colection) {

        Shared.setCurrentPageTitle(that.currentFolder.get("folderName"));

        var newData = {
          folderID: that.folderID,
          msgID: that.msgID,
          currentFolder: that.currentFolder,
          collection: colection,
          _: _ ,
          Shared: Shared,
          enabledDesktopVersion: that.enabledDesktopVersion
        };

        if (!colection.length) {

          if (Shared.isTabletResolution()) {
            if (Shared.newMessageIntent) {
              Shared.newMessageIntent = false;
              Shared.router.navigate("/Mail/Message/New", {trigger: true});
            } else {
              Shared.router.navigate("/Mail/Messages/0/0/" + that.folderID + "#", {trigger: true});
            }
            
          }

        }

        var htmlTemplate = _.template(messagesListTemplate);
        var htmlWithData = htmlTemplate(newData);

        that.$el.html(htmlWithData);

        $(that.elementID).empty().append(that.$el);


        

        var refreshFunction = function () {
          that.page = 1;
          $("#messagesList").empty();
          that.getMessages(that.folderID,that.search,that.page,false,true);
        };

        var pullToAction = new PullToActionView({ refreshAction: refreshFunction, container: '#pull-to-action-loader' });
        pullToAction.render();

        // var nextPageFunction = function () {
        //   console.log("nextPage");
        // };
        

        // var ironTreshold = new IronScrollTresholdView({ refreshAction: nextPageFunction, container: "#iron-scroll-threshold-loader" });
        // ironTreshold.render();


      }
      

      var doneFunction = function() { 

        if (Shared.newMessageIntent == false) {
          Shared.menuView.renderContextMenu('messageList',{folderID: that.folderID, folderName: that.currentFolder.folderName, folderType: that.currentFolder.get("folderType"), qtdMessages: 0});
        }

        if ( ((Shared.isTabletResolution()) && (that.forceReload == "1")) || ( (!Shared.isTabletResolution()) && (Shared.gotoRoute != false)) ) {

          if (Shared.newMessageIntent == true) {
            Shared.newMessageIntent = false;
            Shared.router.navigate("/Mail/Message/New", {trigger: true});
          } else {

            if (that.msgID != undefined) {

              var detailMessageView = new DetailMessageView();
              detailMessageView.folderID = that.folderID;
              detailMessageView.msgID = that.msgID;

              Shared.menuView.renderContextMenu('messageList',{folderID: that.folderID, folderName: that.currentFolder.folderName, folderType: that.currentFolder.get("folderType"), qtdMessages: 0});

              detailMessageView.render();
            }

          }

        }

        Shared.setDefaultIMListeners();

      };


      //FORCERELOAD IS A PARAMETER THAT FORCES THE PAGE TO BE RELOADED FULLY ON TABLET RESOLUTION OR DEPENDING ON USER INTERACTION WITH THE PAGE.
      //IN SMARTPHONE RESOLUTION THE FORCERELOAD IS USED TO NOT RELOAD ALL THE PAGE AND ONLY LOADS THE NECESSARY AREA OF THE PAGE.
      if (this.forceReload == "1") {

          var loadingView = new LoadingView({ el: $(this.elementID) });
          loadingView.render();

          var loadingView = new LoadingView({ el: $(this.detailElementID) });
          loadingView.render();

          that.getMessages(that.folderID,that.search,that.page,false,false,beforeRenderCallback,doneFunction);

      } else {

        var loadingView = new LoadingView({ el: $(this.detailElementID) });
        loadingView.render();

        var detailMessageView = new DetailMessageView();
        detailMessageView.folderID = that.folderID;
        detailMessageView.msgID = that.msgID;

        detailMessageView.render();

      }

     

    },

    events: {
      "keydown #searchField": "searchMessage",
      "lower-trigger" : "loadNextPage",
    },

    loadNextPage: function (e) {
      // console.log("loadNextPage");
      this.pullUpAction();
    },

    searchMessage: function (e) {
      if(e.which == 13 && !e.shiftKey){
        this.search = $('#searchField').val();

        pullDownEl = document.getElementById('pullDown');
        pullDownEl.className = 'loading';
        pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Carregando...';
        
        this.pullDownAction();
      }
    },

    selectFirstMessage: function() {

      //ROTEIA PARA CARREGAR A PRIMEIRA MENSAGEM DA LISTA.
      var firstMessage = this.collection[0];
      if (firstMessage) {
        $("#" + firstMessage.listItemID()).addClass("selected");
        Shared.router.navigate(firstMessage.route(),{trigger: true});
      }
    },

    getMessages: function(pFolderID,pSearch,pPage,appendAtEnd,ignoreCache,beforeRenderCallback,doneCallback)
    {

      var messagesData = new MessagesCollection();
      var foldersCollection = new FoldersCollection();

      var index = 0;
      
      var that = this;

      foldersCollection.getFolders(this.folderID,this.search).done( function (foldersData) {


        var currentFolder = foldersData.getFolderByID(that.folderID);
        var parentFolders = foldersData.getSubFoldersFromFolderID(that.folderID);

        that.currentFolder = currentFolder;
        that.parentFolders = parentFolders;

        if (ignoreCache == true) {
          messagesData.ignoreCache(true);
        }

            messagesData.getMessagesInFolder(pFolderID,'',pSearch,pPage).done(function(data){

                    if (appendAtEnd == true) {

                    }

                    that.collection = data.models;

                    if (beforeRenderCallback) {
                      beforeRenderCallback(that.collection);
                    }

                    var messages = data.models;

                    var arr_items = [];

                    

                    _.each(messages, function(message){ 

                        var attrs = {};

                        var indexOf = _.indexOf(messages,message);

                        attrs["index"]      = indexOf + 1;
                        attrs["subject"]    = message.get("msgSubject");
                        attrs["from"]       = message.get("msgFrom").fullName;
                        attrs["date"]       = message.getTimeAgo();
                        attrs["bodyresume"] = message.get("msgBodyResume");
                        attrs["msgID"]      = message.get("msgID");
                        attrs["folderID"]   = message.get("folderID");
                        attrs["route"]      = message.route();


                        if (message.get("msgFlagged") == "1") {
                           attrs["starred"] = true;
                        }

                        if (message.get("msgSeen") == "0") {
                           attrs["unread"] = true;
                        }

                        arr_items.push(attrs);

                        //var mailThread = new MessagesListItemView({ collection: message, attributes: attrs });
                        //mailThread.render();
                        
                    });

                    //console.log(arr_items);
                    var attrs = [];
                    attrs["items"] = JSON.stringify(arr_items);

                    // var messagesListItemsView = new MessagesListItemsView({ el: $("#scrollerList"), collection: data , parentFolders: that.parentFolders });
                    
                    if (!appendAtEnd) {
                      that.messagesListItemsView = new MessagesListItemsView({ collection: data , parentFolders: that.parentFolders, attributes: attrs });
                      that.messagesListItemsView.parentFolders = that.parentFolders;
                    } else {
                      that.messagesListItemsView.parentFolders = [];
                    }
                    
                    if ((that.msgID == "") || (that.msgID == "0"))  {
                      if (data.length) {
                        if (Shared.isTabletResolution()) {
                          that.msgID = data.models[0].get("msgID"); 
                        }
                      }
                    }
                    that.messagesListItemsView.msgIDSelected = that.msgID;

                    that.messagesListItemsView.render(appendAtEnd,arr_items);
                    
                    if (doneCallback) {
                      doneCallback();
                    }

                    // var top = $('.topHeader').outerHeight(true);
                    // var search = $('.searchArea').outerHeight(true) == null ? 0 : $('.searchArea').outerHeight(true);
                    
                    // $('body').height($(window).height() - top);
                    // $('#wrapper').css('top', top + search);

                    //Shared.scrollerRefresh();

            })
            .fail(function(result){
              
              Shared.handleErrors(result.error);

              $(that.elementID).empty();

              $(that.detailElementID).empty();
              
              return false;
            })
            .execute();

      })
      .fail(function(result){

        Shared.handleErrors(result.error);

        $(that.elementID).empty();

        $(that.detailElementID).empty();

        return false;
      })
      .execute();

      
    },


    pullDownAction: function () 
    {
      this.page = 1;
      $("#scrollerList").empty();
      getMessages(this.folderID,this.search,this.page,false,true);
    },

    pullUpAction : function() 
    {
      this.page = this.page + 1;
      this.getMessages(this.folderID,this.search,this.page,true,false);
    }
    
  });

  return MessagesListView;
  
});
