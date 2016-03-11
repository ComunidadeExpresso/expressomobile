import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';
import settingsListTemplate from 'settingsListTemplate';
import SettingsAboutListView from 'SettingsAboutListView';
import SettingsChangePasswordListView from 'SettingsChangePasswordListView';
import SettingsCreditsListView from 'SettingsCreditsListView';
import SettingsMailSignatureListView from 'SettingsMailSignatureListView';
import SettingsResultsPerPageListView from 'SettingsResultsPerPageListView';
import SettingsSupportListView from 'SettingsSupportListView';
import SettingsFaqListView from 'SettingsFaqListView';
import LoadingView from 'LoadingView';
import Material from 'material';

var SettingsListView = Backbone.View.extend({

    secondViewName: '',

    render: function(elementID) {

        var that = this;

        var primaryElementID = elementID;
        var detailElementID = elementID;

        Shared.menuView.renderContextMenu(0, []);

        // if (Shared.isSmartPhoneResolution()) {
        //     detailElementID = "#content";
        // }

        if (this.secondViewName != null) {

            if ((this.secondViewName != "SaveMailSignature") && (this.secondViewName != "SaveChangePassword")) {

                $(detailElementID).html("");

                var loadingView = new LoadingView({
                    el: $(detailElementID)
                });
                loadingView.render();

            }

            if (this.secondViewName == "Support") {
                var secondView = new SettingsSupportListView({
                    el: $(detailElementID)
                });
            }
            // if (this.secondViewName == "SendSupportFeedback") {
            //    var secondView = new SettingsSupportListView({ el: $(detailElementID) });
            // }
            if (this.secondViewName == "About") {
                var secondView = new SettingsAboutListView({
                    el: $(detailElementID)
                });
            }
            if (this.secondViewName == "FAQ") {
                var secondView = new SettingsFaqListView({});
                secondView.elementID = detailElementID;
            }
            if (this.secondViewName == "Credits") {
                var secondView = new SettingsCreditsListView({
                    el: $(detailElementID)
                });
            }
            if (this.secondViewName == "ChangePassword") {
                var secondView = new SettingsChangePasswordListView({
                    el: $(detailElementID)
                });
            }
            if (this.secondViewName == "ResultsPerPage") {
                var secondView = new SettingsResultsPerPageListView();
                secondView.elementID = detailElementID;
            }
            if (this.secondViewName == "MailSignature") {
                var secondView = new SettingsMailSignatureListView({
                    el: $(detailElementID)
                });
            }

            if (this.secondViewName == "SaveMailSignature") {
                var secondView = new SettingsMailSignatureListView({
                    el: $(detailElementID)
                });
                secondView.SaveMailSignature();
            } else if (this.secondViewName == "SaveChangePassword") {
                var secondView = new SettingsChangePasswordListView({
                    el: $(detailElementID)
                });
                secondView.SaveChangePassword();
            } else {

                setTimeout(function() {

                    secondView.render();

                }, Shared.timeoutDelay);

            }


        } else {

            $(detailElementID).html("");

            var loadingView = new LoadingView({
                el: $(primaryElementID)
            });
            loadingView.render();

            var that = this;

            setTimeout(function() {

                var newData = {
                    _: _,
                    user: Shared.profile,
                    auth: Shared.api.auth(),
                    automaticLogin: Shared.settings.automaticLogin,
                    Shared: Shared
                };

                var htmlTemplate = _.template(settingsListTemplate);
                var compiledTemplate = htmlTemplate(newData);

                that.$el.html(compiledTemplate);
                $(primaryElementID).empty().html(that.$el);


                //Shared.setCurrentPageTitle("Preferências");
                window.componentHandler.upgradeDom();


            }, Shared.timeoutDelay);

        }

        Shared.setDefaultIMListeners();

    },

    events: {
        //"click .settinsLink": "selectMenuItem",
        "change #automaticLoginSwitch": "selectAutomaticLogin",
    },

    selectAutomaticLogin: function(e) {

        if (Shared.settings.automaticLogin == true) {
            $("#automaticLoginSwitch").val("off");
            Shared.settings.automaticLogin = false;
        } else {
            $("#automaticLoginSwitch").val("on");
            Shared.settings.automaticLogin = true;
        }

        // //BUG INTENTIONALY LEFT TO REPRODUCE AN INVALID AUTH.

        // Shared.api
        // .resource('Logout')
        // .done(function(result){

        //   alert('logout');

        // })
        // .fail(function(error){

        //   Shared.handleErrors(error);

        //   return false;
        // })
        // .execute();

        // Shared.api.getLocalStorageValue("expresso",function(expressoValue) {

        //   expressoValue.auth = "7a3dn5thro4puedfe3afmcu1j5:622de249d9f778dd9a6c67923528273b";

        //   Shared.api.auth(expressoValue.auth);

        //   Shared.api.setLocalStorageValue("expresso",expressoValue);

        //   // Shared.saveSettingsToLocalStorage();
        // });

        // var expressoValue = Shared.api.getLocalStorageValue("expresso");
        // window.localStorage.removeItem("expresso");
        // window.localStorage.clear();
        // expressoValue.auth = "a" + expressoValue.auth;
        // alert("new auth : " + expressoValue.auth);

        // Shared.api.auth(expressoValue.auth);

        // Shared.api.setLocalStorageValue("expresso",expressoValue);

        // expressoValue = Shared.api.getLocalStorageValue("expresso");
        // alert("storage auth : " + expressoValue.auth);
        // alert("api auth: "+ Shared.api.auth());
        // //END OF BUG



    },

    // selectMenuItem: function(e){
    //   e.preventDefault();

    //   $('#settingsList li').each(function() { 
    //       $(this).removeClass( 'selected' ); 
    //   }); 

    //   var parent = $(e.target).parent();

    //   if (parent.hasClass("settinsLink")) {
    //     parent = parent.parent();
    //   }

    //   parent.addClass("selected");

    //   Shared.router.navigate(e.currentTarget.getAttribute("href"),{trigger: true});
    // },

    initialize: function() {
        this.secondViewName = "";
    }

});

export default SettingsListView;
