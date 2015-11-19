define([
  'jquery',
  'underscore',
  'backbone',
  'shared',
  'text!templates/mail/messagesListItemsTemplate.html',
  'collections/mail/MessagesCollection',
  'material',
  'views/mail/MessagesListItemView'
], function($, _, Backbone, Shared, messagesListItemsTemplate,MessagesCollection,Material,MessagesListItemView){

  var MessagesListItemsView = Backbone.View.extend({

    tagName: 'mail-messages',
    _shadow: null,

    currentPageTitle: '',

    messageView: null,

    parentFolders : [],
    msgIDSelected: "",

    items: [],

    initialize: function(data) {
      this.attributes = data.attributes;

    },

    resize: function() {
      this.el.resize();
    },

    render: function(nextPage,nextPageItems){

      if (nextPage) {

        var scope = this.el;

        _.each(nextPageItems, function(message){ 

          scope.push('items',message);

        });
       

      } else {
        $("#messagesList").empty().append( this.el );
      }


    },

    events: {
      'evt-open-message' : "_openMessage",
      'evt-starred-message': "_starredMessage",
      'evt-select-messages': "_selectedMessages",
    },

    _selectedMessages: function(event) {
      var messagesView = event.currentTarget;

      this.messageView = messagesView;

      Shared.messagesView = messagesView;

      var that = this;

      var backButtonFunction = function() {
        // DESELECT ALL MAIL-THREADS

        Shared.menuView.enableBackButton(false);
        // Shared.messagesView.selectedMessages = [];
        // var messages = Shared.messagesView.getSelectedMessages();
        $("#currentPageTitle").html(that.currentPageTitle);
        $("#mainHeader").removeClass("selected-threads");

        jQuery.each( $("mail-thread"), function( i, message ) {
          if (message.selected) {
            message.selected = false;
            message.fire('thread-select', {thread: message});
          }
        });

      };

      Shared.backButtonClicked = backButtonFunction;

      var qtdMessagesSelected = Shared.messagesView.selectedMessages.length;
      var messages = Shared.messagesView.getSelectedMessages();

      if (qtdMessagesSelected != 0) {
        Shared.menuView.enableBackButton(true);
        if (this.currentPageTitle == '') {
          this.currentPageTitle = $("#currentPageTitle").html();
        }
        $("#currentPageTitle").html(qtdMessagesSelected);
        $("#mainHeader").addClass("selected-threads");
      } else {
        Shared.menuView.enableBackButton(false);
        $("#currentPageTitle").html(this.currentPageTitle);
        $("#mainHeader").removeClass("selected-threads");
      }
      
    },

    _starredMessage: function(event) {
      
      var messagesView = event.currentTarget;
      var currentMessage = messagesView.currentMessage;
      var flagType = 2;
      if (currentMessage.starred) {
        flagType = 1;
      }
      console.log("_starredMessage");
      console.log(currentMessage);

      var callbackSuccess = function(result) {

        Shared.showMessage({
          type: "success",
          icon: 'icon-expresso',
          title: "Mensagem marcada como importante!",
          description: "",
          timeout: 3000,
          elementID: "#pageMessage",
        });

      };

      var callbackFail = function(error) {

        Shared.showMessage({
          type: "error",
          icon: 'icon-expresso',
          title: "Não foi possível marcar mensagem.",
          description: "",
          timeout: 3000,
          elementID: "#pageMessage",
        });
        
      };

      var collection = new MessagesCollection();
      collection.flagMessage(currentMessage.folderid,currentMessage.msgid, flagType,callbackSuccess,callbackFail);
    },

    _openMessage: function(event) {

      Shared.menuView.enableBackButton(false);
      $("#currentPageTitle").html(this.currentPageTitle);
      $("#mainHeader").removeClass("selected-threads");

      var messagesView = event.currentTarget;

      console.log("_openMessage");
      console.log(messagesView.currentMessage);

      Shared.router.navigate(messagesView.currentMessage.route,{trigger: true});
      
    },

   

  });

  return MessagesListItemsView;
  
});
