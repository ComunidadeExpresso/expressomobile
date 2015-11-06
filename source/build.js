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
        underscore:     "../bower_components/underscore/underscore-min",
        backbone:       "../bower_components/backbone/backbone-min",
        webcomponents:  "../bower_components/webcomponentsjs/webcomponents",
        jquery:         "../bower_components/jquery/dist/jquery.min",
        jquery_migrate: "../bower_components/jquery-migrate/jquery-migrate.min",
        moment:         "../bower_components/momentjs/moment",
        localstorage:   "../bower_components/backbone.browserStorage/backbone.browserStorage",
        jqueryui:       "../bower_components/jquery-ui/jquery-ui.min",
        material:       "../bower_components/material-design-lite/material",
        tinysort:       "../bower_components/tinysort/dist/jquery.tinysort.min",



        Shared:         "shared",
        expressoAPI:    "libs/expresso/expressoAPI",
        expressoIM:     "libs/expresso/expressoIM",
        expressoService:"libs/expresso/expressoService",
        

        im:             "libs/messenger/im",
        jquery_xmpp:    "libs/jquery.xmpp/jquery.xmpp",
        
        autocomplete:   "libs/jquery.backbone.widget/jquery.backbone.widgets",
        
        jqueryui_datepicker_ptBR: "libs/lang/jquery.ui.datepicker-pt-BR",
        jquery_autogrow: "libs/jquery.autogrow/jquery.autogrowtextarea",
        wijmo:           "libs/jquery.wijmo/jquery.wijmo.min",
        wijdialog:       "libs/jquery.wijmo/jquery.wijmo.wijdialog",
        linkify:          "libs/linkify/ba-linkify",

        contextmenu:      "libs/jquery.contextmenu/jquery.contextMenu",
        tweenmax:         "libs/tweenmax/TweenMax.min",
        templates:        "../templates"

        //DEVELOPMENT-TEST
        htmlgl:       "../bower_components/htmlgl/dist/htmlgl.min",
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
          enforceDefine: true,
    }
})