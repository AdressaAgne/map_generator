const {
    source,
    prod,
    dist,
    project_name,
    sizes,
    sizesDist
} = require('./vars');

const gulp = require('gulp');

const imagemin = require('gulp-imagemin');

// Lossy
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminSvgo = require('imagemin-svgo');

// Lossless
const imageminJpegtran = require('imagemin-jpegtran');
const imageminOptipng = require('imagemin-optipng');

const responsive = require('gulp-responsive-images');
const error = require('./error');
const newer = require('gulp-newer');
var glob = require("glob")

const cliprogress = require('cli-progress');
var progress = require('progress-stream');

const createOptions = (sizes) => {
    let options = {};
    const extensions = ['png', 'gif', 'jpg'].join(',');
    const callback = (size, i) => {
        return {
            width: size,
            rename: {
                suffix: size == 32 ? '' : `-${size}`
            }
        }
    };
    options[`!**/*{-small,-big,-portrett}.{${extensions}}`] = sizes.map(callback);
    options[`**/*-big.{${extensions}}`] = sizes.filter(size => size >= 640).map(callback);
    options[`**/*-small.{${extensions}}`] = sizes.filter(size => size <= 1280).map(callback);
    options[`**/*-portrett.{${extensions}}`] = sizes.filter(size => size <= 768).map(callback);

    return options;
}

let optionsDist = createOptions(sizesDist);
let options = createOptions(sizes);


let imagemin_use = [
    imageminMozjpeg({
        quality: 90
    }),
    imageminJpegtran({
        stripAll: true,
        stripExif: true,
    }),
    imageminOptipng({
        bitDepthReduction: true,
        colorTypeReduction: true,
        paletteReduction: true,
    }),
    imageminSvgo({
        plugins: [{
            removeViewBox: false
        }]
    })
];
const _colors = require('colors');
const createProgressBar = (src) => {
    let fileSize = glob.sync(src).length;
    const bar = new cliprogress.SingleBar({
        /**
         * percentage: 9.05,
         * transferred: 949624,
         * length: 10485760,
         * remaining: 9536136,
         * eta: 10,
         * runtime: 0,
         * delta: 295396,
         * speed: 949624
         */
        format: _colors.cyan('[{bar}]') + ' {percentage}% ({value}/{total})'
    });

    var stream = progress({
        length: fileSize,
        objectMode: true
    });

    bar.start(fileSize, 0);

    stream.on('progress', (stats, a) => {
        bar.update(stats.transferred, stats)
    });

    return {
        bar,
        stream
    };
}

module.exports = {
    'compress:images:dist': cb => {
        const src = `${dist}/images/**/*.{jpg,png,svg}`;
        let {
            stream,
            bar
        } = createProgressBar(src);

        gulp.src(src)
            .pipe(stream)
            .pipe(imagemin(imagemin_use))
            .pipe(gulp.dest(`${dist}/images`))
            .on('end', () => {
                bar.stop();
                cb();
            });
    },

    'compress:gfx:dist': cb => {
        const src = `${dist}/gfx/**/*.{jpg,png,svg}`;
        let {
            stream,
            bar
        } = createProgressBar(src);

        gulp.src(src)
            .pipe(stream)
            .pipe(imagemin(imagemin_use))
            .pipe(gulp.dest(`${dist}/gfx`))
            .on('end', () => {
                bar.stop();
                cb();
            });
    },
    'resize:images:dist': cb => {
        const src = `${source}/images/**/*`;
        let {
            stream,
            bar
        } = createProgressBar(src);

        gulp.src(src)
            .pipe(stream)
            .pipe(responsive(optionsDist))
            .pipe(gulp.dest(`${dist}/images`))
            .on('end', () => {
                bar.stop();
                cb();
            });
    },

    'compress': cb => {
        console.warn('compress is deprecated, use $ gulp resize');
        cb();
    },

    'resize': cb => {

        const src = `${source}/images/**/*`;
        let {
            stream,
            bar
        } = createProgressBar(src);

        gulp.src(src)
            .pipe(stream)
            .pipe(newer(`${prod}/images`))
            .pipe(responsive(options))
            .pipe(gulp.dest(`${prod}/images`))
            .on('end', e => {
                bar.stop();
                cb();
            })
    }
}