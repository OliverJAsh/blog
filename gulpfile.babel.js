import gulp from 'gulp';
import watch from 'gulp-watch';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import jspm from 'jspm';
import jspmBuild from 'gulp-jspm-build';
import rev from 'gulp-rev';

//
// Build
//

gulp.task('build-service-worker', () => (
    gulp.src('./public-src/service-worker.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(uglify({ mangle: { toplevel: true }}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./public'))
));

gulp.task('build-app', () => (
    // TODO: Don't output config.js https://github.com/buddhike/gulp-jspm-build/issues/8
    // TODO: no sourceMappingUrl https://github.com/systemjs/builder/issues/406
    // Would this work if jspm added sourceMappingUrl?
    // sourcemaps.init().pipe(jspmBuild({
    jspmBuild({
        bundleSfx: true,
        bundleOptions: { minify: true, sourceMaps: true, sourceMapContents: true },
        bundles: [ { src: 'main', dst: 'main-bundle.js' } ]
    })
        // TODO: How should gulp-rev handle sourcemaps?
        // https://github.com/sindresorhus/gulp-rev/issues/137
        // https://github.com/buddhike/gulp-jspm-build/issues/5
        // .pipe(sourcemaps.init({ loadMaps: true }))
        // .pipe(sourcemaps.init())
        .pipe(rev())
        // .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./public/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./public/js'))
));

gulp.task('build', ['build-app', 'build-service-worker']);

//
// Watch
//

gulp.task('watch-service-worker', ['build-service-worker'], () => (
    watch(['./public-src/service-worker.js'], () => {
        gulp.start('build-service-worker');
    })
));

const baseURL = new jspm.Builder().loader.baseURL.replace('file://', '');
gulp.task('watch-app', ['build-app'], () => (
    watch([
        `${baseURL}/**/*.js`,
        `!${baseURL}/jspm_packages`,
        // Not all files live in the jspm base
        `${__dirname}/shared/**/*.js`
    ], () => {
        gulp.start('build-app');
    })
));

gulp.task('watch', ['watch-app', 'watch-service-worker']);
