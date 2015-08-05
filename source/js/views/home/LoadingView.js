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

      var newData = {
        _: _ 
      };

      var compiledTemplate = _.template( loadingTemplate, newData );
      this.$el.html( compiledTemplate ); 

      Material.upgradeDom();

    },

    loaded: function () 
    {


    }
  });

  return LoadingView;
  
});