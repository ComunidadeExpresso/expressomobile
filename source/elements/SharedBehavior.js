

import page from 'page';
import Shared from 'shared';

var SharedBehavior =  {
    properties: {
      
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

    openPage: function(route) {
      var app = document.querySelector('#app');
      page(app.baseUrl + route);
    },

    getRandomCardBackground: function(folderPrefix) {
      var number = Math.floor((Math.random() * 12) + 1);
      var image = 'bg-' + number + '.jpg';
      return folderPrefix + image;
    },

    handleErrors: function(error) {
      console.log('handleErrors');
      console.log(error.error);
      if ((error.error.code == 7) || (error.error.code == 3)) {
        this.showMessage('Sua sessão expirou.','error');
        this.fire('iron-signal', {  name: 'logout', data: { } });
      }

      if (error.error.code == 100) {
        this.showMessage('Verifique sua conexão com a Internet...','warn');
      }    

    },

    _decodeHTMLEntities: function(val) {
      var t = document.createElement('textarea');
      t.innerHTML = val;
      return t.textContent;
    },

    _eatEvent: function(e) {
      e.stopPropagation();
    },

    removeAccents: function(strAccents) {
        var strAccents = strAccents.split('');
        var strAccentsOut = new Array();
        var strAccentsLen = strAccents.length;
        var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
        var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";

        for (var y = 0; y < strAccentsLen; y++) {
            if (accents.indexOf(strAccents[y]) != -1)
                strAccentsOut[y] = accentsOut.substr(accents.indexOf(strAccents[y]), 1);
            else
                strAccentsOut[y] = strAccents[y];
        }

        strAccentsOut = strAccentsOut.join('');

        return strAccentsOut;
    },

    isLoggedIn: function(callback) {
      var that = this;
      Shared.api.getLocalStorageValue("expresso",function(expressoValue) {
        if (expressoValue != null) {
          var authValue = expressoValue.auth;

          if (authValue != null) {
            Shared.api.auth(authValue);
          }

          Shared.profile = expressoValue.profile;

        }

        if ((Shared.api.auth())) { 
          that.isLogged = true;
        } else {
          that.isLogged = false;
        }

        callback(that.isLogged);

      });

    },


};

export default SharedBehavior;