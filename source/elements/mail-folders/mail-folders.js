

import Shared from 'shared';
import _ from 'underscore';
import FoldersModel from 'FoldersModel';
import FoldersCollection from 'FoldersCollection';
import SharedBehavior from 'SharedBehavior';
import page from 'page';

Polymer({
	is: 'mail-folders',

    behaviors: [
      SharedBehavior
    ],

	properties: {

		folders: {
			type: Array,
			value: []
		},
        diskSizeUsed: {
            type: Number,
            value: 0,
        },
        diskSizeLimit: {
            type: Number,
            value: 0,
        },
		quotaPercent: {
			type: Number,
			value: 0,
            computed: 'computeQuotaPercent(diskSizeUsed, diskSizeLimit)',
		},
		quotaInfo: {
			type: String,
            computed: 'computeQuotaInfo(diskSizeUsed, diskSizeLimit)',
		},
        excludeFolder: {
            type: String,
            value: '',
        },
        withLink: {
            type: Number,
            value: true,
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
            notify: true,
            reflectAttribute: true,
        },
        refreshFolders: {
            type: Number,
            value: false,
            observer: 'refreshFoldersChanged',
        },
        ignoreCache: {
            type: Number,
            value: true,
        },
        autoLoadFromCache: {
            type: Number,
            value: false,
            observer: 'autoLoadFromCacheChanged',
        },
	},

    autoLoadFromCacheChanged: function(value) {
        if (value == true) {
            this.ignoreCache = false;
            this._refreshFolders();
        }
    },

    refreshFoldersChanged: function(value) {
        if (value == true) {
            this._refreshFolders();
            this.refreshFolders = false;
        }
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
            that.diskSizeLimit = data.diskSizeLimit;
            that.diskSizeUsed = data.diskSizeUsed;
        	//that.setQuota(data.diskSizeUsed,data.diskSizeLimit);

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

            that.isLoading = false;


        })
        .fail(function(error) {
            console.warn('ERROR: Mail/Folders');
            console.warn(error);
            that.handleErrors(error);
            // Shared.handleErrors(error);
        })
        .execute();
	},

    _refreshFolders: function() {
        console.log('refreshFolders');
        this.isLoading = true;
        this.getFolders("INBOX","",this.ignoreCache);
    },

    computeQuotaPercent: function(used, total) {
        var percent = (used * 100 / total).toFixed(0);
        return percent;    
    },

	computeQuotaInfo: function(used, total) {
        var percent = (used * 100 / total).toFixed(0);
        var infoPercent = percent + "% (" + this.bytesToSize(used, 0) + " / " + this.bytesToSize(total, 0) + ")";
        // console.log(infoPercent);
        return infoPercent;    
    },

	ready: function() {
        // if (this.autoLoad) {
        //     console.log("autoLoad");
        //     this.getFolders("INBOX","",this.ignoreCache);
            // var that = this;
            // Shared.refreshFolders = function() {
            //     that.getFolders("INBOX","",true);
            // }
            // setInterval(Shared.refreshFolders, 3 * 60000);
        // }
	},

	menuFoldersSelect: function(e) {
		// e.stopPropagation();
		// console.log("menuFoldersSelect");
        //this.refreshFolders = true;
	},

	folderSelect: function(e) {
        var selectedMenuItem = e.detail.selected;
        var selectedFolder = this.folders[selectedMenuItem];
        if (!this.withLink) {
            
            console.log(this.openFolder);
		    
		    this.fire(this.openFolder,{folder: selectedFolder});
        } else {
            var app = document.querySelector('#app');
            var route = app.baseUrl + 'mail-messages/' + selectedFolder.folderID;
            // console.log(selectedFolder);
            page(route);
        }
	},

    _computeShowLoadingStyle: function(isLoadingActive) {
        if (isLoadingActive) {
          return '';
        } else {
          return 'display: none;';
        }
      },


});