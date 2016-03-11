import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';
import settingsCreditsListTemplate from 'settingsCreditsListTemplate';

var SettingsCreditsListView = Backbone.View.extend({

    el: $("#content"),

    render: function() {

        var newData = {
            _: _
        };

        var htmlTemplate = _.template(settingsCreditsListTemplate);
        var compiledTemplate = htmlTemplate(newData);

        this.$el.html(compiledTemplate);

        //Shared.setCurrentPageTitle("Créditos");

    }

});

export default SettingsCreditsListView;
