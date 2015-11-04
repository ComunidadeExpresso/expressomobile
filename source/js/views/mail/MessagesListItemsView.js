define([
  'jquery',
  'underscore',
  'backbone',
  'shared',
  'text!templates/mail/messagesListItemsTemplate.html',
  'material',
  'views/mail/MessagesListItemView'
], function($, _, Backbone, Shared, messagesListItemsTemplate,Material,MessagesListItemView){

  var MessagesListItemsView = Backbone.View.extend({

    parentFolders : [],
    msgIDSelected: "",

    render: function(nextPage){


      var messages = this.collection.models;

      _.each(messages, function(message){ 

          var attrs = {};

          attrs["subject"]    = message.get("msgSubject");
          attrs["from"]       = message.get("msgFrom").fullName;
          //attrs["unread"]     = null;
          //attrs["narrow"]     = true;
          attrs["date"]       = message.getTimeAgo();
          attrs["bodyresume"] = message.get("msgBodyResume");
          attrs["msg-id"]     = message.get("msgID");
          attrs["folder-id"]  = message.get("folderID");
          attrs["route"]      = message.route();
          //attrs["starred"]    = null;

          if (message.get("msgFlagged") == "1") {
             attrs["starred"] = true;
          }

          if (message.get("msgSeen") == "0") {
             attrs["unread"] = true;
          }

          var mailThread = new MessagesListItemView({ collection: message, attributes: attrs });
          mailThread.render();
          
      });


      

       // var page = 1;

       //  console.log("LOADING");
       //  $(window).scroll(function () {

       //    console.log("SCROLL");
       //      $('#more').hide();
       //      $('#no-more').hide();

       //      if($(window).scrollTop() + $(window).height() > $(document).height() - 200) {
       //          $('#more').css("top","400");
       //          $('#more').show();
       //      }
       //      if($(window).scrollTop() + $(window).height() == $(document).height()) {

       //          $('#more').hide();
       //          $('#no-more').hide();

       //          page++;

       //          var data = {
       //              page_num: page
       //          };

       //          var actual_count = "102";

       //          if((page-1)* 12 > actual_count){
       //              $('#no-more').css("top","400");
       //              $('#no-more').show();
       //          }else{

       //            $("#scrollerList").append("CARREGOU PROXIMA PAGINA");

       //          }

       //      }


       //  });

      // var that = this;

      // var data = {
      //   parentFolders: this.parentFolders,
      //   messages: this.collection.models,
      //   msgIDSelected : this.msgIDSelected,
      //   _: _ ,
      //   Shared: Shared
      // };

      // var compiledTemplate = _.template( messagesListItemsTemplate, data );
      // if (nextPage) {
      //   $("#scrollerList").append( compiledTemplate );
      // } else {
      //   $("#scrollerList").html( compiledTemplate );
      // }

      // window.componentHandler.upgradeDom();

    },

    events: {
    //  "click a.messagelistItemLink": "selectListItem"
    },

   

  });

  return MessagesListItemsView;
  
});
