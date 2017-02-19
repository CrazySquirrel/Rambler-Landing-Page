"use strict";

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "production";
}

const PATH = require("path");
const PUG = require("pug");
const FS = require("fs");
const CRIPTO_JS = require("crypto-js");

const gulp = require("gulp");
const webpack = require("gulp-webpack");
const named = require("vinyl-named");
const nodemon = require("gulp-nodemon");
const compass = require("gulp-compass");
const minifycss = require("gulp-minify-css");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const path = require("path");
const gzip = require("gulp-gzip");
const manifest = require("gulp-manifest");
const pug = require("gulp-pug");
const data = require("gulp-data");
const through = require("through2");
const replace = require("gulp-replace");
const image = require("gulp-image");
const zlib = require("zlib");
const replacepath = require("gulp-replace-path");
const clean = require("gulp-clean");

const notifyInfo = {
  title: "Gulp",
  icon: "./src/images/gulp.png"
};

const plumberErrorHandler = {
  errorHandler: notify.onError({
    title: notifyInfo.title,
    icon: notifyInfo.icon,
    message: "Error: <%= error.message %>"
  })
};

let _package = require("./package.json");

_package = Object.assign({}, _package, {
  lang: "ru",
  title: "Разыскивается JavaScript Developer от 80 000 до 150 000 руб",
  keywords: "Rambler&Co, JavaScript Developer, Job, Moscow",
  description: "Рамблер Рекламные Технологии (Москва)",
  url: "http://crazysquirrel.ru/jobs/javascript-developer/",
  share_images: [
    "/jobs/javascript-developer/images/share/rambler-1200x1200.png",
    "/jobs/javascript-developer/images/share/rambler-1200x628.png",
    "/jobs/javascript-developer/images/share/rambler-1200x627.png",
    "/jobs/javascript-developer/images/share/rambler-1080x1080.png",
    "/jobs/javascript-developer/images/share/rambler-1024x512.png",
    "/jobs/javascript-developer/images/share/rambler-800x1200.png",
    "/jobs/javascript-developer/images/share/rambler-736x1128.png",
    "/jobs/javascript-developer/images/share/rambler-735x1102.png",
    "/jobs/javascript-developer/images/share/rambler-700x400.png",
  ],
  modified: (new Date()).toISOString(),
});

gulp.task("pug", () => {
  return gulp.src("src/pug/**/*.pug")
  .pipe(plumber(plumberErrorHandler))
  .pipe(pug({
    data: _package,
  }))
  .pipe(gulp.dest("dist"))
  .pipe(gzip({append: true}))
  .pipe(gulp.dest("dist"));
});

gulp.task("ts-client", () => {
  return gulp.src("src/ts/client/**/*.ts")
  .pipe(plumber(plumberErrorHandler))
  .pipe(named())
  .pipe(webpack(require("./webpack.config.client.js")))
  .pipe(gulp.dest("dist/js"))
  .pipe(gzip({append: true}))
  .pipe(gulp.dest("dist/js"));
});

gulp.task("ts-server", () => {
  return gulp.src("src/ts/server/**/*.ts")
  .pipe(plumber(plumberErrorHandler))
  .pipe(named())
  .pipe(webpack(require("./webpack.config.server.js")))
  .pipe(gulp.dest(""));
});

gulp.task("scss", () => {
  return gulp.src("src/scss/**/*.scss")
  .pipe(plumber(plumberErrorHandler))
  .pipe(compass({
    project: __dirname,
    css: "dist/css",
    font: "dist/fonts",
    sass: "src/scss",
    image: "dist/images"
  }))
  .pipe(replace("../", "./"))
  .pipe(minifycss({append: true}))
  .pipe(gulp.dest("dist/css"))
  .pipe(gzip({append: true}))
  .pipe(gulp.dest("dist/css"));
});

gulp.task("images", () => {
  return gulp.src("src/images/**/*.{png,gif,jpeg,jpg,svg}")
  .pipe(plumber(plumberErrorHandler))
  .pipe(image({
    mozjpeg: false,
    jpegoptim: false,
    zopflipng: false,
  }))
  .pipe(gulp.dest("dist/images"))
  .pipe(gzip({append: true}))
  .pipe(gulp.dest("dist/images"));
});

gulp.task("fonts", () => {
  return gulp.src("src/fonts/**/*.{eot,svg,ttf,woff,woff2}")
  .pipe(plumber(plumberErrorHandler))
  .pipe(gulp.dest("dist/fonts"))
  .pipe(gzip({append: true}))
  .pipe(gulp.dest("dist/fonts"));
});

gulp.task("xml", () => {
  return gulp.src("src/images/**/*.xml")
  .pipe(plumber(plumberErrorHandler))
  .pipe(replace(/\$\{version\}/g, _package.version))
  .pipe(gulp.dest("dist"))
  .pipe(gzip({append: true}))
  .pipe(gulp.dest("dist"));
});

gulp.task("json", () => {
  return gulp.src("src/images/**/*.json")
  .pipe(plumber(plumberErrorHandler))
  .pipe(replace(/\$\{version\}/g, _package.version))
  .pipe(gulp.dest("dist"))
  .pipe(gzip({append: true}))
  .pipe(gulp.dest("dist"));
});

gulp.task("html", () => {
  return gulp.src("src/html/**/*.html")
  .pipe(plumber(plumberErrorHandler))
  .pipe(replace(/\$\{version\}/g, _package.version))
  .pipe(gulp.dest("dist"))
  .pipe(gzip({append: true}))
  .pipe(gulp.dest("dist"));
});

gulp.task("build",
    ["images", "fonts", "scss", "ts-client", "ts-server", "xml", "json", "html",
      "pug"]);

gulp.task("watch", ["build"], () => {
  gulp.watch("src/images/**/*.{png,gif,jpeg,jpg,svg}", ["images"]);

  gulp.watch("src/fonts/**/*.{eot,svg,ttf,woff,woff2}", ["fonts"]);

  gulp.watch("src/scss/**/*.scss", ["scss"]);

  gulp.watch("src/ts/client/**/*.ts", ["ts-client"]);

  gulp.watch("src/ts/server/**/*.ts", ["ts-server"]);

  gulp.watch("src/images/**/*.xml", ["xml"]);

  gulp.watch("src/images/**/*.json", ["json"]);

  gulp.watch("src/html/**/*.html", ["html"]);

  gulp.watch("src/pug/**/*.pug", ["pug"]);
});