'use strict';
const vars = require('./gulp/vars');
const clean = require('gulp-clean');

// Gulp
const {
    task,
    series,
    parallel,
    watch,
    src,
    dest
} = require('gulp');

const gls = require('gulp-live-server');
let server = gls.new('gulp/server.js');

// Tasks
const addTasks = file => Object.entries(require(file)).forEach(tasks => task(...tasks));

// SCSS Tasks
addTasks('./gulp/sass');

// JS Tasks
addTasks('./gulp/javascript');

// Copy Files to dist and prod
addTasks('./gulp/copy');

task('clean', function (cb) {
    src(`${vars.dist}/`)
        .pipe(clean())
        .on('end', cd);
})

// Compile tasks
// 
task('build', series('sass:dist', 'js:dist', 'copy:dist'));

task('server', function () {
    return server.start();
});

const path = require('path');

task('watch', function () {
    watch(vars.watch.js, series('js'));
});

task('default', series('js', 'copy', parallel('watch', 'server')));