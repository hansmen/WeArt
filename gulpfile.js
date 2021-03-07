'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const runSequence = require('run-sequence');
const newer = require('gulp-newer');
const sourcemaps = require('gulp-sourcemaps');
const cheerio = require('gulp-cheerio');
const order = require('gulp-order');
const replaceString = require('gulp-replace');
const clean = require('gulp-clean');
const useref = require('gulp-useref');
const gulpif = require('gulp-if');
const shell = require('gulp-shell');
const size = require('gulp-size');

const concatCSS = require('gulp-concat-css');
const autoprefixer = require('gulp-autoprefixer');
const minifyCSS = require('gulp-clean-css')
const sass = require('gulp-sass');

const minifyJS = require('gulp-uglify');
const concatJS = require("gulp-concat");

const htmlhint = require('gulp-htmlhint');

const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const notify = require("gulp-notify");
const fileinclude = require('gulp-file-include');




// server
//-----------------------------------------------------------------------------------
// gulp.task('server', function () {
// 	browserSync.init({
// 		server: "./dist/",
// 		open: true,
// 		port: 8080,
// 		// startPath: "/index.html"
// 		notify: false

// 		// tunnel: true

// 	});
// });
gulp.task('server', function() {
    browserSync.init(({
        notify: false,
        port: 8080,
        open: true,
        server: {
            baseDir: ['./dist']
        }

    }));



});
gulp.task('server-reload', function() {
    browserSync.reload();
});


// html includes
//-----------------------------------------------------------------------------------
gulp.task('html-build', function() {
    return gulp.src('src/templates/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'src/templates/'
        }))


    .pipe(gulp.dest('dist'))

});

// html validate
// -----------------------------------------------------------------------------------
gulp.task('html-hint', function() {
    return gulp.src('dist/*.html')
        .pipe(htmlhint())
        .pipe(htmlhint.reporter())
});


// css libs
//-----------------------------------------------------------------------------------
gulp.task('css-libs', function() {
    return gulp.src('src/css/*.css')
        .pipe(concatCSS('libs.css'))
        .pipe(gulp.dest('dist/css'));
});


// sass
//-----------------------------------------------------------------------------------
gulp.task('sass', function() {
    return gulp.src('src/scss/style.scss')
        .pipe(sass({
            outputStyle: 'expand'
        }).on("error", notify.onError()))
        .pipe(sourcemaps.init())
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css'));
});


// svg sptrite
//-----------------------------------------------------------------------------------
gulp.task('svg-sprite', function() {
    return gulp.src('src/img/svg-source/*.svg')
        // .pipe(shell([
        //     'mkdir -p  dist/img'
        // ]))
        // minify svg
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        // remove attr
        .pipe(cheerio({
            run: function($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
                $('[xmlns]').removeAttr('xmlns');
            },
            parserOptions: {
                xmlMode: true
            }
        }))
        .pipe(replaceString('&gt;', '>'))
        // build svg sprite
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: "../dist/img/sprite.svg",
                    render: {
                        scss: {
                            dest: '../src/scss/standards/icon_default.scss',
                            template: 'src/scss/standards/icon_template.scss'
                        }
                    }
                }
            }
        }))
        .pipe(gulp.dest(''));
});


// img copy
//-----------------------------------------------------------------------------------
gulp.task('copy-img', function() {
    return gulp.src([
            '!src/img/svg-source/*svg',
            'src/img/**/*.{png,jpg,bmp,gif,svg}'
        ])
        // .pipe(shell([
        //     'mkdir -p  dist/img'
        // ]))
        .pipe(newer('dist/img/'))
        .pipe(size({
            title: 'new file',
            showFiles: true,
            showTotal: false,
        }))
        .pipe(gulp.dest('dist/img'));
});

// fonts copy
//-----------------------------------------------------------------------------------
gulp.task('copy-fonts', function() {
    return gulp.src('src/fonts/**/*.{ttf,otf,woff,woff2,eot,svg}')
        // .pipe(shell([
        //     'mkdir -p  dist/fonts'
        // ]))
        .pipe(newer('dist/fonts/'))
        .pipe(size({
            title: 'new file',
            showFiles: true,
            showTotal: false,
        }))
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('fonts:copy', function() {
    gulp.src('./assets/fonts/**/*.{eot,svg,ttf,woff,woff2}')
        .pipe(gulp.dest('./public/fonts/'));
});



// scripts
//-----------------------------------------------------------------------------------
gulp.task('js-libs', function() {
    return gulp.src('src/js/lib/*.js')
        .pipe(order([
            'moment.js'
        ]))
        .pipe(concatJS('libs.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('js-modules', function() {
    return gulp.src('src/js/*.js')
        .pipe(order([
            'variables.js',
            'functions.js'
        ]))
        .pipe(concatJS('common.js'))
        .pipe(gulp.dest('dist/js'));
});


// json copy
//-----------------------------------------------------------------------------------
gulp.task('copy-json', function() {
    return gulp.src('src/json/**/*.json')
        .pipe(shell([
            'mkdir -p  dist/json'
        ]))
        .pipe(newer('dist/json/'))
        .pipe(gulp.dest('dist/json'));
});

// watch
//-----------------------------------------------------------------------------------
gulp.task('watch', function() {
    gulp.watch(['src/templates/*.html', 'src/chunks/*.html'], function() {
        runSequence('html-build', 'server-reload', 'html-hint')
    });
    gulp.watch('src/css/*.css', function() {
        runSequence('css-libs', 'server-reload')
    });
    gulp.watch('src/scss/**/*.scss', function() {
        runSequence('sass', 'server-reload')
    });
    gulp.watch(['src/img/**/*.{png,jpg,bmp,gif,svg}', '!src/img/svg-source/*.svg'], function() {
        runSequence('copy-img', 'server-reload')
    });
    gulp.watch('src/img/svg-source/*.svg', function() {
        runSequence('svg-sprite', 'server-reload')
    });
    gulp.watch('src/fonts/**/*.{ttf,otf,woff,woff2,eot,svg}', function() {
        runSequence('copy-fonts', 'server-reload')
    });
    gulp.watch('src/json/**/*.json', function() {
        runSequence('copy-json', 'server-reload')
    });
    gulp.watch('src/js/lib/*.js', function() {
        runSequence('js-libs', 'server-reload')
    });
    gulp.watch('src/js/*.js', function() {
        runSequence('js-modules', 'server-reload')
    });

});


// full optimize tasks
//-----------------------------------------------------------------------------------
gulp.task('js-css-optimize', function() {
    return gulp.src('dist/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', minifyJS()))
        .pipe(gulpif('*.css', minifyCSS()))
        .pipe(gulpif('*.css', autoprefixer('last 15 versions')))
        .pipe(gulp.dest('dist'));
});


gulp.task('css-dist-clean', function() {
    return gulp.src([
            '!dist/css/style.min.css',
            'dist/css/*.css',
            'dist/css/*.map'
        ])
        .pipe(clean());
});

gulp.task('js-dist-clean', function() {
    return gulp.src('dist/js/libs.js')
        .pipe(clean());
});

gulp.task('dist-clean', function() {
    return gulp.src('dist/*')
        .pipe(clean());
});


// general tasks
//-----------------------------------------------------------------------------------
gulp.task('build', function() {
    runSequence('dist-clean', ['html-build', 'sass', 'css-libs', 'svg-sprite', 'copy-img', 'copy-fonts', 'copy-json', 'js-libs', 'js-modules'], 'html-hint');
});

gulp.task('optimize', function() {
    runSequence('dist-clean', ['html-build', 'sass', 'css-libs', 'svg-sprite', 'copy-img', 'copy-fonts', 'copy-json', 'js-libs', 'js-modules'], 'js-css-optimize', ['css-dist-clean', 'js-dist-clean']);
});

gulp.task('dev', function() {
    runSequence('build', 'watch', 'server');
});