define([
  'jquery',
  'underscore',
  'backbone',
  'shared',
  'text!templates/home/iconTemplate.html'
], function($, _, Backbone, Shared, iconTemplate){

	var Icon = Backbone.View.extend({
		tagName: 'span',
		initialize: function () {
			this.listenTo(this.model, 'destroy', this.remove);
		},
		render: function () {
			var template = _.template(iconTemplate, {title:this.model.get('title')});
			this.$el.html(template);
			return this;
		},
		events: {
			'click': 'focus'
		},
		focus: function (event) {
			event.preventDefault();
			this.model.get('handle').dialog('moveToTop');
		}
	});


  return Icon;
  
});