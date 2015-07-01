define([
  'jquery',
  'underscore',
  'backbone',
  'shared',
  'moment',
  'text!templates/chat/chatWindowTemplate.html',
  'text!templates/chat/chatWindowMessagesTemplate.html',
  'views/home/LoadingView',
], function($, _, Backbone, Shared, moment, chatWindowTemplate,chatWindowMessagesTemplate,LoadingView){

  var ChatWindowView = Backbone.View.extend({

    el: $("#content"),

    chatID: "",

    currentContact: null,

    render: function(){

      var ThisContact = Shared.im.getContactsByID(this.chatID);

      this.currentContact = ThisContact;

      var that = this;
      var onMessageFunction = function (message) { 
        that.renderMessages();
        Shared.menuView.setChatBadge(Shared.im.qtdUnreadMessages());
      };

      var onComposingFunction = function (message) { 

        if (message.from == that.currentContact.jid) {
          var composingText = "";
          if (message.state == "composing") {
            composingText = " (está escrevendo...)";
          } 
          if ($.trim(ThisContact.name) != "") {
            $("#chatUserName").html(ThisContact.name + composingText);
          } else {
            $("#chatUserName").html(ThisContact.jid + composingText);
          }     
        }
      };


      Shared.im.addOnMessageListener(onMessageFunction);
      Shared.im.addOnComposingListener(onComposingFunction);
      Shared.im.addOnErrorListener(Shared.onIMErrorFunction);
      Shared.im.addOnDisconnectListener(Shared.onIMDisconnectFunction);

      Shared.menuView.setChatBadge(Shared.im.qtdUnreadMessages());

      var data = {
        chatID: this.chatID,
        contact: ThisContact,
        _: _,
        Shared: Shared
      };

      var compiledTemplate = _.template( chatWindowTemplate, data );
      // if (Shared.isDesktop()) {
      //   // var div = $("")
      //   $("#mainAppPageContent").append(compiledTemplate);
      //   //this.$el.append( compiledTemplate );
      // } else {
        this.$el.html( compiledTemplate );
      // }

      this.renderMessages();

      this.loaded();
      
      var top = $('.topHeader').outerHeight(true);
      var chat = $('.chatArea').outerHeight(true) == null ? 0 : $('.chatArea').outerHeight(true);
      
      $('body').height($(window).height() - top);
      $('#wrapperDetail').css('top', top + chat);

      this.scrollToLastMessage();

      Shared.setCurrentView(2,this);

    },

    events: {
      "keydown #msgToSend": "sendMessage",
      "click .icon_close": "closeChatWindow",
      "click .panel-heading span.icon_minim" : "minimChatWindow",
    },

    closeChatWindow: function(e) {
      if (e != undefined) {
        e.preventDefault();
      }
      $( "#chat_window_content_" + this.chatID ).remove();
    },

    minimChatWindow: function(e) {
      if (e != undefined) {
        e.preventDefault();
      }
      console.log("minimChatWindow");
      var $this = $('#minim_chat_window_' + this.chatID);
      console.log($this);
      // var $this = $( "#chat_window_content_" + this.chatID );
      if (!$this.hasClass('panel-collapsed')) {
          $this.parents('.panel').find('.panel-body').hide();
          $this.addClass('panel-collapsed');
          $this.removeClass('glyphicon-minus').addClass('glyphicon-plus');
          $('#panel_footer_' + this.chatID).hide();
      } else {
          $this.parents('.panel').find('.panel-body').show();
          $this.removeClass('panel-collapsed');
          $this.removeClass('glyphicon-plus').addClass('glyphicon-minus');
          $('#panel_footer_' + this.chatID).show();
      }
    },

    sendMessage: function (e) {
      if(e.which == 13 && !e.shiftKey){
        Shared.im.sendMessage(this.currentContact.jid,$('#msgToSend').val());
        $('#msgToSend').val("");
        $('#msgToSend').blur();
        $('#msgToSend').focus();
      }
    },

    renderMessages: function() {

      var allMessages = Shared.im.getMessagesFromID(this.chatID);

      var ThisContact = Shared.im.getContactsByID(this.chatID);

      var data = {
        Shared: Shared,
        messages: allMessages,
        chatID: this.chatID,
        contact: ThisContact,
        moment: moment,
        _: _,
        $ : $
      };

      var elementID = "#scrollerDetail";

      if (Shared.isDesktop()) {
        elementID = "#msgs_content_" + this.chatID;
      }

      var compiledMessagesTemplate = _.template( chatWindowMessagesTemplate, data );
      $(elementID).html( compiledMessagesTemplate );

      $('.myPicture').each(function() {
        $(this).css("background-image",$("#userPicture").css("background-image"));
        $(this).css("background-size","46px 61px");
      });

      this.scrollToLastMessage();

    },

    scrollToLastMessage: function() {
      if (Shared.scrollDetail != null) {
        Shared.scrollDetail.refresh();
        Shared.scrollDetail.scrollToElement(document.getElementById("last_message_" + this.chatID),200);
      } else {
        var element = document.getElementById('msgs_content_' + this.chatID);
        var maxScrollPosition = element.scrollHeight - element.clientHeight;
        $("#msgs_content_" + this.chatID).animate({ scrollTop: maxScrollPosition }, 200);
      }
    },

    loaded: function() {
      if (!Shared.isDesktop()) {
        if (Shared.scrollDetail != null) {
          Shared.scrollDetail.destroy();
          Shared.scrollDetail = null;
        }
        if (Shared.scrollDetail == null) {
          Shared.scrollDetail = new iScroll('wrapperDetail');
        }
      }
    }

    

  });

  return ChatWindowView;
  
});
