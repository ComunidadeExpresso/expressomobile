import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';
import Material from 'material';

var PullToActionView = Backbone.View.extend({

    //tagName: 'pull-to-action',

    _shadow: null,

    container: '#pageContent',

    refreshFunction: function() {},

    initialize: function(data) {

        if (data.refreshAction != undefined) {
            this.refreshFunction = data.refreshAction;
        }

        if (data.container != undefined) {
            this.container = data.container;
        }

    },

    events: {
        'refresh': "_refresh",
        'lower-trigger': '_loadNextPage',
    },

    resize: function() {
        this.el.resize();
    },

    _refresh: function() {
        this.refreshFunction();
    },

    _loadNextPage: function() {
        console.log("_loadNextPage");
    },

    render: function() {

        this.el.innerHTML = '<pull-to-action action="attribute.fire(\'refresh\',{})" color="blue" container="' + this.container + '"></pull-to-action>';

        $(this.container).empty().append(this.el);

    }

});

export default PullToActionView;