import _ from 'underscore';
import Backbone from 'backbone';
import Store from 'localstorage';
import ExpressoModel from 'ExpressoModel';

var ExpressoCollection = Backbone.Collection.extend({

    model: ExpressoModel,

    browserStorage: new Backbone.BrowserStorage.session("Expresso"),

    // localStorage: new Backbone.BrowserStorage("Expresso"),

});
export default new ExpressoCollection;
