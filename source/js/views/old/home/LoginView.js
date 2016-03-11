import webcomponents from 'webcomponents';
import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';


var LoginView = Backbone.View.extend({

    tagName: 'expresso-login',
    _shadow: null,

    errors: false,

    render: function() {

        $("#mainAppPageContent").empty().append(this.el);

    },

    events: {

    },


});

export default LoginView;
