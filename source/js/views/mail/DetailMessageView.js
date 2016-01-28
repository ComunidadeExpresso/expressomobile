import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';
import MessagesCollection from 'MessagesCollection';
import detailMessageTemplate from 'detailMessageTemplate';
import ContextMenuCollection from 'ContextMenuCollection';
import PreviewAttachmentMessageView from 'PreviewAttachmentMessageView';

var DetailMessageView = Backbone.View.extend({

    collection: null,

    message: null,

    //TAB INDEX
    elementIndex: 0,

    tagName: 'mail-detail',

    _shadow: null,

    initialize: function(data) {
        
        this.attributes = data.attributes;

        this.el["msg"]    = data.attributes["msg"];
        this.el["folder"] = data.attributes["folder"];
        this.el["subject"] = data.attributes["subject"];

    },

    events: {
        'click .attachmentLink': 'openAttachment',
    },

    resize: function() {
        this.el.resize();
    },

    render: function() {

        var tabTitle    = decodeURIComponent(this.el["subject"]);
        var folderID    = this.el["folder"];
        var msgID       = this.el["msg"];

        var that        = this;

        var doneAddTab = function(elementIndex, elementID) {

            $(elementID).empty().append(that.el);

            // that.renderAttachments(this.message);

            var folderType = 5;
            if (Shared.folders != undefined) {
                var currentFolder = Shared.folders.getFolderByID(folderID);

                if (currentFolder.get != undefined) {
                    folderType = currentFolder.get("folderType");
                }
            }

            Shared.menuView.renderContextMenu('detailMessage', {
                folderID: folderID,
                msgID: msgID,
                folderType: folderType,
                qtdMessages: 1,
                tabIndex: elementIndex
            });

        }

        Shared.homeView.addTab(tabTitle,doneAddTab);

    },

    openAttachment: function(e) {
        e.preventDefault();
        Shared.router.navigate(e.currentTarget.getAttribute("href"), {
            trigger: true
        });
    },

});

export default DetailMessageView;
