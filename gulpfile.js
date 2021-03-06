

var gulp            = require('gulp-help')(require('gulp'));
var fs              = require("fs");
var path            = require("path");
var connect         = require('gulp-connect-php');
var vulcanize       = require('gulp-vulcanize');
var crisper         = require('gulp-crisper');
var minifyCss       = require('gulp-minify-css');
var del             = require('del');
var url             = require('url');
var proxy           = require('proxy-middleware');
var browserSync     = require('browser-sync'); 
// var run             = require('gulp-run');

var argv = require('yargs')
    .default('buildFolder', 'www')
    .default('platform', 'web')
    .default('minifyscripts',0)
    .argv;

console.log("");
console.log("---------- Expresso Mobile ------------");
console.log("");
console.log("PLATFORM: " + argv.platform );
console.log("BUILD FOLDER: " + argv.buildFolder);
console.log("");
console.log("---------------------------------------");
console.log("");
console.log("");

//GLOBAL VARS
var buildFolder     = argv.buildFolder;
var buildPlatform   = argv.platform;
if (argv.minifyscripts == 0) {
    var minifyJS = false;
} else {
    var minifyJS = true;
}


var folder = path.resolve(__dirname, "../");

gulp.task('default', ['help']);

gulp.task('minify-css','Minify CSS files on the build folder.', function() {
  return gulp.src('source/css/styles.css')
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest(buildFolder + '/css'));
});

gulp.task('install','Install all project dependencies NODE_MODULES and BOWER.',function() {
    // run('npm install').exec();
    // run('bower install').exec();
});

gulp.task('minify-scripts','Minify JS files on the build folder.', function () {

    var configFile = './source/js/config.js';
    var p_baseURL = './source/';

    var Builder = require('systemjs-builder');
    var builder = new Builder();

    var config = require(configFile);
    builder.config(config);

    var configChanges = {
        baseURL : p_baseURL
    }

    builder.buildStatic('./source/js/main.js',buildFolder + '/js/main.js',{ minify: minifyJS , format: 'global', config: configChanges });

});


gulp.task('clean:build','Delete all files from build folder.', function () {
  return del([
    buildFolder + '/**/*',
  ]);
});

gulp.task('copy:build','Copy all necessary files from source to build folder.',function() {
    var folder = buildFolder;
    gulp.src(['source/api/**/*']).pipe(gulp.dest(folder + '/api/'));
    gulp.src(['source/api/.htaccess']).pipe(gulp.dest(folder + '/api/'));
    gulp.src(['source/bower_components/systemjs/**/*']).pipe(gulp.dest(folder + '/bower_components/systemjs/'));
    gulp.src(['source/bower_components/webcomponentsjs/**/*']).pipe(gulp.dest(folder + '/bower_components/webcomponentsjs/'));
    gulp.src(['source/bower_components/web-animations-js/**/*']).pipe(gulp.dest(folder + '/bower_components/web-animations-js/'));
    gulp.src(['source/bower_components/charto-polymer-shim/**/*']).pipe(gulp.dest(folder + '/bower_components/charto-polymer-shim/'));
    gulp.src(['source/bower_components/systemjs-plugin-html/**/*']).pipe(gulp.dest(folder + '/bower_components/systemjs-plugin-html/'));
    gulp.src(['source/bower_components/expandjs/**/*']).pipe(gulp.dest(folder + '/bower_components/expandjs/'));
    gulp.src(['source/bower_components/traceur/**/*']).pipe(gulp.dest(folder + '/bower_components/traceur/'));
    gulp.src(['source/bower_components/traceur-runtime/**/*']).pipe(gulp.dest(folder + '/bower_components/traceur-runtime/'));
    gulp.src(['source/bower_components/promise-polyfill/**/*']).pipe(gulp.dest(folder + '/bower_components/promise-polyfill/'));
    gulp.src(['source/bower_components/xp-observer/**/*']).pipe(gulp.dest(folder + '/bower_components/xp-observer/'));
    gulp.src(['source/elements/**/*']).pipe(gulp.dest(folder + '/elements/'));
    gulp.src(['source/imgs/**/*']).pipe(gulp.dest(folder + '/imgs/'));
    // gulp.src(['source/config/**/*']).pipe(gulp.dest(folder + '/config/'));
    // gulp.src(['source/css/**/*']).pipe(gulp.dest(folder + '/css/'));
    gulp.src(['source/css/m_platform_desktop.css']).pipe(gulp.dest(folder + '/css/'));
    gulp.src(['source/css/m_platform_ios.css']).pipe(gulp.dest(folder + '/css/'));

    gulp.src(['source/js/libs/cordova/**/*']).pipe(gulp.dest(folder + '/js/libs/cordova/'));
    gulp.src(['source/js/libs/mdl-iconfont/**/*']).pipe(gulp.dest(folder + '/js/libs/mdl-iconfont/'));
    gulp.src(['source/js/libs/mdl-iconfont/**/*']).pipe(gulp.dest(folder + '/js/libs/mdl-iconfont/'));
    gulp.src(['source/js/libs/messenger/**/*']).pipe(gulp.dest(folder + '/js/libs/messenger/'));
    gulp.src(['source/js/elements.js']).pipe(gulp.dest(folder + '/js/'));
    gulp.src(['source/js/config.js']).pipe(gulp.dest(folder + '/js/'));
    

    gulp.src(['source/.htaccess']).pipe(gulp.dest(folder + '/'));
    gulp.src(['source/index.php']).pipe(gulp.dest(folder + '/'));
    gulp.src(['source/cordova.js']).pipe(gulp.dest(folder + '/'));
    gulp.src(['source/servers.json']).pipe(gulp.dest(folder + '/'));

    gulp.src(['platforms/' + buildPlatform + '/platform_www/**/*']).pipe(gulp.dest(folder + '/'));
})


 
gulp.task('vulcanize','Minify Polymer Elements into a index.html and index.js on the build folder.', function () {
    return gulp.src('source/index.html')
        .pipe(vulcanize({
            abspath: '',
            excludes: [],
            stripExcludes: false,
            inlineScripts: false
        }))
        .on( "error", function( err ) {
            console.log( err );
        })
        .pipe(crisper({
            scriptInHead: false, 
            onlySplit: false
        }))
        .pipe(gulp.dest(buildFolder));
});

gulp.task('build', 'Create a new build on the build folder.', [ 'copy:build','minify-css', 'minify-scripts', 'vulcanize']);


gulp.task('connect', false, function() {
  connect.server({ port: 8000 });
});


gulp.task('browser-sync-source',false, function() {

    var proxyOptions = url.parse('http://127.0.0.1:8888/source/api/dispatch.php');
    proxyOptions.route = '/api';
    proxyOptions.method = 'POST';

    browserSync({
        open: true,
        port: 3000,
        server: {
            baseDir: "./source/",
            middleware: [proxy(proxyOptions)]
        }
    });
});

gulp.task('browser-sync-www',false, function() {
    var proxyOptions = url.parse('http://127.0.0.1:8888/www/api/dispatch.php');
    proxyOptions.route = '/api';
    proxyOptions.method = 'POST';

      // connect.server({}, function (){
        browserSync({
            open: true,
            port: 3000,
            server: {
                index: "index.html",
                baseDir: "./www/",
                middleware: [proxy(proxyOptions)]
            }
        });
      // });

    
}); 


var paths =  {
    css:            ['./source/css/styles.css' ,'./source/css/*.css'],
    js:             ['./source/js/**/*.js', './source/js/templates/**/*.html','./source/elements/**/*.js'],
    fixed_js:       ['./source/js/config.js', './source/js/elements.js','./source/platform.js'],
    polymer_html:   ['./source/elements/**/*.html'],
};

var paths_www =  {
    css:            ['./www/css/*.css'],
    js:             ['./www/js/**/*.js','./www/*.js'],
    polymer_html:   ['./www/*.html'],
};

// Stream the style changes to the page
gulp.task('reload-css', false, function() {
    gulp.src(paths.css).pipe(browserSync.reload({stream: true}));
});

gulp.task('reload-js', false, function() {
    gulp.src(paths.js).pipe(browserSync.reload({stream: true}));
});

var tinylr;
gulp.task('livereload', function() {
  tinylr = require('tiny-lr')();
  tinylr.listen(
    );
});

function notifyLiveReload(event) {
  var fileName = require('path').relative(__dirname + "/www/", event.path);

  console.log("liveReload: " + fileName);

  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}

function copyFixedJS(evt) {
    var folder = buildFolder;
    gulp.src(['source/js/elements.js']).pipe(gulp.dest(folder + '/js/'));
    gulp.src(['source/js/config.js']).pipe(gulp.dest(folder + '/js/'));
    gulp.src(['source/js/platform.js']).pipe(gulp.dest(folder + '/js/'));
    notifyLiveReload(evt);
}

gulp.task('watch-source', function() {
  gulp.watch(paths.js, notifyLiveReload);
});

gulp.task('watch-fixed-js', function() {
  gulp.watch(paths.fixed_js, copyFixedJS);
});



// Watch Files For Changes
gulp.task('watch', false, function() {
    gulp.watch(paths.css, ['minify-css']);
    gulp.watch(paths.polymer_html, ['vulcanize']);
    gulp.watch(paths.js, ['minify-scripts']);
    gulp.watch(paths_www.js, notifyLiveReload);
    gulp.watch(paths_www.css, notifyLiveReload);
    gulp.watch(paths_www.html, notifyLiveReload);
});

gulp.task('serve', 'Starts a local server on the folder (source).',['browser-sync-source', 'livereload' , 'watch-source', 'connect']);
gulp.task('serve-www', 'Starts a local server on the build folder (www).',['browser-sync-www', 'livereload', 'watch','watch-fixed-js', 'connect']);



