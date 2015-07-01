define([
  'underscore',
  'backbone',
  'shared'
], function(_, Backbone, Shared) {

	var Popup = Backbone.Model.extend({
		defaults: {
			handle:''
		}
	});

 	return Popup;
  
});
