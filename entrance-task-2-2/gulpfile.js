var gulp = require('gulp');

// ######################## //
//    DEVELOPMENT images START   //
// ####################### //
var imagemin = require('gulp-imagemin');
var imageminGuetzli = require('imagemin-guetzli');
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var rename = require("gulp-rename");
var imageminPngquant = require('imagemin-pngquant');

// Minify jpg and make them progressive
gulp.task('jpegmin', () =>
  gulp.src('assets/img/**/*.jpg')
  .pipe(imagemin([
    imageminGuetzli({ quality: 85 }),
    imagemin.jpegtran({ progressive: true })
  ]))
  .pipe(gulp.dest('img'))
);

// Minify png
gulp.task('pngmin', () =>
  gulp.src('assets/img/**/*.png')
  .pipe(imagemin([
    imageminPngquant({ quality: 45 })
  ]))
  .pipe(gulp.dest('img'))
)

// Generate webp from jpeg\png
gulp.task("webp", function() {
  gulp.src("assets/img/**/*.{png,jpg}")
    .pipe(webp({ quality: 70 }))
    .pipe(gulp.dest("img/webp"));
});

// Minify SVG
gulp.task("svgo", function() {
  gulp.src("assets/svg/*.svg")
    .pipe(imagemin([
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("img/svg"));
});

// Genetare SVG sprite from icons starting with "icon-"
gulp.task("sprite", function() {
  gulp.src("img/svg/icon-*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("img/svg"));
});

// ######################  //
//    DEVELOPMENT images END   //
// ###################### //


// --------------------------------------------//


// ######################  //
//     BrowserSync all files START   //
// ###################### //

var browserSync = require('browser-sync');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");

// Monitor sass files + sync with local server
gulp.task('default', ['sass'], function() {
  browserSync.init(["css/*.css", "js/*.js", "*.html", "sass/*.scss"],{
    server: "./"
  });
  gulp.watch("sass/**/*.scss", ['sass']);
  gulp.watch("*.html").on('change', browserSync.reload)
});

// Convert SCSS to CSS
gulp.task('sass', function() {
  gulp.src('sass/style.scss')
    .pipe(plumber())
    .pipe(sass({ includePaths: ['sass'] }))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.stream())
});

// #####################  //
//     BrowserSync all files END   //
// #################### //
