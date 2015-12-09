import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';
import offlineTemplate from 'offlineTemplate';

var OfflineView = Backbone.View.extend({

    el: $("#mainAppPageContent"),

    render: function() {

        var compiledTemplate = _.template(offlineTemplate);
        this.$el.html(compiledTemplate);

    },

});

export default OfflineView;