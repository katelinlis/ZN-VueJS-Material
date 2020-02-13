var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass');
var cleancss = require('gulp-clean-css');
var csscomb = require('gulp-csscomb');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');

var paths = {
    pages: ['./src/**/*.html'],
    styles: ['./src/sass/**/*.scss'],
    styles2: ['./src/css/**/*.css'],
    fonts: ['./node_modules/material-design-icons/iconfont/**/MaterialIcons-Regular.*'],
    fontcss: ['./node_modules/material-design-icons/iconfont/material-icons.css'],
    scripts: ['./src/**/*.js']
};

function watch(){
    gulp.watch(paths.pages, gulp.series("html"));
    gulp.watch(paths.styles, gulp.series("styles"));
    gulp.watch(paths.styles2, gulp.series("styles2"));
    gulp.watch(paths.scripts, gulp.series("scripts"));
}

function html(){
    gulp.src(paths.pages).pipe(gulp.dest("."));
}

function styles() {
    gulp.src(paths.styles)
        .pipe(sass({ outputStyle: 'compact', precision: 10 })
            .on('error', sass.logError)
        )
        .pipe(autoprefixer())
        .pipe(csscomb())
        .pipe(cleancss())
        .on("error", (...err) => {
            console.error("ERROR", err);
        })
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./css/'));
}

function styles2() {
    gulp.src(paths.styles2)
        .pipe(autoprefixer())
        .pipe(csscomb())
        .pipe(cleancss())
        .on("error", (...err) => {
            console.error("ERROR", err);
        })
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./css/'));
}

function fonts(){
    gulp.src(paths.fonts)
        .pipe(gulp.dest('./css/'));
}

function fontcss() {
    gulp.src(paths.fontcss)
        .pipe(gulp.dest('./src/css'));
}

function scripts() {
    browserify({
            basedir: ".",
            debug: true,
            entries: ["./src/main.js"],
            cache: {},
            packageCache: {},
            insertGlobals: true
        })
        .on("error", (...err) => {
            console.error("ERROR", err);
        })
        .bundle()
        .on("error", (...err) => {
            console.error("ERROR", err);
        })
        .pipe(source("bundle.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        // .pipe(uglify())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("./js/"));
}


function Default(){
fontcss()
fonts()
scripts()
styles()
styles2()
html()

}

function Watch(){
    Default()
    watch()
}
exports.default = Watch
exports.build = Default

exports.html = html
exports.styles = styles
exports.styles2 = styles2
exports.scripts = scripts