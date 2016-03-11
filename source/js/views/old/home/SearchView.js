import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';
import Material from 'material';

var SearchView = Backbone.View.extend({

    tagName: 'material-search',

    initialize: function() {
        //this.el.createShadowRoot();

        if ((Shared.previousSearches == undefined) || (Shared.previousSearches == null)) {
            Shared.previousSearches = [];
        }

    },

    attributes: {
        "active": true,
        "narrow": true,
        "loading": false,
        "search-value": "",
    },

    events: {
        'search-change': "_doSearch",
    },

    resize: function() {
        this.el.resize();
    },

    _doSearch: function(event) {

     /*   var searchView = event.currentTarget;

        var searchValue = searchView.get("searchValue");
        console.log("search-changed:" + searchValue);

        //searchView.set("loading",true);
        //console.log(searchView.get("previousSearches"));

        Shared.previousSearches.push(searchValue);

        var searches = Shared.previousSearches;

        console.log(searches);

        searchView.set("previousSearches", searches);

        console.log(event.currentTarget); */

    },

    render: function() {

        //this.$el.set("previousSearches",Shared.previousSearches);
        $("#mainAppPageContent").prepend(this.$el);

    }

});

export default SearchView;