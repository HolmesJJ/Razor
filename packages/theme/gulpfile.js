'use strict';
/* eslint-disable */
const gulp = require('gulp');
const src = gulp.src;
const dest = gulp.dest;
const sass = require('gulp-sass');
// 项目可能不需要
// const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-clean-css');
const fs = require('fs')

const unlinkFile = (src) => {
  fs.unlinkSync(src)
}

function compileWhite() {
  return src('./white/*.scss')
    .pipe(sass.sync())
    // .pipe(autoprefixer({
    //   browsers: ['ie > 9', 'last 2 versions'],
    //   cascade: false
    // }))
    .pipe(cssmin())
    .pipe(dest('./lib/style/white'))
    .on('end', () => {
      console.log('----------- compileWhite done -----------');
    });
}

function compileDark() {
  return src('./dark/*.scss')
    .pipe(sass.sync())
    // .pipe(autoprefixer({
    //   browsers: ['ie > 9', 'last 2 versions'],
    //   cascade: false
    // }))
    .pipe(cssmin())
    .pipe(dest('./lib/style/dark'))
    .on('end', () => {
      console.log('----------- compileDark done -----------');
    });
}

function copyWhitefont() {
  return src('./fonts/**')
    .pipe(dest('./lib/style/fonts'))
    .on('end', () => {
      console.log('----------- copyWhitefont done -----------');
    });
}

function copyWhiteImg() {
  return src('./white/img/**')
    .pipe(dest('./lib/style/white/img'))
    .on('end', () => {
      console.log('----------- copyWhiteImages done -----------');
    });
}

function copyDarkfont() {
  return src('./fonts/**')
    .pipe(dest('./lib/style/fonts'))
    .on('end', () => {
      console.log('----------- copyDarkfont done -----------');
    });
}

function copyDarkImg() {
  return src('./dark/img/**')
    .pipe(dest('./lib/style/dark/img'))
    .on('end', () => {
      console.log('----------- copyWhiteImages done -----------');
    });
}

function copyStyle() {
  return src('./lib/**')
    .pipe(dest('../../dist/lib'))
    .on('end', () => {
      console.log('----------- copyStyle done -----------');
    });
}

function copyTheme() {
  return src('../theme/**')
    .pipe(dest('../../theme'))
    .on('end', () => {
      unlinkFile('../../theme/package.json')/* remove for publish 删除它,否则发布的话这个文件夹内容不会被发布 */
      console.log('----------- copyTheme done -----------');
    });
}

gulp.task('default', function () {
  compileWhite();
  compileDark();
  copyWhitefont();
  copyDarkfont();
  copyWhiteImg();
  copyDarkImg();
  copyStyle();
  copyTheme();
});
gulp.task('watch', function () {
  gulp.watch(
    [
      './white/*.scss',
      './white/**/*.scss',
      './dark/*.scss',
      './dark/**/*.scss'
    ],
    function () {
      compileWhite();
      compileDark();
      copyWhitefont();
      copyDarkfont();
      copyWhiteImg();
      copyDarkImg();
    });
});

