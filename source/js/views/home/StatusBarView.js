define([
  'jquery',
  'underscore',
  'backbone',
  'shared',
  'models/home/PopupModel',
  'views/home/IconView',
  'text!templates/home/barTemplate.html'
], function($, _, Backbone, Shared, Popup, Icon, barTemplate){

	var StatusBar = Backbone.View.extend({
		el: '#status-bar',
		initialize: function () {
			this.listenTo(Shared.Popups, 'add', this.addIcon);
		},
		render: function () {
			var template = _.template(barTemplate);
			this.$el.html(template);
		},
		addIcon: function (popup) {
			var icon = new Icon({model:popup});
			this.$el.append(icon.render().el);
		}
	});

  return StatusBar;
  
});

