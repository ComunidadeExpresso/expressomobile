

/*

<iron-signals on-iron-signal-page-title="_pageTitle"></iron-signals>
<iron-signals on-iron-signal-back-button="_backButtonChange"></iron-signals>

*/

var AppPageBehavior =  {
    properties: {
      pageTitle: {
        type: String, 
        value: '',
      },
      pageSubTitle: {
        type: String,
        value: ''
      },
      toolbarHidden: {
        type: Number, 
        value: false,
      },
      subMenuItems: {
        type: Array,
        value: [],
        value: [{iconClass: "social:person-add", route: "contact-create",title: "Novo Contato"},{iconClass: "social:person-add", route: "contact-create",title: "Novo Contato"}],
      },
      menuItems: {
        type: Array,
        value: [],
      },

      logLevel: {
        type: Number, 
        value: 1,
      },

      debug: {
        type: Number, 
        value: true,
      },

      isLoading: {
        type: Number, 
        value: false,
        notify: true,
        reflectAttribute: true,
      },
      
      backButtonEnabled: {
        type: Number, 
        value: false,
        notify: true,
      },

      refreshButtonEnabled: {
        type: Number, 
        value: false,
        notify: true,
      },
      refreshButtonSignal: {
        type: String,
        value: ''
      },
    },

    ready: function() {
      // console.log("app-page: ready");
    },

    log: function(logLevel,log) {
      if (this.debug) {
        if (logLevel <= this.logLevel) {
          console.log(log);
        } 
      }
    },

    showMessage: function(message,msgType) {
      if (msgType == undefined) {
        msgType = 'info';
      }
      this.fire('iron-signal', {
        name: 'toaster-bake',
        data: {
          text: message,
          type: msgType,
        }
      });

    },

    setLoading: function(value) {
      this.isLoading = value;
      this.fire('iron-signal', {
        name: 'page-loading',
        data: {
          enabled: value,
        }
      });
    },

    setBackButtonEnabled: function(enabled) {
      this.fire('iron-signal', {
        name: 'back-button',
        data: {
          enabled: enabled,
        }
      });
    },

    setRefreshButtonEnabled: function(enabled,signal) {
      this.fire('iron-signal', {
        name: 'refresh-button',
        data: {
          enabled: enabled,
          signal: signal,
        }
      });
    },

    setMenuItems: function(menuItems) {
      this.fire('iron-signal', {
        name: 'menufab-items',
        data: {
          items: menuItems,
        }
      });
    },

    updateBackgroundImage: function(menuItems) {
      this.fire('iron-signal', {
        name: 'update-background-image',
        data: {
          items: menuItems,
        }
      });
    },

    setPageTitle: function(Ptitle,Psubtitle) {
      this.fire('iron-signal', {
        name: 'page-title',
        data: {
          title: Ptitle,
          subtitle: Psubtitle,
        }
      });
    },
    
    _decodeHTMLEntities: function(val) {
      var t = document.createElement('textarea');
      t.innerHTML = val;
      return t.textContent;
    },

    setupToolbar: function(Ptitle,Psubtitle,backButtonEnabled,refreshButtonEnabled,refreshButtonSignal) {
      this.fire('iron-signal', {
        name: 'page-toolbar',
        data: {
          title: Ptitle,
          subtitle: Psubtitle,
          backButtonEnabled: backButtonEnabled,
          refreshButtonEnabled: refreshButtonEnabled,
          refreshButtonSignal: refreshButtonSignal,
        }
      });
    },
};

export default AppPageBehavior;