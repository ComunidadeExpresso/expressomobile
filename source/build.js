({
    appDir: './',
    baseUrl: './js',
    dir: '../www',
    //urlArgs: "bust=" + (new Date()).getTime(),
    modules: [
        {
            name: 'main'
        }
    ],
    fileExclusionRegExp: /^((r|build)\.js|.git|README.md|servers.json.config|servers.json|LICENSE|config.xml)$/,
    optimizeCss: 'standard',
    removeCombined: true,
    paths: {
        templates:          "../templates",
        Shared:             "shared",
        underscore:         "../bower_components/underscore/underscore-min",
        backbone:           "../bower_components/backbone/backbone-min",
        webcomponents:      "../bower_components/webcomponentsjs/webcomponents",
        jquery:             "../bower_components/jquery/dist/jquery.min",
        jquery_migrate:     "../bower_components/jquery-migrate/jquery-migrate.min",
        moment:             "../bower_components/momentjs/moment",
        localstorage:       "../bower_components/backbone.browserStorage/backbone.browserStorage",
        jqueryui:           "../bower_components/jquery-ui/jquery-ui.min",
        material:           "../bower_components/material-design-lite/material",

        tinysort:            "../bower_components/tinysort/dist/tinysort.min",
        tinysort_charorder:  "../bower_components/tinysort/dist/tinysort.charorder.min",
        tinysort_open:       "../bower_components/tinysort/dist/jquery.tinysort.min",
        jquery_autogrow:     "../bower_components/autogrow-textarea/jquery.autogrowtextarea.min",
        tweenmax:            "../bower_components/gsap/src/minified/TweenMax.min",

        //LANGUAGE FILES
        jqueryui_datepicker_ptBR: "libs/lang/jquery.ui.datepicker-pt-BR",
        moment_ptBR:        "libs/lang/moment-pt-BR",

        expressoAPI:        "libs/expresso/expressoAPI",
        expressoIM:         "libs/expresso/expressoIM",
        expressoService:    "libs/expresso/expressoService",
        im:                 "libs/messenger/im",
        jquery_xmpp:        "libs/jquery.xmpp/jquery.xmpp",
        

        //MUST BE CHANGED TO BOWER

        //LOCAL VERSION HAS CHANGES IN CODE
        autocomplete:       "libs/jquery.backbone.widget/jquery.backbone.widgets",
        
        //CHECK VERSIONS
        wijmo:           "libs/jquery.wijmo/jquery.wijmo.min",
        wijdialog:       "libs/jquery.wijmo/jquery.wijmo.wijdialog",
        linkify:         "libs/linkify/ba-linkify",

        //MUST BE REPLACED BY MATERIAL DESIGN
        contextmenu:      "libs/jquery.contextmenu/jquery.contextMenu",
        
        //DEVELOPMENT - IN TEST
        htmlgl:           "../bower_components/htmlgl/dist/htmlgl.min"
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
          moment_ptBR: {
            deps: [
              "jquery",
              "moment"
            ]
          },
          enforceDefine: true,
    }
})