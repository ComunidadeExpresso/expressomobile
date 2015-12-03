

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
var run             = require('gulp-run');


//GLOBAL VARS
var buildFolder     = 'www';
var buildPlatform   = 'android';

var folder = path.resolve(__dirname, "../");


gulp.task('default', ['help']);

gulp.task('minify-css','Minify CSS files on the build folder.', function() {
  return gulp.src('source/css/styles.css')
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest(buildFolder + '/css'));
});

gulp.task('install','Install all project dependencies NODE_MODULES and BOWER.',function() {
    run('npm install').exec();
    run('bower install').exec();
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

    builder.buildStatic('./source/js/main_es6.js',buildFolder + '/js/main.js',{ minify: true , format: 'global', config: configChanges });

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
    gulp.src(['source/imgs/**/*']).pipe(gulp.dest(folder + '/imgs/'));
    // gulp.src(['source/config/**/*']).pipe(gulp.dest(folder + '/config/'));
    // gulp.src(['source/css/**/*']).pipe(gulp.dest(folder + '/css/'));
    gulp.src(['source/css/m_platform_**/*']).pipe(gulp.dest(folder + '/css/'));

    gulp.src(['source/js/libs/cordova/**/*']).pipe(gulp.dest(folder + '/js/libs/cordova/'));
    gulp.src(['source/js/libs/mdl-iconfont/**/*']).pipe(gulp.dest(folder + '/js/libs/mdl-iconfont/'));
    gulp.src(['source/js/libs/mdl-iconfont/**/*']).pipe(gulp.dest(folder + '/js/libs/mdl-iconfont/'));
    gulp.src(['source/js/libs/messenger/**/*']).pipe(gulp.dest(folder + '/js/libs/messenger/'));
    gulp.src(['source/js/config.js']).pipe(gulp.dest(folder + '/js/'));
    

    gulp.src(['source/.htaccess']).pipe(gulp.dest(folder + '/'));
    gulp.src(['source/index.php']).pipe(gulp.dest(folder + '/'));
    gulp.src(['source/cordova.js']).pipe(gulp.dest(folder + '/'));
    gulp.src(['servers.json']).pipe(gulp.dest(folder + '/'));

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
        .pipe(crisper({
            scriptInHead: false, 
            onlySplit: false
        }))
        .pipe(gulp.dest(buildFolder));
});

gulp.task('build', 'Create a new build on the build folder.', [ 'copy:build','minify-css', 'minify-scripts', 'vulcanize']);


gulp.task('connect', false, function() {
    connect.server({});
});



var paths =  {
    css:     ['./source/css/styles.css' ,'./source/css/*.css'],
    js:      ['./source/js/', './source/js/templates/*.html'],
    polymer: ['./source/elements/*.html'],
};

gulp.task('browser-sync-source',false, function() {

    var proxyOptions = url.parse('http://127.0.0.1:8000/source/api/dispatch.php');
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
    var proxyOptions = url.parse('http://127.0.0.1:8000/www/api/dispatch.php');
    proxyOptions.route = '/api';
    proxyOptions.method = 'POST';

    browserSync({
        open: true,
        port: 3000,
        server: {
            index: "index.html",
            baseDir: "./www/",
            middleware: [proxy(proxyOptions)]
        }
    });
});
// 

// Stream the style changes to the page
gulp.task('reload-css', false, function() {
    gulp.src(paths.css).pipe(browserSync.reload({stream: true}));
});

// Watch Files For Changes
gulp.task('watch', false, function() {
    gulp.watch(paths.css, ['reload-css']);
});

gulp.task('serve', 'Starts a local server on the folder (source).',['browser-sync-source', 'watch', 'connect']);
gulp.task('serve-www', 'Starts a local server on the build folder (www).',['browser-sync-www', 'watch', 'connect']);



