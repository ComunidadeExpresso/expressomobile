define([
  'jquery',
  'underscore',
  'backbone',
  'shared',
  'text!templates/home/offlineTemplate.html'
], function($, _, Backbone, Shared, offlineTemplate){

  var OfflineView = Backbone.View.extend({

    el: $("#mainAppPageContent"),

    render: function(){

      var compiledTemplate = _.template( offlineTemplate );
      this.$el.html( compiledTemplate ); 

    },

  });

  return OfflineView;
  
});