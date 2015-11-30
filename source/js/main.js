
System.config({
  map: {
    text : "text.js"
  },
  paths: {
    templates:           "../templates",
    Shared:              "shared.js",
    shared:              "shared.js",
    router:              "router.js",
    underscore:          "../bower_components/underscore/underscore-min.js",
    backbone:            "../bower_components/backbone/backbone-min.js",
    webcomponents:       "../bower_components/webcomponentsjs/webcomponents.js",
    jquery:              "../bower_components/jquery/dist/jquery.min.js",
    jquery_migrate:      "../bower_components/jquery-migrate/jquery-migrate.min.js",
    moment:              "../bower_components/momentjs/moment.js",
    localstorage:        "../bower_components/backbone.browserStorage/backbone.browserStorage.js",
    jqueryui:            "../bower_components/jquery-ui/jquery-ui.min.js",
    material:            "../bower_components/material-design-lite/material.js",
    tinysort:            "../bower_components/tinysort/dist/tinysort.min.js",
    tinysort_charorder:  "../bower_components/tinysort/dist/tinysort.charorder.min.js",
    tinysort_open:       "../bower_components/tinysort/dist/jquery.tinysort.min.js",
    jquery_autogrow:     "../bower_components/autogrow-textarea/jquery.autogrowtextarea.min.js",
    tweenmax:            "../bower_components/gsap/src/minified/TweenMax.min.js",
    linkify:             "../bower_components/linkifyjs/src/linkified.js",
    jquery_linkify:      "../bower_components/linkifyjs/src/jquery.linkify.js",
    wijmo:               "../bower_components/wijmo/wijmo/jquery.wijmo.wijutil.js",
    wijdialog:           "../bower_components/wijmo/wijmo/jquery.wijmo.wijdialog.js",

    //LANGUAGE FILES
    jqueryui_datepicker_ptBR: "libs/lang/jquery.ui.datepicker-pt-BR.js",
    moment_ptBR:              "libs/lang/moment-pt-BR.js",

    expressoAPI:        "libs/expresso/expressoAPI.js",
    expressoIM:         "libs/expresso/expressoIM.js",
    expressoService:    "libs/expresso/expressoService.js",
    im:                 "libs/messenger/im.js",
    jquery_xmpp:        "libs/jquery.xmpp/jquery.xmpp.js",



    //MUST BE CHANGED TO BOWER

    //LOCAL VERSION HAS CHANGES IN CODE
    autocomplete:       "libs/jquery.backbone.widget/jquery.backbone.widgets.js",
    
    //MUST BE REPLACED BY MATERIAL DESIGN
    contextmenu:        "libs/jquery.contextmenu/jquery.contextMenu.js",
    
    //DEVELOPMENT - IN TEST
    // htmlgl:           "../bower_components/htmlgl/dist/htmlgl.min"
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
});

require([
  // Load our app module and pass it to our definition function
  'app.js'

], function(App){
  // The "app" dependency is passed in as "App"
  // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
  App.initialize();
});
