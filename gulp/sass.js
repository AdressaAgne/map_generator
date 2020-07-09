const {
    source,
    prod,
    dist,
    url
} = require('./vars');

const gulp = require('gulp');
const wrap = require("gulp-wrap");

const error = require('./error');

// CSS
const sass = require('gulp-sass');
sass.compiler = require('node-sass');

const autoprefixer = require('gulp-autoprefixer');

const cssnano = require('gulp-cssnano');
const sourcemap = require('gulp-sourcemaps');


module.exports = {
    'sass': () => {
        return gulp.src(`${source}/scss/*.scss`)
            .pipe(sourcemap.init())
            .pipe(wrap({
                src: './gulp/templates/css/url.txt'
            }, {
                url: '',
                debug: true,
                task: 'watch'
            }))
            .pipe(sass().on('error', sass.logError))
            .pipe(autoprefixer({
                cascade: false
            }))
            .pipe(sourcemap.write())
            .on('error', error)
            .pipe(gulp.dest(`${prod}/css/`));
    },

    'sass:dist': () => {
        return gulp.src(`${source}/scss/*.scss`)
            .pipe(wrap({
                src: './gulp/templates/css/url.txt'
            }, {
                url: url,
                debug: false,
                task: 'build'
            }))
            .pipe(sass().on('error', sass.logError))
            .pipe(autoprefixer({
                cascade: false
            }))
            .pipe(cssnano())
            .pipe(wrap({
                src: './gulp/templates/css/index.txt'
            }))
            .pipe(gulp.dest(`${dist}/css/`));
    },

    'sass:dist:inline': () => {
        return gulp.src(`${source}/scss/*.scss`)
            .pipe(wrap({
                src: './gulp/templates/css/url.txt'
            }, {
                url: url,
                debug: false,
                task: 'build:inline'
            }))
            .pipe(sass().on('error', sass.logError))
            .pipe(autoprefixer({
                cascade: false
            }))
            .pipe(cssnano())
            .pipe(wrap({
                src: './gulp/templates/css/inline.txt'
            }))
            .pipe(gulp.dest(`${dist}/css/`));
    }
}