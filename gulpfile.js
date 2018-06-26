"use strict";

var gulp = require("gulp"),
    server = require("browser-sync").create(),
    rename = require("gulp-rename"),
    del = require("del"),
    plumber = require("gulp-plumber"),
    run = require("run-sequence"),
    sass = require("gulp-sass"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    csso = require("gulp-csso"),
    htmlmin = require('gulp-htmlmin'),
    imagemin = require("gulp-imagemin"),
    webp = require('gulp-webp'),
    svgstore = require('gulp-svgstore'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat');

gulp.task("clean", function() {
  return del("build");
})

gulp.task("copy", function() {
  return gulp.src([
          "*.html",
          "fonts/**/*"
     ], {
       base: "."
     })
     .pipe(gulp.dest("build"));
});

gulp.task("style", function() {
  gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style-min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.reload({ stream: true }));
});

gulp.task("html", function() {
   return gulp.src("*.html")
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("build"));
});

gulp.task("image:webp", function() {
  return gulp.src("img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("img"))
})

gulp.task("image:svgstore", function() {
  return gulp.src("img/icons/icon-*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("img"));
})

gulp.task("image:minify", function() {
  return gulp.src(["img/**/*.{png,jpg,webp}",
                   "img/*.svg"], {
    base: "build"
  })
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo({
        plugins: [
          { optimizationLevel: 3 },
          { progessive: true },
          { interlaced: true },
          { removeViewBox: false },
          { removeUselessStrokeAndFill: true },
          { cleanupIDs: false }
       ]
      })]))
    .pipe(gulp.dest("build/img"));
})


gulp.task("js", function () {
  gulp.src("js/*.js")
    .pipe(uglify({mangle: false}))
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(gulp.dest("build/js"));
});

gulp.task("serve", function() {
  server.init({
    server: "build/",
    index: "index.html",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("js/**/*.js", ["js"]).on("change", server.reload);;
  gulp.watch("sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("*.html", ["html"]).on("change", server.reload);
});

gulp.task ("build", function(done) {
  run(
    "clean",
    "copy",
    "style",
    "html",
    "image:webp",
    "image:svgstore",
    "image:minify",
    "js",
    done
  );
});
