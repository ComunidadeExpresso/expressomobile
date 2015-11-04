define([
  'underscore', 
  'backbone', 
  'localstorage', 
  'models/home/ExpressoModel',
  ], function(_, Backbone, Store, ExpressoModel){
	  
	var ExpressoCollection = Backbone.Collection.extend({

    model: ExpressoModel,

    browserStorage: new Backbone.BrowserStorage.session("Expresso"),

    // localStorage: new Backbone.BrowserStorage("Expresso"),

  });
  return new ExpressoCollection;
});
