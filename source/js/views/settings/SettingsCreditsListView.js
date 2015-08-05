define([
  'jquery',
  'underscore',
  'backbone',
  'shared',
  'text!templates/settings/settingsCreditsListTemplate.html'
], function($, _, Backbone, Shared, settingsCreditsListTemplate){

  var SettingsCreditsListView = Backbone.View.extend({

    el: $("#content"),

    render: function(){

      var newData = {
        _: _ 
      };

      var compiledTemplate = _.template( settingsCreditsListTemplate, newData );
      this.$el.html( compiledTemplate ); 

      Shared.setCurrentPageTitle("Créditos");

      this.loaded();

    },

    loaded: function () 
    {

      var that = this;
      Shared.scrollDetail = new iScroll('wrapperDetail');

    }
  });

  return SettingsCreditsListView;
  
});
