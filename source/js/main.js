require.config({
  urlArgs: "bust=14411090641240",
  paths: {
    underscore:     "../bower_components/underscore/underscore-min",
    backbone:       "../bower_components/backbone/backbone-min",
    webcomponents:  "../bower_components/webcomponentsjs/webcomponents",
    jquery:         "../bower_components/jquery/dist/jquery.min",
    jquery_migrate: "../bower_components/jquery-migrate/jquery-migrate.min",
    moment:         "../bower_components/momentjs/moment",
    localstorage:   "../bower_components/backbone.browserStorage/backbone.browserStorage",
    jqueryui:       "../bower_components/jquery-ui/jquery-ui.min",
    material:       "../bower_components/material-design-lite/material",

    Shared:         "shared",
    
    expressoAPI:    "libs/expresso/expressoAPI",
    expressoIM:     "libs/expresso/expressoIM",
    expressoService:"libs/expresso/expressoService",
    

    im:             "libs/messenger/im",
    jquery_xmpp:    "libs/jquery.xmpp/jquery.xmpp",
    
    autocomplete:   "libs/jquery.backbone.widget/jquery.backbone.widgets",
    
    jqueryui_datepicker_ptBR: "libs/jquery-ui/jquery.ui.datepicker-pt-BR",
    jquery_autogrow: "libs/jquery.autogrow/jquery.autogrowtextarea",
    wijmo:           "libs/jquery.wijmo/jquery.wijmo.min",
    wijdialog:       "libs/jquery.wijmo/jquery.wijmo.wijdialog",
    linkify:          "libs/linkify/ba-linkify",
    tinysort:          "libs/jquery.tinysort/jquery.tinysort.min",
    tinysort_open:    "libs/jquery.tinysort/jquery.opensource.min",
    contextmenu:      "libs/jquery.contextmenu/jquery.contextMenu",
    tweenmax:         "libs/tweenmax/TweenMax.min",
    templates:        "../templates"
  },
  shim: {
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
    Shared: {
      deps: [
      'underscore',
      'jquery',
      'backbone',
      'expressoAPI',
      'expressoIM',
      'views/home/UserMessageView',
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
        "jquery_migrate"
      ],
      exports: "wijmo"
    },
    wijdialog: {
      deps: [
        "jquery",
        "jquery_migrate",
        "wijmo"
      ],
      exports: "wijdialog"
    },
    tinysort: {
      deps: [
        "jquery",
        "tinysort_open"
      ],
      exports: "tinysort"
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
        "jquery_autogrow"
      ],
      exports: "im"
    },
    underscore: {
      exports: "_"
    },
    jqueryui: {
      deps: [
        "jquery"
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
    enforceDefine: true
  },
  packages: [

  ]
});

require([
  // Load our app module and pass it to our definition function
  'app',

], function(App){
  // The "app" dependency is passed in as "App"
  // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
  App.initialize();
});
