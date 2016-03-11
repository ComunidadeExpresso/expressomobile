import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';
import settingsFaqListTemplate from 'settingsFaqListTemplate';

var SettingsFaqListView = Backbone.View.extend({

    elementID: "#content",

    render: function() {

        var that = this;

        var newData = {
            _: _,
            elementID: this.elementID,
            Shared: Shared
        };

        var htmlTemplate = _.template(settingsFaqListTemplate);
        var compiledTemplate = htmlTemplate(newData);

        this.$el.html(compiledTemplate);
        this.$el.css("width", "100%");
        this.$el.css("height", "100%");
        $(this.elementID).empty().append(this.$el);

        //Shared.setCurrentPageTitle("Perguntas Frequentes");

    },


    events: {
        'click #btn-back': 'backButton',
    },

    backButton: function(e) {
        if (e != undefined) {
            e.preventDefault();
        }
        Shared.router.navigate("/", {
            trigger: true
        });
    },

});

export default SettingsFaqListView;
