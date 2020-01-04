const gulp = require("gulp"),
    server = require("browser-sync").create(),
    rename = require("gulp-rename"),
    del = require("del"),
    plumber = require("gulp-plumber"),
    sass = require("gulp-sass"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    csso = require("gulp-csso"),
    htmlmin = require('gulp-htmlmin'),
    imagemin = require("gulp-imagemin"),
    webp = require('gulp-webp'),
    svgstore = require('gulp-svgstore'),
    uglify = require('gulp-uglify'),
    log = require('fancy-log'),
    c = require('ansi-colors'),
    concat = require('gulp-concat');

const { series } = gulp; 

const paths = {
  styles: {
    src: 'sass/style.scss',
    dest: 'docs/css'
  }
}

function clean() {
  return del('docs')
}

function copy() {
  return gulp.src([ '*.html', "fonts/**/*", "js/libraries/*.js" ], {
       base: "."
     })
    .pipe(gulp.dest('docs/'));
}

function style() {
  return gulp.src(paths.styles.src)
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(csso())
    .pipe(rename("style-min.css"))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(server.reload({ stream: true }));
};

function html() {
   return gulp.src("*.html")
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("docs"));
};

function imageWebp() {
  return gulp.src("img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("img"))
}

function imageSvgstore() {
  return gulp.src("img/icons/icon-*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("img"));
}

function imageMinify() {
  return gulp.src(["img/**/*.{png,jpg,webp}",
                   "img/*.svg"], {
    base: "docs"
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
    .pipe(gulp.dest("docs/img"));
};

function scripts() {
  return gulp.src("js/*.js")
    .pipe(concat("script.js"))
    .on('error', function (err) { log(c.red('[Error]'), err.toString()); })
    .pipe(uglify({mangle: false}))
    .on('error', function (err) {log(c.red('[Error]'), err.toString()); })
    .pipe(rename({
      suffix: "-min"
    }))
    .pipe(gulp.dest("docs/js"));
}

function jsWatch() {
  scripts();
  server.reload();
}

function serve() {
  server.init({
    server: "./docs/",
  });

  gulp.watch('js/**/*.js').on('change', jsWatch);
  gulp.watch("sass/**/*.{scss,sass}", style);
  gulp.watch("*.html", gulp.series(html, server.reload));
};

const build = series(
    clean,
    copy,
    style,
    html,
    imageWebp,
    imageSvgstore,
    imageMinify,
    scripts
);

exports.build = build;
exports.serve = serve;