'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    coffee = require('gulp-coffee'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload,
    cache = require('gulp-cache');

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        coffee: 'src/js/coffee/tmp/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/',
        json: 'build/json/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/js/main.js',//В стилях и скриптах нам понадобятся только main файлы
        coffee: 'src/js/coffee/**/*.coffee',
        style: 'src/style/main.scss',
        img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*',
        json: 'src/json/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.*',
        coffee: 'src/js/coffee/**/*.coffee',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        json: 'src/json/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
};

gulp.task('html:build', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});


gulp.task('js:build', function () {
    gulp.src(path.src.js) //Найдем наш main файл
        .pipe(rigger()) //Прогоним через rigger
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(uglify()) //Сожмем наш js
        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true})); //И перезагрузим сервер
    //printTimestamp('Js build initiated');
});

gulp.task('coffee:build', function() {
    gulp.src(path.src.coffee)
        .pipe(coffee({bare: true}).on('error', gutil.log))
        .pipe(gulp.dest(path.build.coffee));
    //printTimestamp('Coffee build initiated');
});

gulp.task('style:build', function () {
    gulp.src(path.src.style) //Выберем наш main.scss
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(sass()).on('error', gutil.log) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('json:build', function() {
    gulp.src(path.src.json)
        .pipe(gulp.dest(path.build.json))
});


gulp.task('build', [
    'html:build',
    'coffee:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build',
    'json:build'
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    }).on('error', gutil.log);
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    }).on('error', gutil.log);
    watch([path.watch.coffee], function(event, cb) {
        gulp.start('coffee:build');
    }).on('error', gutil.log);
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    }).on('error', gutil.log);
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    }).on('error', gutil.log);
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    }).on('error', gutil.log);
    watch([path.watch.json], function(event, cb) {
        gulp.start('json:build');
    }).on('error', gutil.log);
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('clearCache', function() {
    // Still pass the files to clear cache for
    gulp.src('./lib/*.js')
        .pipe(cache.clear());
});

gulp.task('default', ['build', 'webserver', 'watch']);

//Handle timestamps
function printTimestamp(msg) {
    console.log(msg + " " + new Date().toUTCString());
}