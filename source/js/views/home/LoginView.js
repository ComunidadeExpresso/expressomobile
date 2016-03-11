import webcomponents from 'webcomponents';
import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';


var LoginView = Backbone.View.extend({

    tagName: 'expresso-login',
    _shadow: null,

    render: function() {
        $("#mainAppPageContent").empty().append(this.el);
    },

});

export default LoginView;
