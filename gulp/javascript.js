const {
    source,
    prod,
    dist
} = require('./vars');

const gulp = require('gulp');
const wrap = require("gulp-wrap");
const error = require('./error');
// JS
const babel = require('gulp-babel');
const jsminify = require('gulp-minify');
const browserify = require('gulp-browserify')
const sourcemap = require('gulp-sourcemaps');

module.exports = {
    'js': () => {
        return gulp.src([`${source}/js/app.js`, `!${source}/components/**/*.js`])
            .pipe(sourcemap.init())
            .pipe(browserify())
            .on('error', error)
            .pipe(sourcemap.write())
            .on('error', error)
            .pipe(gulp.dest(`${prod}/js/`));
    },

    'js:dist': () => {
        return gulp.src(`${source}/js/app.js`)
            .pipe(append(`@babel/polyfill`))
            .pipe(append(`../components/all.js`))
            .pipe(component())
            .pipe(browserify())
            .on('error', error)
            .pipe(babel({
                presets: ['@babel/env']
            }))
            .on('error', error)
            .pipe(jsminify())
            .pipe(wrap({
                src: `./gulp/templates/js/index.txt`
            }))
            .pipe(gulp.dest(`${dist}/js/`));
    },
}