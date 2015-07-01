define([
  'underscore',
  'backbone',
  'shared',
  'libs/backbone/localstorage', 
  'models/home/PopupModel'
], function(_, Backbone, Shared, Store, Popup) {

	var PopupList = Backbone.Collection.extend({
		model: Popup,
		localStorage: new Store("Popups"),
		url: '/'
	});

	return PopupList;
  
});


