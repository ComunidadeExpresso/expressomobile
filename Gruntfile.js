module.exports = function(grunt) {
    var path = require('path');
    var cfg = require('./package.json');
    grunt.initConfig({
        
    });

   
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    // grunt.loadNpmTasks('grunt-touch');

    grunt.registerTask('jsmin', 'Create a new release', function () {
        var done = this.async();
        var child_process = require('child_process');
        var exec = child_process.exec;
        var callback = function (err, stdout, stderr) {
            grunt.log.write(stdout);
            if (err) {
                grunt.log.write('build failed with error code '+err.code);
                grunt.log.write(stderr);
                done(false);
            } else
                done();
        };
        var rjsext = (process.platform === 'win32') ? '.cmd' : '';
        var rjs = '"' + 'r.js' + rjsext + '"';
        exec(rjs + ' -o ./source/build.js ', callback);
        
    });

};
