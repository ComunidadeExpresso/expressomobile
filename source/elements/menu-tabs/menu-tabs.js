

import Shared from 'shared';
import _ from 'underscore';
import FoldersModel from 'FoldersModel';
import FoldersCollection from 'FoldersCollection';

Polymer({
	is: 'menu-tabs',

	properties: {
		selected: {
			type: Number,
			value: 0
		},
		profile: {
			type: Array,
			value: []
		},
        cardImage: {
            type: String,
            value: ''
        },
	},

	ready: function() {
		var that = this;
		Shared.api.getLocalStorageValue("expresso", function(expressoValue) {

            if (expressoValue != null) {

                that.profile = expressoValue.profile;

            }
        });
        this.updateCardImage();
	},

    updateCardImage: function() {
      // console.log('updateCardImage');
      var RandomCard = Shared.getRandomCardBackground();
      this.cardImage = '../imgs/paper-card-backgrounds/' + RandomCard;
    },

	menuFoldersSelect: function(e) {
		e.stopPropagation();
		console.log("menuFoldersSelect");
	},

	folderSelect: function(e) {
		var selectedMenuItem = e.detail.selected;

		var selectedFolder = this.folders[selectedMenuItem];
		this.fire("evt-open-folder",{folder: selectedFolder});
	},

	moduleSelect: function(e) {

		var selectedMenuItem = e.detail.selected;		
		this.fire("evt-open-module",{module: selectedMenuItem});
	},

	_LogoutUser : function(e) {
		

        // if (forceLogout == undefined) {
        //     forceLogout = true;
        // }

        Shared.forceLogout = true;

        Shared.api.resource('Logout')
        .done(function(result) {

        })
        .fail(function(error) {

            Shared.handleErrors(error);

        })
        .execute();

        var that = this;

        Shared.api.getLocalStorageValue("expresso", function(expressoValue) {

            var isPhoneGap = Shared.api.phoneGap();

            expressoValue.auth = "";
            expressoValue.profile = "";
            expressoValue.username = "";
            expressoValue.password = "";
            expressoValue.phoneGap = isPhoneGap;
            expressoValue.serverAPI = "";

            if (Shared.isAndroid()) {
                Shared.service.disableTimer();
                Shared.service.stopService();
            }

            Shared.api.setLocalStorageValue("expresso", expressoValue);

            that.fire('user-has-logged-out');

            // $("#mainAppPageContent").empty();

            //Shared.router.navigate('/', true);

        });

        


	},

});