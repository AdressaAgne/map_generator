const {
    source,
    prod,
    dist,
    project_name
} = require('./vars');

const gulp = require('gulp');
const newer = require('gulp-newer');
const ignore_list = [
    '**/*.aml',
    '/css/**',
    '/images/**',
    '/js/**',
    '/components/**',
    '/scss/**',
];

module.exports = {

    'copy': () => gulp.src(`${source}/**/*`, {
            root: source,
            ignore: ignore_list
        })
        .pipe(newer(`${prod}/`))
        .pipe(gulp.dest(`${prod}/`)),

    'copy:dist': () => gulp.src(`${source}/**/*`, {
            root: source,
            ignore: ignore_list
        })
        .pipe(gulp.dest(`${dist}/`))

}