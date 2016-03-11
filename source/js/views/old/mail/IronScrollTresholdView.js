import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';
import Material from 'material';

var IronScrollTresholdView = Backbone.View.extend({

    tagName: 'iron-scroll-threshold',

    containerID: "#iron-scroll-threshold-loader",

    scrollTarget: $("#scrollerList"),

    lowerTriggered: true,
    lowerThreshold: 400,

    refreshFunction: function() {},

    initialize: function(data) {},

    resize: function() {
        this.el.resize();
    },

    render: function() {

        // this.el.innerHTML = '<iron-scroll-threshold id="threshold" lowerThreshold="500" lowerTriggered="true"></iron-scroll-threshold>';

        $(this.containerID).empty().append(this.el);

    }

});

export default IronScrollTresholdView;