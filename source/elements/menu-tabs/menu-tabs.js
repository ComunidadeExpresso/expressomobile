

import Shared from 'shared';
import _ from 'underscore';
import FoldersModel from 'FoldersModel';
import FoldersCollection from 'FoldersCollection';
import SharedBehavior from 'SharedBehavior';

Polymer({
	is: 'menu-tabs',

	behaviors: [
		SharedBehavior
	],

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
        refreshFolders: {
        	type: Number,
        	value: false,
        	notify: true,
        	reflectAttribute: true,
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
      var RandomCard = Shared.getRandomCardBackground();
      this.cardImage = '../imgs/paper-card-backgrounds/' + RandomCard;
    },

	_LogoutUser : function(e) {
        this.fire('iron-signal', {  name: 'logout', data: { } });
	},

});