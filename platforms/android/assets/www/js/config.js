(function() {
  
  var config = {


  map: {
    text : "js/text.js",
    traceur: './bower_components/traceur/traceur.min.js',
    "html": "bower_components/systemjs-plugin-html/html.js",
    "polymer": "bower_components",
    "webcomponentsjs": "bower_components/webcomponentsjs"
  },

  // globalEvaluationScope: false,
  paths: {
    templates:                                    "js/templates",
    Shared:                                       "js/shared.js",
    shared:                                       "js/shared.js",
    router:                                       "js/router.js",
    main:                                         "js/main.js",
    app:                                          "js/app.js",

    //MODELS
    EventCategoryModel:                           "js/models/EventCategoryModel.js",
    EventModel:                                   "js/models/EventModel.js",
    ContactModel:                                 "js/models/ContactModel.js",
    ContactPictureImageModel:                     "js/models/ContactPictureImageModel.js",
    ContextMenuModel:                             "js/models/ContextMenuModel.js",
    ExpressoModel:                                "js/models/ExpressoModel.js",
    MenuItemModel:                                "js/models/MenuItemModel.js",
    PopupModel:                                   "js/models/PopupModel.js",
    ServerModel:                                  "js/models/ServerModel.js",
    FoldersModel:                                 "js/models/FoldersModel.js",
    MessagesModel:                                "js/models/MessagesModel.js",

    //COLLECTIONS
    EventCategoriesCollection:                    "js/collections/EventCategoriesCollection.js",
    EventsListCollection:                         "js/collections/EventsListCollection.js",
    ContactsListCollection:                       "js/collections/ContactsListCollection.js",
    DetailsContactCollection:                     "js/collections/DetailsContactCollection.js",
    ContextMenuCollection:                        "js/collections/ContextMenuCollection.js",
    ExpressoCollection:                           "js/collections/ExpressoCollection.js",
    MenuItemsCollection:                          "js/collections/MenuItemsCollection.js",
    ServersCollection:                            "js/collections/ServersCollection.js",
    FoldersCollection:                            "js/collections/FoldersCollection.js",
    MessagesCollection:                           "js/collections/MessagesCollection.js",

    //VIEWS    
    CalendarDeleteEventView:                      "js/views/calendar/CalendarDeleteEventView.js",
    CalendarDetailsView:                          "js/views/calendar/CalendarDetailsView.js",
    CalendarEditEventAddParticipantsView:         "js/views/calendar/CalendarEditEventAddParticipantsView.js",
    CalendarEditEventView:                        "js/views/calendar/CalendarEditEventView.js",
    CalendarEventsDayListView:                    "js/views/calendar/CalendarEventsDayListView.js",
    CalendarFullDayListView:                      "js/views/calendar/CalendarFullDayListView.js",
    CalendarListView:                             "js/views/calendar/CalendarListView.js",
    ChatListItemsView:                            "js/views/chat/ChatListItemsView.js",
    ChatListView:                                 "js/views/chat/ChatListView.js",
    ChatWindowView:                               "js/views/chat/ChatWindowView.js",
    AddContactView:                               "js/views/contacts/AddContactView.js",
    ContactsListView:                             "js/views/contacts/ContactsListView.js",
    DeleteContactView:                            "js/views/contacts/DeleteContactView.js",
    DetailsContactView:                           "js/views/contacts/DetailsContactView.js",
    PictureImageContactView:                      "js/views/contacts/PictureImageContactView.js",
    ContextMenuView:                              "js/views/home/ContextMenuView.js",
    HomeView:                                     "js/views/home/HomeView.js",
    LoadingView:                                  "js/views/home/LoadingView.js",
    MenuView:                                     "js/views/home/MenuView.js",
    OfflineView:                                  "js/views/home/OfflineView.js",
    SearchView:                                   "js/views/home/SearchView.js",
    UserMessageView:                              "js/views/home/UserMessageView.js",
    LoginView:                                    "js/views/home/LoginView.js",
    ComposeMessageView:                           "js/views/mail/ComposeMessageView.js",
    DetailMessageView:                            "js/views/mail/DetailMessageView.js",
    EditFolderView:                               "js/views/mail/EditFolderView.js",
    FoldersMenuListView:                          "js/views/mail/FoldersMenuListView.js",
    IronScrollTresholdView:                       "js/views/mail/IronScrollTresholdView.js",
    MessagesListItemView:                         "js/views/mail/MessagesListItemView.js",
    MessagesListItemsView:                        "js/views/mail/MessagesListItemsView.js",
    MessagesListView:                             "js/views/mail/MessagesListView.js",
    PreviewAttachmentMessageView:                 "js/views/mail/PreviewAttachmentMessageView.js",
    PullToActionView:                             "js/views/mail/PullToActionView.js",
    SettingsAboutListView:                        "js/views/settings/SettingsAboutListView.js",
    SettingsChangePasswordListView:               "js/views/settings/SettingsChangePasswordListView.js",
    SettingsCreditsListView:                      "js/views/settings/SettingsCreditsListView.js",
    SettingsFaqListView:                          "js/views/settings/SettingsFaqListView.js",
    SettingsListView:                             "js/views/settings/SettingsListView.js",
    SettingsMailSignatureListView:                "js/views/settings/SettingsMailSignatureListView.js",
    SettingsResultsPerPageListView:               "js/views/settings/SettingsResultsPerPageListView.js",
    SettingsSupportListView:                      "js/views/settings/SettingsSupportListView.js",


    //TEMPLATES
    calendarDetailsListParticipantsTemplate:      "js/templates/calendar/calendarDetailsListParticipantsTemplate.html!text",
    calendarDetailsTemplate:                      "js/templates/calendar/calendarDetailsTemplate.html!text",
    calendarEditEventAddParticipantsTemplate:     "js/templates/calendar/calendarEditEventAddParticipantsTemplate.html!text",
    calendarEditEventTemplate:                    "js/templates/calendar/calendarEditEventTemplate.html!text",
    calendarEventsDayListTemplate:                "js/templates/calendar/calendarEventsDayListTemplate.html!text",
    calendarFullDayListTemplate:                  "js/templates/calendar/calendarFullDayListTemplate.html!text",
    calendarTemplate:                             "js/templates/calendar/calendarTemplate.html!text",
    chatListItemsTemplate:                        "js/templates/chat/chatListItemsTemplate.html!text",
    chatListTemplate:                             "js/templates/chat/chatListTemplate.html!text",
    chatListTemplateDesktop:                      "js/templates/chat/chatListTemplateDesktop.html!text",
    chatWindowMessagesTemplate:                   "js/templates/chat/chatWindowMessagesTemplate.html!text",
    chatWindowTemplate:                           "js/templates/chat/chatWindowTemplate.html!text",
    detailsContactTemplate:                       "js/templates/contacts/detailsContactTemplate.html!text",
    generalContactsListTemplate:                  "js/templates/contacts/generalContactsListTemplate.html!text",
    personalContactsListTemplate:                 "js/templates/contacts/personalContactsListTemplate.html!text",
    pictureImageContactTemplate:                  "js/templates/contacts/pictureImageContactTemplate.html!text",
    contextMenuTemplate:                          "js/templates/home/contextMenuTemplate.html!text",
    homeTemplate:                                 "js/templates/home/homeTemplate.html!text",
    loadingTemplate:                              "js/templates/home/loadingTemplate.html!text",
    menuTemplate:                                 "js/templates/home/menuTemplate.html!text",
    offlineTemplate:                              "js/templates/home/offlineTemplate.html!text",
    userMessageTemplate:                          "js/templates/home/userMessageTemplate.html!text",
    loginTemplate:                                "js/templates/login/loginTemplate.html!text",
    composeMessageTemplate:                       "js/templates/mail/composeMessageTemplate.html!text",
    detailMessageTemplate:                        "js/templates/mail/detailMessageTemplate.html!text",
    editFolderTemplate:                           "js/templates/mail/editFolderTemplate.html!text",
    foldersMenuListTemplate:                      "js/templates/mail/foldersMenuListTemplate.html!text",
    messagesListItemsTemplate:                    "js/templates/mail/messagesListItemsTemplate.html!text",
    messagesListTemplate:                         "js/templates/mail/messagesListTemplate.html!text",
    previewAttachmentMessageTemplate:             "js/templates/mail/previewAttachmentMessageTemplate.html!text",
    detailContentTemplate:                        "js/templates/master/detailContentTemplate.html!text",
    primaryContentTemplate:                       "js/templates/master/primaryContentTemplate.html!text",
    settingsAboutListTemplate:                    "js/templates/settings/settingsAboutListTemplate.html!text",
    settingsChangePasswordListTemplate:           "js/templates/settings/settingsChangePasswordListTemplate.html!text",
    settingsCreditsListTemplate:                  "js/templates/settings/settingsCreditsListTemplate.html!text",
    settingsFaqListTemplate:                      "js/templates/settings/settingsFaqListTemplate.html!text",
    settingsListTemplate:                         "js/templates/settings/settingsListTemplate.html!text",
    settingsMailSignatureListTemplate:            "js/templates/settings/settingsMailSignatureListTemplate.html!text",
    settingsResultsPerPageListTemplate:           "js/templates/settings/settingsResultsPerPageListTemplate.html!text",
    settingsSupportListTemplate:                  "js/templates/settings/settingsSupportListTemplate.html!text",



    //LIBRARIES
    underscore:               "bower_components/underscore/underscore-min.js",
    backbone:                 "bower_components/backbone/backbone-min.js",
    webcomponents:            "bower_components/webcomponentsjs/webcomponents-lite.min.js",
    jquery:                   "bower_components/jquery/dist/jquery.min.js",
    jquery_migrate:           "bower_components/jquery-migrate/jquery-migrate.min.js",
    moment:                   "bower_components/momentjs/moment.js",
    localstorage:             "bower_components/backbone.browserStorage/backbone.browserStorage.js",
    jqueryui:                 "bower_components/jquery-ui/jquery-ui.min.js",
    material:                 "bower_components/material-design-lite/material.js",
    tinysort:                 "bower_components/tinysort/dist/tinysort.min.js",
    tinysort_charorder:       "bower_components/tinysort/dist/tinysort.charorder.min.js",
    tinysort_open:            "bower_components/tinysort/dist/jquery.tinysort.min.js",
    jquery_autogrow:          "bower_components/autogrow-textarea/jquery.autogrowtextarea.min.js",
    tweenmax:                 "bower_components/gsap/src/minified/TweenMax.min.js",
    linkify:                  "bower_components/linkifyjs/src/linkified.js",
    jquery_linkify:           "bower_components/linkifyjs/src/jquery.linkify.js",
    wijmo:                    "bower_components/wijmo/wijmo/jquery.wijmo.wijutil.js",
    wijdialog:                "bower_components/wijmo/wijmo/jquery.wijmo.wijdialog.js",
    jqueryui_datepicker_ptBR: "js/libs/lang/jquery.ui.datepicker-pt-BR.js",
    moment_ptBR:              "js/libs/lang/moment-pt-BR.js",
    expressoAPI:              "js/libs/expresso/expressoAPI.js",
    expressoIM:               "js/libs/expresso/expressoIM.js",
    expressoService:          "js/libs/expresso/expressoService.js",
    im:                       "js/libs/messenger/im.js",
    jquery_xmpp:              "js/libs/jquery.xmpp/jquery.xmpp.js",
    autocomplete:             "js/libs/jquery.backbone.widget/jquery.backbone.widgets.js",
    contextmenu:              "js/libs/jquery.contextmenu/jquery.contextMenu.js",

  },
  shim: {
    app: {
      deps: [ 'webcomponents',
  'jquery', 
  'jqueryui',
  'underscore', 
  'backbone',
  'Shared',
  'material',
  'router'],
    },
    main: {
      deps: [ "app" ],
    },
    jquery: {
       exports: 'jQuery'
    },
    jquery_migrate: {
      deps: [
        "jquery",
      ],
    },
    backbone: {
      deps: [
        "jquery",
        "underscore",
      ],
    },
    material: {
      deps: [
        "jquery",
      ],
      exports: "Material"
    },
    jqueryui: {
      deps: [
        "jquery"
      ],
      exports: '$',
    },
    Shared: {
      deps: [
      'underscore',
      'jquery',
      'backbone',
      'expressoAPI',
      'expressoIM',
      'expressoService',
      ],
       exports: 'Shared'
    },
    localstorage: {
      deps: [
        "underscore",
        "jquery",
        "backbone"
      ],
      exports: "Store"
    },
    moment: {
      deps: [
        "jquery"
      ],
      exports: "moment"
    },
    wijmo: {
      deps: [
        "jquery",
        "jquery_migrate",
        "jqueryui"
      ],
      exports: "wijmo"
    },
    wijdialog: {
      deps: [
        "jquery",
        "jquery_migrate",
        "jqueryui",
        "wijmo"
      ],
      exports: "wijdialog"
    },
    tinysort: {
      deps: [
        "jquery"
      ],
      exports: "tinysort"
    },
    tinysort_charorder: {
      deps: [
        "jquery",
        "tinysort"
      ],
    },
    tinysort_open: {
      deps: [
        "jquery",
        "tinysort_charorder",
        "tinysort"
      ],
      exports: "tinysort_open"
    },
    jquery_autogrow: {
      deps: [
        "jquery"
      ],
      exports: "jquery_autogrow"
    },
    im: {
      deps: [
        "jquery",
        "jquery_migrate",
        "wijmo",
        "wijdialog",
        "tinysort",
        "tinysort_open",
        "contextmenu",
        "linkify",
        "jquery_linkify",
        "jquery_autogrow"
      ],
      exports: "im"
    },
    underscore: {
      exports: "_"
    },
    linkify: {
      deps: [
        "jquery"
      ]
    },
    jquery_linkify: {
      deps: [
        "jquery",
        "linkify"
      ]
    },
    tweenmax: {
      deps: [
        "jquery"
      ]
    },
    autocomplete: {
      deps: [
        "jquery"
      ]
    },
    jqueryui_datepicker_ptBR: {
      deps: [
        "jquery",
        "jqueryui"
      ]
    },
    moment_ptBR: {
      deps: [
        "jquery",
        "moment"
      ]
    },
    enforceDefine: false
  },
  packages: [

  ]
};

  if( typeof exports !== 'undefined' ) {
    if( typeof module !== 'undefined' && module.exports ) {
      exports = module.exports = config;
    }
    exports.config = config;
  } 
  else {
    System.config(config);
  }

})();