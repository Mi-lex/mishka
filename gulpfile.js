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
    imagemin = require("gulp-imagemin"),
    webp = require('gulp-webp'),
    svgstore = require('gulp-svgstore'),
    uglify = require('gulp-uglify'),
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
    .pipe(server.stream());
});

gulp.task("html", function() {
   return gulp.src("*.html")
     .pipe(gulp.dest("build"));
});

gulp.task("image:minify", function() {
  return gulp.src(["img/**/*.{png,jpg,svg,webp}"], {
    base: "build"
  })
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
})

gulp.task("image:webp", function() {
  return gulp.src("img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("img"))
})

gulp.task("imgage:svgstore", function() {
  return gulp.src("build/img/icons/icon-*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
})

gulp.task("js", function() {
  return gulp.src("js/*.js")
    .pipe(concat("script.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(uglify())
    .pipe(rename("script-min.js"))
    pipe(gulp.dest("build/js"));
})

gulp.task("serve", function() {
  server.init({
    server: "build/",
    index: "index.html",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("*.html", ["html"]).on('change', server.reload);
});

gulp.task ("build", function(done) {
  run(
    "clean",
    "copy",
    "style",
    "image:webp",
    "image:minify",
    "imgage:svgstore",
    "js",
    done
  );
});
