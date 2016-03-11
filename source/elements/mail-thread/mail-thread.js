
import MessagesCollection from 'MessagesCollection';
import Shared from 'shared';
import page from 'page';

  Polymer({
    is: 'mail-thread',

    behaviors: [
      SwipeableBehavior
      //Polymer.IronMenuBehavior
    ],

    _HOLD_DELAY: 400, // wait delay (ms) to fire hold event.

    _didUp: false, // True if the user relased the thread (up event was fired).

    properties: {
      /**
       * The list of messages the thread contains.
       */
      messages: {
        type: Array,
        value: function() { return []; },
        observer: '_messagesChanged'
      },

      /**
       * List of the user's labels. Keys are the label id.
       */
      labels: {
        type: Object,
        value: function() { return {}; }
      },

      /**
       * The user profiles.
       */
      users: {
        type: Array,
        value: function() { return []; }
      },

      /**
       * Signifies on a mobile devices. Used to render a more condensed UI.
       */
      narrow: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      unread: {
        type: Boolean,
        value: true,
        reflectToAttribute: true
      },

      /**
       * True if the thread has been selected by the user.
       */
      selected: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /**
       * True if the thread has been archived.
       */
      archived: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        observer: '_archivedChanged'
      },

      /**
       * True if the thread should show its undo UI.
       */
      undo: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      thread: {
        type: Object,
        readOnly: true,
        value: function() { return {}; }
      },

      starredIcon: {
        type: String,
        value: '',
        computed: '_computeStarredIcon(starred)'
      },

      headerClasses: {
        type: String,
        value: '',
        computed: '_computeHeaderClasses(unread)'
      },

      from: {
        type: String,
        value: '',
      },

      fromemail: {
        type: String,
        value: '',
      },

      subject: {
        type: String,
        value: '',
      },

      bodyresume: {
        type: String,
        value: '',
      },

      route: {
        type: String,
        value: '',
      },

      msgid: {
        type: String,
        value: '',
      },

      folderid: {
        type: String,
        value: '',
      },

      date: {
        type: String,
        value: '',
      },

      profileSrc: {
        type: String,
        readOnly: true,
        computed: '_computeProfilePic(users, thread.from.name)'
      },

      showMessageCount: {
        type: Number,
        readOnly: true,
        value: false
      },

      starred: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      hasAttachments: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

    },

    // observers: [
    //   '_updateProfilePic(thread.from.*)'
    // ],

    created: function() {
      Polymer.dom(this).classList.add('swipeable-item');
    },

    ready: function() {
       //this.async(function() {
         this.target = this.$.thread;
       //});
      // this.setScrollDirection('y');

    },

    _objectItem: function(prop, id, path) {
      return this.get([prop, id, path]) || '';
    },

    _computeProfilePic: function(users, name) {
      if (!this.users) {
        return null;
      }
      // var src = this.users && this.users[name] ? this.users[name] : '/images/user.png';
      var src = this.users[name];
      return src;
    },

    _messagesChanged: function() {
      // TODO(ericbidelman): this is only the last thread. Support all messages in thread.
      this._setThread(this.messages[0]);
      if (this.messages.length >= 2) {
        //
      }

    },

    _decodeHTMLEntities: function(val) {
      var t = document.createElement('textarea');
      t.innerHTML = val;
      return t.textContent;
    },

    _hideThreadLabel: function(id) {
      if (!this.labels) {
        return true;
      }
      var label = this.labels[id];
      return !label || label.type !== 'user';
    },

    _computeStarredIcon: function(starred) {
      return 'icons:star' + (starred ? '' : '-border');
    },

    _computeHeaderClasses: function(unread) {
      return 'layout vertical flex ' + (unread ? 'unread' : '');
    },

    _onHighlightStar: function(e) {
      e.stopPropagation();
      this.thread.starred = !this.thread.starred;

      this.set("starred",this.thread.starred);

      var msgid = this.get("msgid");
      var folderid = this.get("folderid");
      var starred = this.get("starred");
      var currentMessage = {"msgid": msgid, "folderid": folderid, "starred": starred};

      var flagType = 2;
      var msgSuccess = "Mensagem marcada como normal.";
      var msgFail = "Não foi possível desmarcar a mensagem.";
      if (currentMessage.starred) {
          flagType = 1;
          msgSuccess = "Mensagem marcada como importante.";
          msgFail = "Não foi possível marcar a mensagem.";
      }
      console.log("_starredMessage3");
      console.log(currentMessage);

      var that = this;

      var callbackSuccess = function(result) {
        that.showMessage(msgSuccess);
      };

      var callbackFail = function(error) {

        that.showMessage(msgFail,'error');

          if (flagType == 1) {
              currentMessage.starred = false;
          } else {
              currentMessage.starred = true;
          }
          
      };

      var collection = new MessagesCollection();
      collection.flagMessage(currentMessage.folderid, currentMessage.msgid, flagType, callbackSuccess, callbackFail);

      //this.fire('starred-message', {thread: this});

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

    _onMailAction: function(e) {
      // e.stopPropagation();
      // console.log(e);
      // var route = this.msgid + '/' + this.folderid;
      // var app = document.querySelector('#app');

        
      // if (e.detail.selected = 0) {
      //   route = app.baseUrl + 'mail-reply/' + route;
      //   page.redirect(app.baseUrl + route);
      // }


      // console.warn('Not implemented');
    },

    _onUndo: function() {
      this.swipe(false);
    },

    _onUp: function(e) {
      this._didUp = true;
    },

    _onDown: function(e) {
      this._didUp = false;
      // e.detail.prevent('tap');
      // e.detail.prevent('track');

      this.async(function() {
        // Select thread if it isn't being swiped off or the user lifted their
        // finger before the "hold" event.
        if (!this._didUp && !this.target.classList.contains(this.swipingClass)) {
          this.$.profileimage.fire('tap'); // select thread.
        }
      }, this._HOLD_DELAY);
    },

    _onOpenMessage: function(e) {
      this.fire('open-message', {thread: this});
    },

    _onSelectThread: function(e) {
      if (Polymer.dom(e).localTarget === this.$.profileimage) {
        e.stopPropagation();
        this.selected = !this.selected;

        var message = { msgid: this.get('msgid'), folderid: this.get('folderid'), subject: this.get('subject'), from: this.get('from'), fromemail: this.get('fromemail'),
         selected: this.selected };

        if (this.selected) {
          this.fire('evt-select-thread', {eventData: message});
        } else {
          this.fire('evt-unselect-thread',{eventData: message});
        }
      }
    },

    _eatEvent: function(e) {
      e.stopPropagation();
    },

    _swipeOffChanged: function() {
      // console.log('_swipeOffChanged:' + this.swipeOff);
      // Show in-place UNDO for a swipe. Don't show it for multi-select archive.
      this.undo = this.swipeOff;
      this.archived = this.swipeOff;
    },

    _archivedChanged: function() {
      if (!this.isAttached) {
        return;
      }

      if (this.archived) {

        // De-select thread.
        if (this.selected) {
          this.selected = false;
          this.$.profileimage.fire('tap'); // tell core-selector.
        }

        // TODO: don't do this here. Should be handled by swipeable-item
        Polymer.dom(this.target).classList.add('offscreen', 'right');
        this.fire('thread-archive', {thread: this, showUndo: this.undo});

        if (!this.undo) {
          this.async(function() {
            this.toggleClass('shrink', true);
          });
        }
      } else {
        Polymer.dom(this.target).classList.remove('offscreen', 'right');
        this.toggleClass('shrink', false);

        this.fire('thread-archive', {thread: this, showUndo: this.undo});
      }
    }
  });