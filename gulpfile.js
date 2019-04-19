const gulp = require('gulp')
const p = require('gulp-load-plugins')()
const bs = require('browser-sync').create()

// 获取 scss 文件，以 compact 模式编译，将结果输出到 css 文件中，刷新浏览器并注入流
gulp.task('sass', () => {
    gulp.src('scss/*.scss')
        .pipe(p.sass({outputStyle: 'compact'}))
        .pipe(gulp.dest('css'))
        .pipe(bs.reload({stream: true}))
})

// 开启服务，实时编译 scss 文件，文件改动时自动刷新浏览器
gulp.task('default', () => {
    bs.init({server: ''})
    gulp.watch('scss/*.scss', ['sass'])
    gulp.watch(['index.html', 'css/*.css', 'js/*.js'], bs.reload)
})

// 压缩 html
gulp.task('mhtml', () => {
    gulp.src('html/*.html')
        .pipe(p.htmlmin())
        .pipe(gulp.dest('dist/html'))
})

// 压缩 css
gulp.task('mcss', () => {
    gulp.src('css/*.css')
        .pipe(p.cleanCss())
        .pipe(gulp.dest('dist/css'))
})

// 压缩 js
gulp.task('mjs', () => {
    gulp.src('js/*.js')
        .pipe(p.babel({ presets: ['@babel/env'] }))
        .pipe(p.uglify())
        .pipe(gulp.dest('dist/js'))
})

// 压缩图片
gulp.task('mimg', () => {
    gulp.src('img/*')
        .pipe(p.imagemin())
        .pipe(gulp.dest('dist/img'))
})

// 压缩打包文件
gulp.task('pack', ['mhtml', 'mcss', 'mjs', 'mimg'])