

import Shared from 'shared';
import _ from 'underscore';
import FoldersModel from 'FoldersModel';
import FoldersCollection from 'FoldersCollection';

Polymer({
	is: 'mail-folders',

	properties: {

		folders: {
			type: Array,
			value: []
		},
		quotaPercent: {
			type: Number,
			value: 0,
		},
		quotaInfo: {
			type: String,
			value: '',
		},
        excludeFolder: {
            type: String,
            value: '',
        },
        withBadges: {
            type: Number,
            value: true,
        },
        withTitle: {
            type: Number,
            value: true,
        },
		onlyMainFolders: {
			type: Number,
			value: true,
		},
        openFolder: {
            type: String,
            value: 'evt-open-folder',
        },
        isLoading: {
            type: Number,
            value: false,
        },
	},

	bytesToSize: function(bytes, precision) {
        var kilobyte = 1024;
        var megabyte = kilobyte * 1024;
        var gigabyte = megabyte * 1024;
        var terabyte = gigabyte * 1024;

        if ((bytes >= 0) && (bytes < kilobyte)) {
            return bytes + ' B';

        } else if ((bytes >= kilobyte) && (bytes < megabyte)) {
            return (bytes / kilobyte).toFixed(precision) + ' KB';

        } else if ((bytes >= megabyte) && (bytes < gigabyte)) {
            return (bytes / megabyte).toFixed(precision) + ' MB';

        } else if ((bytes >= gigabyte) && (bytes < terabyte)) {
            return (bytes / gigabyte).toFixed(precision) + ' GB';

        } else if (bytes >= terabyte) {
            return (bytes / terabyte).toFixed(precision) + ' TB';

        } else {
            return bytes + ' B';
        }
    },

	getFolders: function(folderIDValue, searchValue,ignoreCache) {

        this.isLoading = true;

        var that = this;
        var collection = new FoldersCollection();

        if (ignoreCache) {
            collection.ignoreCache(true);
        }

        collection.getFolders(folderIDValue, searchValue)
        .done(function(data) {

        	// console.log(data);
        	// that.setQuota(data.diskSizeUsed,data.diskSizeLimit);

            var arr_items = [];

            var currentIndex = 0;

            _.each(data.models, function(folder) {

                var attrs = {};

                var folderIcon = "folder";
				if (folder.get("folderType") == 0) { folderIcon = "inbox"; }
				if (folder.get("folderType") == 4) { folderIcon = "drafts"; }
				if (folder.get("folderType") == 1) { folderIcon = "send"; }
				if (folder.get("folderType") == 2) { folderIcon = "archive"; }
				if (folder.get("folderType") == 3) { folderIcon = "delete"; }
				if (folder.get("folderType") == 5) { folderIcon = "folder"; }
				if (folder.get("folderType") == 6) { folderIcon = "folder-shared"; }

                attrs["index"] = currentIndex + 1;
                attrs["folderID"] = folder.get("folderID");
                attrs["folderName"] = folder.get("folderName");
                attrs["qtdUnreadMessages"] = folder.get("qtdUnreadMessages");
                attrs["folderHasChildren"] = folder.get("folderHasChildren");
                attrs["folderParentID"] = folder.get("folderParentID");
                attrs["folderIcon"] = folderIcon;
                attrs["route"] = folder.route();

                if (attrs["folderID"] != that.excludeFolder) {

                    if (that.onlyMainFolders) {
                    	if (((folder.get("folderParentID") == "") || (folder.get("folderParentID") == "user")) ) {
                    		arr_items.push(attrs);
                    	}
                    } else {
                    	arr_items.push(attrs);
                    }

                }

            });

            that.folders = arr_items;

            that.isLoading = true;


        })
        .fail(function(error) {
            Shared.handleErrors(error);
        })
        .execute();
	},

    refreshFolders: function() {
        this.getFolders("INBOX","",true);
    },

	setQuota: function(used, total) {

        var percent = (used * 100 / total).toFixed(0);
        var infoPercent = percent + "% (" + this.bytesToSize(used, 0) + " / " + this.bytesToSize(total, 0) + ")";

        this.quotaPercent = percent; 
        this.quotaInfo = infoPercent;

    },

	ready: function() {
        this.getFolders("INBOX","",false);
        var that = this;
        Shared.refreshFolders = function() {
            that.getFolders("INBOX","",true);
        }

        setInterval(Shared.refreshFolders, 3 * 60000);
	},

	menuFoldersSelect: function(e) {
		e.stopPropagation();
		console.log("menuFoldersSelect");
	},

	folderSelect: function(e) {
		var selectedMenuItem = e.detail.selected;

        console.log(this.openFolder);

		var selectedFolder = this.folders[selectedMenuItem];
		this.fire(this.openFolder,{folder: selectedFolder});
	},


});