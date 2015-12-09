import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';
import loadingTemplate from 'loadingTemplate';
import Material from 'material';

var LoadingView = Backbone.View.extend({

    el: $("#content"),

    render: function() {

        if (Shared.menuView) {
            //if (Shared.newMessageIntent != true) {
            Shared.menuView.renderContextMenu(0, []);
            //}
        }


        var compiledTemplate = _.template(loadingTemplate);
        this.$el.html(compiledTemplate);

        window.componentHandler.upgradeDom();

    },

    loaded: function() {


    }
});

export default LoadingView;