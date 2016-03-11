
import MessagesCollection from 'MessagesCollection';
import ContactsListCollection from 'ContactsListCollection';
import Shared from 'shared';
import PreviewAttachmentMessageView from 'PreviewAttachmentMessageView';
import AppPageBehavior from 'AppPageBehavior';


Polymer({
  is: 'mail-detail',

  behaviors: [
      AppPageBehavior
  ],

  properties: {
    folder: {
      type: String, 
      value: '',
      notify: true,
      reflectAttribute: true
    },
    msg: {
      type: String, 
      value: '',
      notify: true,
      reflectAttribute: true
    },
    timeAgo: {
      type: String, 
      value: '',
    },
    messageBodyFormated: {
      type: String, 
      value: '',
    },
    from: {
      type: String,
      value: '',
    },
    isLoading: {
      type: Number,
      value: false,
      reflectToAttribute: true
    },
    hasAttachments: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },
    starred: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },
    starredIcon: {
      type: String,
      value: '',
      computed: '_computeStarredIcon(starred)'
    },
    imageSrc: {
      type: String,
      value: '',
    },
    profileSrc: {
      type: String,
      value: '',
    },
    htmlRecipientsTo: {
      type: String,
      value: 'teste',
    },
    subject: {
      type: String, 
      value: '',
      notify: true,
      reflectAttribute: true
    },
    message: {
      type: Object, 
      value: {},
      reflectAttribute: true
    },
  },
  _decodeHTMLEntities: function(val) {
    var t = document.createElement('textarea');
    t.innerHTML = val;
    return t.textContent;
  },

  _computeStarredIcon: function(starred) {
    return 'icons:star' + (starred ? '' : '-border');
  },

  _onReply: function(e) {
    console.log("_onReply");
    this.$.dialogReply.open();
  },

  _onReplyAll: function(e) {
    console.log("_onReplyAll");
  },
  _onForward: function(e) {
    console.log("_onForward");
  },
  _onDelete: function(e) {
    console.log("_onDelete");
  },

  isLastIndexOf: function(items,index) {
    if(items.length - 1 === index)
      { return true; } 
    else 
      { return false; }
  },

  isEqualTo: function (value,maxValue) {
    if (value == maxValue) {
      return true;
    } else {
      return false;
    }
  },

  biggerThen: function(value,maxValue) {
    if (value > maxValue) {
      return true;
    } else {
      return false;
    }
  },

  hasMoreThen: function(items,maxLength) {
    console.log(items);
    console.log(items.length);
    if (items.length > maxLength) {
      return true;
    } else {
      return false;
    }
  },

  hasFullName: function(item) {
    if (item.fullName.trim() != '') {
      return true;
    } else {
      return false;
    }
  },

  getMsgRecipientsHTML: function(items, title) {
    var html = '';

    var limitRecipients = 5;

    if (items.length != 0) {
      html = html + '<div class="msgRecipient">';
      html = html + "&nbsp;&nbsp;" + title + ":&nbsp;";
      var firstRecipients = '';
      for (var i= 0; i < items.length; i++) {
        var recipient = items[i];
        if ((items.length > limitRecipients) && (i == limitRecipients)) {
          var qtdExtraRecipients = items.length - limitRecipients;
          html = html + '<div style="margin-top: -45px;"><div class="extraRecipientsInfo">e mais ' + qtdExtraRecipients + ' pessoas...</div><expanded-card>';
        }

        if (recipient.fullName.trim() == '') {
          html = html + '<paper-button class="badge-recipient" on-tap="composeMail">' + recipient.mailAddress + '</paper-button>';
        } else {
          html = html + '<paper-button class="badge-recipient" on-tap="composeMail">' + recipient.fullName + '<paper-tooltip>' + recipient.mailAddress + '</paper-tooltip></paper-button>';
        }

        if ((items.length > limitRecipients) && (i == items.length - 1)) {
          html = html + '</expanded-card></div>';
        }

      }
      html = html + "</div>";
    }
    return html;
  },

  composeMail: function(e) {
    console.log("composeMail");
    console.log(e);
  },

  _computeAttachmentsId: function(folderID,msgID) {

    var elementID = "msgAttachmentsRecipients_" + folderID.replace('/','_').replace(' ','_') + "_" + msgID;
    return elementID;
  },

  _onHighlightStar: function(e) {
    e.stopPropagation();
    

    var that = this;

    var flagType = 2;
    var msgSuccess = "Mensagem desmarcada de importante.";
    var msgFail = "Não foi possível desmarcar a mensagem.";
    if (this.starred) {
        flagType = 1;
        msgSuccess = "Mensagem marcada como importante.";
        msgFail = "Não foi possível marcar a mensagem.";
    }
    console.log("_starredMessage");
    this.starred = !this.starred;
    this.set("starred",this.starred);


    var callbackSuccess = function(result) {

      Shared.showMessage({
          type: "success",
          icon: 'icon-expresso',
          title: msgSuccess,
          description: "",
          timeout: 3000,
          elementID: "#pageMessage",
      });

    };

    var callbackFail = function(error) {

      Shared.showMessage({
          type: "error",
          icon: 'icon-expresso',
          title: msgFail,
          description: "",
          timeout: 3000,
          elementID: "#pageMessage",
      });

      that.starred = !that.starred;
      that.set("starred",that.starred);

    };

    this.messagesCollection.flagMessage(this.folder, this.msg, flagType, callbackSuccess, callbackFail);

    // this.fire('starred-message', {thread: this});

  },

  clearHtml: function(elementToClear) {

  },

  bindHtml: function(elementToBind,htmlToBind,elementId) {

    // var div = document.createElement('echo-html');
    // // div.html = htmlToBind;
    // div.innerHTML = htmlToBind;
    // elementToBind.appendChild(div);

    elementToBind.innerHTML = '';

    var domBind = document.createElement('template', 'dom-bind');
    domBind.id = elementId;
    // domBind.fireParentEvent1 = function(e) {
    //   // the parent fires an event
    //   this.fire('event-one', {
    //     message: 'hello'
    //   });
    // };
    var doc = domBind.content.ownerDocument;
    var elem = doc.createElement('div');
    elem.innerHTML = htmlToBind;
    domBind.content.appendChild(elem);
    elementToBind.appendChild(domBind);
  },

  loadMessage: function() {
    var that = this;

    this.isLoading = true;

    console.log("loadMessage:" + this.folder + " - " + this.msg);

    this.messagesCollection = new MessagesCollection();
    this.messagesCollection.getMessagesInFolder(this.folder, this.msg, '', 1).done(function(Pdata) {

      that.message = Pdata.models[0];

      that.timeAgo = that.message.getTimeAgo();
      that.messageBodyFormated = that.message.getMessageBody(false);

      // that.pageTitle = that.message.get("msgSubject");
      that.setPageTitle(that.message.get("msgSubject"),that.message.get('msgFrom').mailAddress);
      that.setBackButtonEnabled(true);
      that.setRefreshButtonEnabled(false);
      // that.backButton = true;
      // that.refreshButton = false;

      var msgFlagged = that.message.get("msgFlagged");
      if (msgFlagged == "1") {
        that.starred = true;
      } else {
        that.starred = false;
      }

      that.from = that.message.get('msgFrom').mailAddress;

      that.bindHtml(that.$.msgBody,that.messageBodyFormated);

      //that.htmlRecipientsTo = that.getMsgRecipientsHTML(that.message.get('msgTo'),'Para');
      that.bindHtml(that.$.recipientsMsgTo,that.getMsgRecipientsHTML(that.message.get('msgTo'),'Para'),'msgToBinded');
      var t = document.querySelector('#msgToBinded');

      t.addEventListener('composeMail', function() {
        // auto-binding template is ready.
        console.log("composeMail");
      });

      that.bindHtml(that.$.recipientsMsgCc,that.getMsgRecipientsHTML(that.message.get('msgCc'),'Cc'));
      that.bindHtml(that.$.recipientsMsgBcc,that.getMsgRecipientsHTML(that.message.get('msgBcc'),'Bcc'));


      if (that.message != undefined) {

          var attachments = that.message.get("msgAttachments");

          if (attachments != undefined) {
            that.hasAttachments = true;
          } else {
            that.hasAttachments = false;
          }
          // that.$.attachments

          for (var i in attachments) {

              var attachment = attachments[i];

              var preview = new PreviewAttachmentMessageView();

              preview.fileID = attachment.attachmentID;
              preview.fileName = attachment.attachmentName;
              preview.fileSize = attachment.attachmentSize;
              preview.fileEncoding = attachment.attachmentEncoding;
              preview.fileIndex = attachment.attachmentIndex;
              preview.msgID = that.message.get("msgID");
              preview.folderID = that.message.get("folderID");
              preview.fileData = '';

              preview.previewType = 'detailmessage';

              var elementID = "#" + that._computeAttachmentsId(that.message.get("folderID"),that.message.get("msgID"));

              preview.render(elementID);
          }

          that.isLoading = false;

      }

    }).fail(function(result) {


    }).execute();
  },

  attached: function () {
    // this.loadMessage();     
  },

  attributeChanged: function(name, type) {
      // console.log('mail-detail - attribute: '+ name);
      // if (name == 'msg') {
      //   this.loadMessage();
      // }
  },


  ready: function() {
    //console.log(this.message);
    //this.bindHtml(this.$.recipientsMsgTo,this.getMsgRecipientsHTML(this.message.get('msgTo'),'Para'));
  },


});

