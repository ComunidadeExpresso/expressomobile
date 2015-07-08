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
        jquery: 'libs/jquery/jquery-min',
        underscore: 'libs/underscore/underscore-min',
        iscroll: 'libs/iscroll/src/iscroll',
        backbone: 'libs/backbone/backbone-min',
        //localstorage: 'libs/Backbone.localStorage/backbone.localstorage',
        expressoAPI: 'libs/expresso/expressoAPI',
        expressoIM: 'libs/expresso/expressoIM',
        expressoService: 'libs/expresso/expressoService',
        bootstrap: 'libs/bootstrap/js/bootstrap.min',
        // jqueryui: 'libs/jquery-ui_old/js/jquery-ui-1.10.3.custom.min',
        jqueryui: 'libs/jquery-ui/jquery-ui.min',
        im: 'libs/messenger/im',
        jquery_xmpp: 'libs/jquery.xmpp/jquery.xmpp',
        moment: 'libs/moment/moment.min',
        jquery_touchwipe: 'libs/jquery.touchwipe/jquery.touchwipe.min',
        autocomplete: 'libs/jquery.backbone.widget/jquery.backbone.widgets',
        jquery_migrate: 'libs/jquery-migrate/jquery-migrate-1.2.1.min',
        jqueryui_datepicker_ptBR: 'libs/jquery-ui/jquery.ui.datepicker-pt-BR',
        jquery_scrollTo: 'libs/jquery.scrollTo/jquery.scrollTo',
        jquery_autogrow: 'libs/jquery.autogrow/jquery.autogrowtextarea',
        wijmo : 'libs/wijmo/jquery.wijmo.min',
        wijdialog : 'libs/wijmo/jquery.wijmo.wijdialog',
        linkify: 'libs/linkify/ba-linkify',
        tinysort: 'libs/sort/jquery.tinysort.min',
        //tinysort_char: 'libs/sort/jquery.tinysort.charorder.min',
        tinysort_open: 'libs/sort/jquery.opensource.min',
        contextmenu: 'libs/contextmenu/jquery.contextMenu',
        templates: '../templates'

    },
    shim: {
        backbone: {
            deps: ['jquery','underscore'],
            exports: 'Backbone'
        },
        moment: {
            deps: ['jquery'],
            exports: 'moment'
        },
        wijmo: {
            deps: ['jquery','jquery_migrate'],
            exports: 'wijmo'
        },
        wijdialog: {
            deps: ['jquery','jquery_migrate','wijmo'],
            exports: 'wijdialog'
        },
        jquery_autogrow: {
            deps: ['jquery'],
            exports: 'jquery_autogrow'
          },
        tinysort: {
            deps: ['jquery','tinysort_open'],
            exports: 'tinysort'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'bootstrap'
        },
        im: {
            deps: ['jquery','jquery_migrate','wijmo','tinysort','tinysort_open','contextmenu','linkify'],
            exports: 'im'
        },
        // expressoAPI: {
        //     deps: ['jquery','underscore','backbone','shared'],
        //     exports: 'expressoAPI'
        // },
        underscore: {
            exports: "_"
        },
        jqueryui: {
            deps: ['jquery']
        },
        jquery_touchwipe: {
            deps: ['jquery']
        },
        autocomplete: {
            deps: ['jquery']
        },
        jqueryui_datepicker_ptBR: {
            deps: ['jquery', 'jqueryui']
        },
    }
})