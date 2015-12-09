import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';
import LoadingView from 'LoadingView';
import HomeView from 'HomeView';
import detailContentTemplate from 'detailContentTemplate';
import primaryContentTemplate from 'primaryContentTemplate';
import ContactModel from 'ContactModel';
import DetailsContactCollection from 'DetailsContactCollection';
import ContextMenuCollection from 'ContextMenuCollection';
var DeleteContactView = Backbone.View.extend({
    contactID: null,

    render: function(data) {
        var self = this;
        var contentTitle;
        var container;
        var messageContainer;

        if (!Shared.isSmartPhoneResolution()) {
            this.$el.html(_.template(detailContentTemplate));
            $('#contentDetail').empty().append(this.$el);

            contentTitle = $('#contentDetailTitle');
            container = $('#scrollerDetail');
            messageContainer = '#messageDetail';
        } else {
            this.$el.html(_.template(primaryContentTemplate));
            $('#content').empty().append(this.$el);

            contentTitle = $('#contentTitle');
            container = $('#scroller');
            messageContainer = '#message';
        }

        var loadingView = new LoadingView({
            el: container
        });
        loadingView.render();

        var doneDelete = function(data) {

            if (data.contact != undefined && Boolean(data.contact.status) == true) {
                Shared.router.navigate('/Contacts/Personal/OK', {
                    trigger: true
                });
            } else if (data.error != undefined) {
                Shared.router.navigate('/Contacts/Personal/' + self.contactID + '/' + data.error.code, {
                    trigger: true
                });
            }
        }

        this.deleteContact(this.contactID, doneDelete, doneDelete);
    },

    initialize: function() {},

    loaded: function(pEmail, pContactID) {

        Shared.menuView.renderContextMenu('detailsContact', {
            email: pEmail,
            contactID: pContactID
        });
    },

    deleteContact: function(pContactID, callbackSucess, callbackFail) {
        var contactModel = new ContactModel();
        contactModel.deleteContact({
                contactID: pContactID
            })
            .done(function(data) {
                var newData = {
                    contact: data,
                    _: _
                };

                if (callbackSucess)
                    callbackSucess(newData);
            })
            .fail(function(error) {
                if (callbackFail)
                    callbackFail(error);
            });
    }
});

export default DeleteContactView;