module.exports = function (dir) {
    'use strict';

    var fs      = require('fs')
    ,   gulp    = require('gulp')
    ,   path    = require('path')
    ,   async   = require('async');

    dir = path.join(process.cwd(), dir);

    function readFile(file) {
        file = path.join(dir, file);

        if(path.extname(file) == '.js'){
            gulp.task(path.basename(file, '.js'), require(file)(gulp));
        }
    }

    var files = fs.readdirSync(dir);

    for(var index in files){
        readFile(files[index]);
    }

    return gulp;
};
