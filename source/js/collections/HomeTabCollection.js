import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';
import HomeTabModel from 'HomeTabModel';

var HomeTabCollection = Backbone.Collection.extend({

    model: HomeTabModel,

    initialize: function(models, options) {
        this.api = Shared.api;
        this.model = HomeTabModel;

    },

    createModelsFromArray: function(arrJson) {
        for (var i in arrJson) {
            var currentModel = new HomeTabModel(arrJson[i]);
            this.add(currentModel);
        }
    },

    addTab: function(params) {
        var currentModel = new HomeTabModel(params);
        this.add(currentModel);
    },
    

});

export default HomeTabCollection;