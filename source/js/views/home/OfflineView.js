define([
  'jquery',
  'underscore',
  'backbone',
  'shared',
  'templates/home/offlineTemplate.html!text'
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