import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';
import settingsAboutListTemplate from 'settingsAboutListTemplate';

var SettingsAboutListView = Backbone.View.extend({

    el: $("#content"),

    render: function() {

        var that = this;

        Shared.api.resource('/ExpressoVersion').params({}).done(function(result) {

            var newData = {
                expressoVersion: result.expressoVersion,
                apiVersion: result.apiVersion,
                appVersion: Shared.appVersion,
                _: _
            };

            var htmlTemplate = _.template(settingsAboutListTemplate);
            var compiledTemplate = htmlTemplate(newData);

            that.$el.html(compiledTemplate);

            //Shared.setCurrentPageTitle("Sobre o Expresso");

        }).execute();

    }

});

export default SettingsAboutListView;
