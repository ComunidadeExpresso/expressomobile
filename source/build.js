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
        expressoAPI: 'libs/expresso/expressoAPI',
        expressoIM: 'libs/expresso/expressoIM',
        expressoService: 'libs/expresso/expressoService',
        jqueryui: 'libs/jquery-ui/js/jquery-ui-1.10.3.custom.min',
        jquery_touchwipe: 'libs/jquery.touchwipe/jquery.touchwipe.min',
        jquery_xmpp: 'libs/jquery.xmpp/jquery.xmpp',
        moment: 'libs/moment/moment.min',
        autocomplete: 'libs/jquery.backbone.widget/jquery.backbone.widgets',
        jqueryui_datepicker_ptBR: 'libs/jquery-ui/development-bundle/ui/i18n/jquery.ui.datepicker-pt-BR',
        backbone_widget: 'libs/jquery.backbone.widget/jquery.backbone.widgets',
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
        }
    }
})