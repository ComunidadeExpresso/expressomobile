define([
  'jquery',
  'underscore',
  'backbone',
  'shared',
  'templates/settings/settingsAboutListTemplate.html!text'
], function($, _, Backbone, Shared, settingsAboutListTemplate){

  var SettingsAboutListView = Backbone.View.extend({

    el: $("#content"),

    render: function(){

      var that = this;

      Shared.api.resource('/ExpressoVersion').params({}).done(function(result){

        var newData = {
          expressoVersion: result.expressoVersion,
          apiVersion: result.apiVersion,
          appVersion: Shared.appVersion,
          _: _ 
        };

        var htmlTemplate = _.template(settingsAboutListTemplate);
        var compiledTemplate = htmlTemplate(newData);

        that.$el.html( compiledTemplate ); 

        //Shared.setCurrentPageTitle("Sobre o Expresso");

      }).execute();
      
    } 

  });

  return SettingsAboutListView;
  
});
