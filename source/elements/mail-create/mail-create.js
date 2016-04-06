
import _ from 'underscore';
import $ from 'jquery';
import Shared from 'shared';

import SharedBehavior from 'SharedBehavior';
import AppPageBehavior from 'AppPageBehavior';


Polymer({
    is: 'mail-create',

    behaviors: [
      AppPageBehavior,
      SharedBehavior,
    ],

    properties: {

      action: {
        type: String,
        value: '',
      },
      folderId: {
        type: String,
        value: '',
      },
      msgId: {
        type: String,
        value: '',
      },
      emails: {
        type: Array,
        value: [],
      },


      msgTo: {
        type: Array,
        value: [{name: '', email: 'email1@teste.com'}, {name: 'Email 2', email: 'email2@teste.com'}],
      },

      msgCc: {
        type: Array,
        value: [{name: 'Jair Pereira', email: 'pereira.jair@gmail.com'}],
      },

      ccVisible: {
        type: Number,
        value: false,
        notify: true,
      },

      bccVisible: {
        type: Number,
        value: false,
      },


      msgBcc: {
        type: Array,
        value: [],
      },

    },

    showCc: function() {
      this.ccVisible = true;
    },

    refresh: function() {
      this.setLoading(false);
      this.setPageTitle('Nova Mensagem','');
      this.refreshMenuItems();
    },

    refreshMenuItems: function() {
      var menuNormal = [
        {iconClass: "send", type: 'signal', route: "mail-send",title: "Enviar", data: ""}
      ];
      this.setMenuItems(menuNormal);
    },

  });