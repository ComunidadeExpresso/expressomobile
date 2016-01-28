import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';
import ContextMenuCollection from 'ContextMenuCollection';


var ContextMenuView = Backbone.View.extend({

    tagName: 'menu-fab',

    collection: null,

    primaryAction: '',
    callBack: '',
    parentCallBack: '',

    initialize: function(data) {
        if (data != undefined) {
            this.attributes = data.attributes;
        }
    },

    resize: function() {
        this.el.resize();
    },

    events: {
        "evt-click-menu-fab-item" : "clickMenuFabItem",
    },

    clickMenuFabItem: function(e,detail) {
        
        var route = e.currentTarget.get("currentMenu").get("item.route");
        var id = e.currentTarget.get("currentMenu").get("item.id");

        if (route != '#') {
            Shared.router.navigate(route, { trigger: true });
        } else {

            var context = this.collection.getActionById(id);

            this.callBack = context.get("callBack");
            this.parentCallBack = context.get("parentCallBack");

            this.callBack(this.parentCallBack);
        }

    },

    render: function(elementID) {

        if (this.collection == null) {
            this.collection = new ContextMenuCollection();
        }

        $(elementID).empty().append(this.el);

    },


});

export default ContextMenuView;