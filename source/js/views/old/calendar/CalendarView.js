import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';


var CalendarView = Backbone.View.extend({

    tagName: 'events-list',

    _shadow: null,

    initialize: function(data) {

        console.log(data.attributes);
        
        if (data) {
            this.attributes = data.attributes;
        }

    },

    events: {

    },

    resize: function() {
        this.el.resize();
    },

    render: function() {
        $(this.attributes.elementID).empty().append(this.el);
    },


});

export default CalendarView;
