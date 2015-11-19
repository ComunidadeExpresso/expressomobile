define([
  'jquery',
  'underscore',
  'backbone',
  'shared',
  'material'
], function($, _, Backbone, Shared, Material){

  var IronScrollTresholdView = Backbone.View.extend({

    tagName: 'iron-scroll-threshold',

    containerID: "#iron-scroll-threshold-loader",

    scrollTarget: $("#scrollerList"),

    lowerTriggered: true,
    lowerThreshold: 400,

    refreshFunction: function() {  },

    initialize: function(data) { },

    resize: function() {
      this.el.resize();
    },

    render: function(){

      // this.el.innerHTML = '<iron-scroll-threshold id="threshold" lowerThreshold="500" lowerTriggered="true"></iron-scroll-threshold>';

      $(this.containerID).empty().append( this.el );
      
    }
    
  });

  return IronScrollTresholdView;
  
});