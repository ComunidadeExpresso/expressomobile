define([
  'jquery',
  'underscore',
  'backbone',
  'shared',
  'templates/settings/settingsCreditsListTemplate.html!text'
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
