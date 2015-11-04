define([
  'jquery',
  'underscore',
  'backbone',
  'shared',
  'material'
], function($, _, Backbone, Shared, Material){

  document.registerElement('mail-thread2', {   prototype: Object.create(HTMLElement.prototype) });

  var MessageListItemView = Backbone.View.extend({

    tagName: 'mail-thread',

    _shadow: null,

    initialize: function(data) {
      this.attributes = data.attributes;

      this.el["msg-id"] = data.attributes["msg-id"];
      this.el["folder-id"] = data.attributes["folder-id"];
    },

    events: {
      'open-message' : "_openMessage",
      'thread-archive' : "_archiveMessage",
      'thread-unarchive' : "_unarchiveMessage",
      'thread-select' : "_selectMessage",
      'message-starred': "_starredMessage",
    },

    resize: function() {
      this.el.resize();
    },

    _starredMessage: function(event) {
      var messageView = event.currentTarget;
      console.log("starredMessage:" + messageView.get("msg-id") + " in folder:" + messageView.get('folder-id'));
    },

    _selectMessage: function(event) {
      var messageView = event.currentTarget;
      if (messageView.selected == true) {
        console.log("selectMessage:" + messageView.get("msg-id") + " in folder:" + messageView.get('folder-id'));
      } else {
        console.log("unselectMessage:" + messageView.get("msg-id") + " in folder:" + messageView.get('folder-id'));
      }
      
    },

    _openMessage: function(event) {
      
      var messageView = event.currentTarget;

      var route = messageView.get("route");

      Shared.router.navigate(route,{ trigger: true});
    },

    _archiveMessage: function(event) {
      var messageView = event.currentTarget;
      console.log("archiveMessage:" + messageView.get("msg-id") + " in folder:" + messageView.get('folder-id'));
    },

    _unarchiveMessage: function(event) {
      var messageView = event.currentTarget;
      console.log("unarchiveMessage:" + messageView.get("msg-id") + " in folder:" + messageView.get('folder-id'));
    },

    render: function(){

      $("#scrollerList").append( this.el );
      
    }

  });

  return MessageListItemView;
  
});