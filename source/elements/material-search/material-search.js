
// import _ from 'underscore';
import Shared from 'shared';
import MessagesCollection from 'MessagesCollection';
import AppPageBehavior from 'AppPageBehavior';
import SharedBehavior from 'SharedBehavior';

Polymer({
    is: 'material-search',

    behaviors: [
      AppPageBehavior,
      SharedBehavior,
    ],

    properties: {

      isLoading: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        notify: true
      },

      previousSearches: {
        type: Array,
        value: [],
        notify: true,
        reflectToAttribute: true,
      },

      activeTab: {
        type: Number,
        value: 0,
      },

      active: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        notify: true
      },

      searchValue: {
        type: String,
        value: '',
        observer: '_searchValueChanged'
      }

    },

    ready: function() {
      this._updateBackgroundImage();
    },

    _updateBackgroundImage: function() {
      var number = Math.floor((Math.random() * 12) + 1);
      var image = 'bkg_' + number + '.jpg';
      //this.$.searchTabs.style.backgroundImage = 'url(../../imgs/material_backgrounds/' + image + ')';
    },

    toggle: function() {
      this.active = !this.active;
      if (this.active) {
        this.$.searchbox.focus();
      }
    },

    getSpeechInput: function(e) {
      var recognition = 'SpeechRecognition' in window ? new SpeechRecognition() :
                        'webkitSpeechRecognition' in window ? new webkitSpeechRecognition() :
                        null;
     if (recognition) {
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = function(e) {
        var result = e.results[0][0].transcript;
        this.searchValue = result;
      }.bind(this);
      recognition.start();
     }
    },

    doSearch: function(e) {
      if (e.keyCode == 13) {
        this._searchValueChanged();
      }
    },

    _searchValueChanged: function() {

      if (this.searchValue.length <= 3) {
        this.showMessage('Sua busca deve ter mais do que 3 caracteres.','error');
      } else {

        if ((this.searchValue != undefined) && (this.searchValue.trim() != '')) {

          var found = false;
          for (var i = 0; i< this.previousSearches.length; i++) {
            if (this.previousSearches[i] == this.searchValue.trim()) {
              found = true;
            }
          }

          if (!found) {
            this.previousSearches.push(this.searchValue.trim());
          }
          

          this._onPageChange();

        }
        if ((this.activeTab == 1) && (this.searchValue.trim() == '')) {
          // this._onPageChange();
          this.$.contactListPersonal.reloadContent(true);
        }

      }
    },

    _onPageChange:function(e,a) {

      if (this.activeTab == 0) {
        this.$.mailSearch.doSearch(this.searchValue);
      }
      if (this.activeTab == 1) {
        this.$.contactListPersonal.search = this.searchValue;
      }
      if (this.activeTab == 2) {
        this.$.contactListGeneral.search = this.searchValue;
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