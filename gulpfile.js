"use strict";

var gulp = require("gulp"),
    sass = require("gulp-sass"),
    plumber = require("gulp-plumber"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    server = require("browser-sync").create(),
    del = require("del"),
    run = require("run-sequence");

gulp.task("copy", function() {
  return gulp.src([
          "*.html"
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
    .pipe(server.stream());
});

gulp.task("html:copy", function() {
   return gulp.src("*.html")
     .pipe(gulp.dest("build"));
});

gulp.task("html:update", ["html:copy"], function(done) {
   server.reload();
   done();
});

gulp.task("serve", ["style"], function() {
  server.init({
    server: "build/",
    index: "catalog.html",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("*.html", ["html:update"]);
});

gulp.task ("build", function(fn) {
  run(
    "copy",
    "style",
    fn
  );
});
