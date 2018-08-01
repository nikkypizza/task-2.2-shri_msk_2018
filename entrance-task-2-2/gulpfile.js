var gulp = require('gulp');

// ######################## //
// DEVELOPMENT images START //
// ####################### //

var imagemin = require('gulp-imagemin');
var svgstore = require("gulp-svgstore");
var rename = require("gulp-rename");
var imageminPngquant = require('imagemin-pngquant');

// Minify png
gulp.task('pngmin', () =>
  gulp.src('assets/img/**/*.png')
  .pipe(imagemin([
    imageminPngquant({ quality: 45 })
  ]))
  .pipe(gulp.dest('img'))
)

// Minify SVG
gulp.task("svgo", function () {
  gulp.src("assets/svg/*.svg")
    .pipe(imagemin([
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("img/svg"));
});

// Genetare SVG sprite from icons starting with "icon-"
gulp.task("sprite", function () {
  gulp.src("img/svg/icon_*.svg")
    .pipe(imagemin([
      imagemin.svgo()
    ]))
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("img/svg"));
});

// ###################### //
// DEVELOPMENT images END //
// ###################### //


// --------------------------------------------//


//    ######################   //
// BrowserSync all files START //
//    ######################   //

var browserSync = require('browser-sync');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");

// Monitor sass files + sync with local server
gulp.task('default', ['sass'], function () {
  browserSync.init(["css/*.css", "js/*.js", "*.html", "sass/*.scss"], {
    server: "./"
  });
  gulp.watch("sass/**/*.scss", ['sass']);
  gulp.watch("*.html").on('change', browserSync.reload)
});

// Convert SCSS to CSS
gulp.task('sass', function () {
  gulp.src('sass/style.scss')
    .pipe(plumber())
    .pipe(sass({ includePaths: ['sass'] }))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.stream())
});

//   #####################   //
// BrowserSync all files END //
//   #####################   //
