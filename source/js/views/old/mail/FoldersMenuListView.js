import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';
import FoldersCollection from 'FoldersCollection';
import foldersMenuListTemplate from 'foldersMenuListTemplate';
import LoadingView from 'LoadingView';

var FoldersMenuListView = Backbone.View.extend({

    folderID: "INBOX",
    search: "",

    render: function() {

        this.getFolders(this.folderID, this.search);

    },

    events: {
        "click .listFolderMenuItemLink": "selectFolderMenuItem",
    },

    selectFolderMenuItem: function(e) {
        e.preventDefault();

        $('#myFolders li').each(function() {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
        });

        var parent = $(e.target).parent();

        if (parent.hasClass("listFolderMenuItemLink")) {
            parent = parent.parent();
        }

        parent.addClass("selected");

        Shared.router.navigate(e.currentTarget.getAttribute("href"), {
            trigger: true
        });
    },

    getFolders: function(folderIDValue, searchValue) {

        var that = this;
        var collection = new FoldersCollection();

        collection
            .getFolders(folderIDValue, searchValue)
            .done(function(data) {

                that.collection = data.models;

                var data = {
                    folders: data.models,
                    _: _
                }

                var htmlTemplate = _.template(foldersMenuListTemplate);
                var htmlWithData = htmlTemplate(data);


                that.$el.html(htmlWithData);
                $("#myFolders").empty().append(that.$el);


                Shared.menuView.setQuota(data.diskSizeUsed, data.diskSizeLimit);

                /*
                if (doneCallBack) {
                  doneCallback();
                } 
                */
                Shared.scrollerRefresh();

            })
            .fail(function(error) {
                Shared.handleErrors(error);
            })
            .execute();
    }

});

export default FoldersMenuListView;
