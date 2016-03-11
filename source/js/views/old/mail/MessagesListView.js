import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';
import MessagesListItemsView from 'MessagesListItemsView';
import MessagesCollection from 'MessagesCollection';
import DetailMessageView from 'DetailMessageView';

// import messagesListTemplate from 'messagesListTemplate';
// // import MessagesListItemView from 'MessagesListItemView';
// import FoldersCollection from 'FoldersCollection';
// import LoadingView from 'LoadingView';
// import PullToActionView from 'PullToActionView';
// import IronScrollTresholdView from 'IronScrollTresholdView';
// import Material from 'material';


var MessagesListView = Backbone.View.extend({

    currentFolder: [],
    parentFolders: [],
    elementID: "#content",
    elementIndex: 1,
    currentIndex : 0,
    // detailElementID: "#contentDetail",
    folderID: 'INBOX',
    msgID: '',
    forceReload: "0",
    search: '',
    page: 0,
    doneRoute: '',
    enabledDesktopVersion: false,

    messagesListItemsView: null,

    render: function() {

        var data = {} ;

        data.attributes = { 'folder-id': this.folderID, 'search': this.search, 'page': this.page };

        var that = this;

        var doneAddTab = function(elementIndex, elementID) {

            // that.messagesListItemsView = new MessagesListItemsView(data);
            // that.messagesListItemsView.render("#scrollHeaderContent");
        };

        //FORCERELOAD IS A PARAMETER THAT FORCES THE PAGE TO BE RELOADED FULLY ON TABLET RESOLUTION OR DEPENDING ON USER INTERACTION WITH THE PAGE.
        //IN SMARTPHONE RESOLUTION THE FORCERELOAD IS USED TO NOT RELOAD ALL THE PAGE AND ONLY LOADS THE NECESSARY AREA OF THE PAGE.
        if (this.forceReload == "1") {

            // that.messagesListItemsView = new MessagesListItemsView(data);
            // that.messagesListItemsView.render("#scrollHeaderContent");
            // Shared.homeView.addTab(this.folderID,doneAddTab);

        } else {

            that.openMessage(that.folderID,that.msgID);
            
        }



    },

    openMessage: function(PfolderID, PmsgID,PSubject) {

        var messagesData = new MessagesCollection();

        messagesData.getMessagesInFolder(PfolderID, PmsgID, '', 1).done(function(Pdata) {

            var PSubject = ""; 

            PSubject = Pdata.models[0].get("msgSubject");

            var attrs = {
                msg: PmsgID,
                folder: PfolderID,
                subject: PSubject,
            };
            var detailMessageView = new DetailMessageView({"attributes": attrs });
            detailMessageView.render();

        }).execute();


        
    },

    events: {

    },

});

// if (Shared.newMessageIntent == false) {
                //     Shared.menuView.renderContextMenu('messageList', {
                //         tabIndex: that.elementIndex, 
                //         folderID: thot.folderID,
                //         folderName: thot.currentFolder.folderName,
                //         qtdMessages: 0
                //     });
                //     // folderType: that.currentFolder.get("folderType"),
                // }

                // thot.elementIndex = elementIndex;

                // var newData = {
                //     elementIndex: thot.elementIndex
                // };


                // var htmlTemplate = _.template(messagesListTemplate);
                // var htmlWithData = htmlTemplate(newData);

                // thot.$el.html(htmlWithData);

                // $(elementID).empty().append(thot.$el);

                // thot.messagesListItemsView.render(elementIndex,appendAtEnd, arr_items);

                

                // var refreshFunction = function() {

                //     var elementIndex = thot.elementIndex;

                //     thot.page = 1;
                //     $("#messagesList_" + elementIndex).empty();

                //     var doneRefreshCallback = function(arr_items, appendAtEnd) {
                //         thot.messagesListItemsView.render(elementIndex,appendAtEnd, arr_items);
                //     };

                //     thot.getMessages(thot.folderID, thot.search, thot.page, false, true,function(){},doneRefreshCallback);
                // };

                // var pullToAction = new PullToActionView({
                //     refreshAction: refreshFunction,
                //     container: '#pull-to-action-loader-' + thot.elementIndex
                // });
                // pullToAction.render();
                
            //};

export default MessagesListView;
