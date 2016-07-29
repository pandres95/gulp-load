/* jshint
  node:true, strict: true, undef: true, unused: true, esnext: true,
  laxcomma: true */

function loadTasks(directory, base, environment, gulp, configuration) {
    'use strict';

    const FS    = require('fs');
    const path  = require('path');
    let results = [];

    let list    = FS.readdirSync(directory);
    let pending = list.length;

    if (!pending) return {
        name: path.basename(directory),
        type: 'folder',
        children: results
    };

    list.forEach(file => {
        let _file = path.resolve(directory, file);

        let stat = FS.statSync(_file);
        if (stat && stat.isDirectory()) {
            let folderName  = path.basename(_file)
            ,   _base       = (
                (base === '') && `${folderName}`
            ) || `${base}:${folderName}`;
            results.push({
                name: path.basename(file),
                type: 'folder',
                children: loadTasks(
                    _file, _base, environment, gulp, configuration
                )
            });
        } else {
            let fileName = path.basename(_file);
            results.push({
                type: 'file',
                name: fileName
            });
            if(path.extname(_file) === '.js'){
                let taskName = path.basename(file, '.js');
                if(taskName === '_') {
                    taskName = '';
                } else {
                    taskName = `:${taskName}`;
                }
                gulp.task(`${base}${taskName}`, require(_file)(
                    gulp, configuration,
                    environment || process.env.NODE_ENV || 'local'
                ));
            }
        }
    });

    return results;
}

module.exports = function (directory, configuration, environment) {
    'use strict';

    const gulp  = require('gulp');
    const path  = require('path');

    let _directory = path.join(process.cwd(), directory);
    loadTasks(_directory, '', environment, gulp, configuration, () => {});

    return gulp;
};
