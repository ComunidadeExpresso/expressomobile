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

      var htmlTemplate = _.template(settingsCreditsListTemplate);
      var compiledTemplate = htmlTemplate(newData);

      this.$el.html( compiledTemplate ); 

      //Shared.setCurrentPageTitle("Créditos");

    }
    
  });

  return SettingsCreditsListView;
  
});
