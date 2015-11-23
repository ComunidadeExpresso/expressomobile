var gulp = require('gulp'),
    connect = require('gulp-connect-php');

gulp.task('connect', function() {
    connect.server({});
});

gulp.task('default', ['connect']);

var url = require('url');
var proxy = require('proxy-middleware');
var browserSync = require('browser-sync'); 

var paths =  {
    css: [
    './source/css/*.css', 
    '!./node_modules/*',
    './source/elements/*.html',
    './source/js/*.js',
    './source/templates/*.html']
};

gulp.task('browser-sync-source', function() {
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

gulp.task('browser-sync-www', function() {
    var proxyOptions = url.parse('http://127.0.0.1:8000/www/api/dispatch.php');
    proxyOptions.route = '/api';
    proxyOptions.method = 'POST';

   
    browserSync({
        open: true,
        port: 3000,
        server: {
            baseDir: "./www/",
            middleware: [proxy(proxyOptions)]
        }
    });
});

// Stream the style changes to the page
gulp.task('reload-css', function() {
    gulp.src(paths.css)
        .pipe(browserSync.reload({stream: true}));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(paths.css, ['reload-css']);
});

gulp.task('serve', ['browser-sync-source', 'watch', 'connect']);
gulp.task('serve-www', ['browser-sync-www', 'watch', 'connect']);