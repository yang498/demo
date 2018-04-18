/**
 * Created by Tazyong on 2017/4/26.
 *
 * -------------------- 任务指令 --------------------
 * 1.   初始化（创建目录结构）   gulp init
 * 2.   开发模式                       gulp dev
 * 3.   生产发布                       gulp pro
 * 4.   编译/生成所有文件           		gulp build
 * 5.   编译/生成css            		gulp build-css
 * 6.   编译/生成js-es5         		gulp build-js
 * 7.   清空所有生产数据         gulp clean
 * 8.   清空生产目录                    gulp clean-dirs
 * 9.   清除生产打包文件             gulp clean-file
 * 10.  压缩所有文件                			gulp mini
 * 11.  压缩html                     gulp mini-html
 * 12.  压缩css                      gulp mini-css
 * 13.  压缩js                       gulp mini-js
 * 14.  压缩图片                    				gulp mini-img
 * 15.  拷贝所有静态文件         gulp copy
 * 16.  拷贝字体文件                    gulp copy-font
 * 17.  拷贝媒体文件                    gulp copy-media
 * 18.  创建生产打包文件             gulp package
 */


/************************* 载入模块 *************************/
var gulp            = require("gulp"),
    browserSync     = require("browser-sync").create(),
    mkdirp          = require("mkdirp"),
    del             = require("del"),
    htmlmin         = require("gulp-htmlmin"),
    htmlBeautify    = require("gulp-html-beautify"),
    sass            = require("gulp-sass"),
    autoprefixer    = require("gulp-autoprefixer"),
    minifyCss       = require("gulp-minify-css"),
    babel           = require("gulp-babel"),
    uglify          = require("gulp-uglify"),
    imagemin        = require("gulp-imagemin"),
    sequence        = require("gulp-sequence"),
    zip             = require("gulp-zip"),
    plumber         = require("gulp-plumber");


/************************* 目录配置 *************************/
var src      = "./src/",
    target   = "./dist/",
    dirs     = {
        html    : "html/",
        scss    : "scss/",
        css     : "css/",
        sjs     : "js-es6+/",
        js      : "js/",
        img     : "img/",
        font    : "font/",
        media   : "media/"
    };


/************************* 功能方法 *************************/
var build = {
        js: function(file, stopAtError) {
            stopAtError = typeof stopAtError === "boolean" ? stopAtError : false;
            var babelConfig = {
                    presets: ["es2015"]
                },
                destDir = src + dirs.js;

            if (stopAtError) {
                return gulp.src(file)
                    .pipe(babel(babelConfig)
                        .on("error", function(error) {
                            console.log(error.message);
                        }))
                    .pipe(gulp.dest(destDir));
            } else {
                return gulp.src(file)
                    .pipe(plumber())
                    .pipe(babel(babelConfig))
                    .pipe(gulp.dest(destDir));
            }
        },
        css: function(file, stopAtError) {
            stopAtError = typeof stopAtError === "boolean" ? stopAtError : false;
            var sassConfig = {
                    outputStyle: "expanded"
                },
                autoprefixerConfig = {
                    browsers: [
                        'last 2 versions',
                        'Android >= 4.0',
                        'iOS 7',
                        'last 3 Safari versions'
                    ],
                    cascade: false,
                    remove: false
                },
                destDir = src + dirs.css;

            if (stopAtError) {
                return gulp.src(file)
                    .pipe(sass(sassConfig)
                        .on("error", function(error) {
                            console.log(error.message);
                        }))
                    .pipe(autoprefixer(autoprefixerConfig))
                    .pipe(gulp.dest(destDir));
            } else {
                return gulp.src(file)
                    .pipe(plumber())
                    .pipe(sass(sassConfig)
                        .on("error", sass.logError))
                    .pipe(autoprefixer(autoprefixerConfig))
                    .pipe(gulp.dest(destDir));
            }

        }
    },
    getPackageName = function() {
        var targetArr = target.replace(/\/+/g, "/")
            .replace(/^\.*\/|\/$/g,"").split("/");
        return targetArr.pop() + ".zip";
    };


/************************* 创建目录结构 *************************/
gulp.task("init", function() {
    for (dir in dirs) {
        mkdirp(src + dirs[dir]);
    }
});


/************************* 编译/生成css *************************/
gulp.task("build-css", function() {
    return build.css(src + dirs.scss + "**/*.scss", true);
});


/************************* 编译/生成js-es5 *************************/
gulp.task("build-js", function() {
    return build.js(src + dirs.sjs + "**/*.js", true);
});


/************************* 编译/生成所有文件 *************************/
gulp.task("build", sequence("build-css", "build-js"));


/************************* 开发环境 *************************/
gulp.task("dev", ["build"], function() {
    browserSync.init({
        port: 3030,
        server: {
            baseDir: src
        }
    }, function() {
        browserSync
            .watch(src + dirs.scss + "**/*.scss")
            .on("change", build.css);
        browserSync
            .watch(src + dirs.sjs + "**/*.js")
            .on("change", build.js);
        browserSync
            .watch(src + dirs.html + "**/*.html")
            .on("change", browserSync.reload);
        browserSync
            .watch(src + dirs.css + "**/*.css")
            .on("change", browserSync.reload);
        browserSync
            .watch(src + dirs.js + "**/*.js")
            .on("change", browserSync.reload);
    });
});


/************************* 清空生产目录 *************************/
gulp.task("clean-dirs", function() {
    return del(target);
});


/************************* 清空生产文件 *************************/
gulp.task("clean-file", function() {
    return del(getPackageName());
});


/************************* 清空生产目录及文件 *************************/
gulp.task("clean", sequence("clean-dirs", "clean-file"));


/************************* 压缩html *************************/
gulp.task("mini-html", function() {
    return gulp.src(src + dirs.html + "**/*.html")
        .pipe(htmlmin({
            collapseWhitespace: true,           //去空格
            removeComments: true,               //去除注释
            collapseBooleanAttributes: true,    //去除单属性值
            removeEmptyAttributes: true,        //去除空属性
            minifyCSS: true,                    //压缩页内css
            minifyJS: true                      //压缩页内js
        }))
        .pipe(htmlBeautify())                   //美化html
        .pipe(gulp.dest(target + dirs.html));
});


/************************* 压缩css *************************/
gulp.task("mini-css", ["build-css"], function() {
    return gulp.src(src + dirs.css + "**/*.css")
        .pipe(minifyCss())
        .pipe(gulp.dest(target + dirs.css));
});


/************************* 压缩js *************************/
gulp.task("mini-js", ["build-js"], function() {
    return gulp.src(src + dirs.js + "**/*.js")
        .pipe(uglify())
        .pipe(gulp.dest(target + dirs.js));
});


/************************* 压缩图片 *************************/
gulp.task("mini-img", function() {
    return gulp.src(src + dirs.img + "**/*")
        .pipe(imagemin())
        .pipe(gulp.dest(target + dirs.img));
});


/************************* 压缩所有文件 *************************/
gulp.task("mini", sequence("mini-html", "mini-css", "mini-js", "mini-img"));


/************************* 拷贝字体文件 *************************/
gulp.task("copy-font", function() {
    return gulp.src(src + dirs.font + "**/*")
        .pipe(gulp.dest(target + dirs.font));
});


/************************* 拷贝媒体文件 *************************/
gulp.task("copy-media", function() {
    return gulp.src(src + dirs.media + "**/*")
        .pipe(gulp.dest(target + dirs.media));
});


/************************* 拷贝所有静态文件 *************************/
gulp.task("copy", sequence("copy-font", "copy-media"));


/************************* 创建生产打包文件 *************************/
gulp.task("package", function() {
    return gulp.src(target + "**/*")
        .pipe(zip(getPackageName()))
        .pipe(gulp.dest(target + "../"));
});


/************************* 生产发布 *************************/
gulp.task("pro", sequence("clean", "mini", "copy", "package"));