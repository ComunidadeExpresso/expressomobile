define([
  'jquery',
  'underscore',
  'backbone',
  'shared',
  'text!templates/home/loadingTemplate.html',
  'material'
], function($, _, Backbone, Shared, loadingTemplate, Material){

  var LoadingView = Backbone.View.extend({

    el: $("#content"),

    render: function(){

      if (Shared.menuView) {
        //if (Shared.newMessageIntent != true) {
          Shared.menuView.renderContextMenu(0,[]); 
        //}
      }


      var compiledTemplate = _.template( loadingTemplate);
      this.$el.html( compiledTemplate ); 

      window.componentHandler.upgradeDom();

    },

    loaded: function () 
    {


    }
  });

  return LoadingView;
  
});