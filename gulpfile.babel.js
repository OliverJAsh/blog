import gulp from 'gulp';
import watch from 'gulp-watch';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import rev from 'gulp-rev';
import webpack from 'webpack-stream';
import rename from 'gulp-rename';

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
    gulp.src('./public-src/js/main.js')
        .pipe(webpack({
            module: { loaders: [ { loader: 'babel-loader' } ] },
            devtool: 'source-map'
        }))
        .pipe(sourcemaps.init())
        .pipe(rename('main-bundle.js'))
        .pipe(uglify({ mangle: { toplevel: true }}))
        .pipe(rev())
        .pipe(sourcemaps.write('.'))
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

const baseURL = `${__dirname}/public-src/js`;
gulp.task('watch-app', ['build-app'], () => (
    watch([
        `${baseURL}/**/*.js`,
        // Not all files live in the jspm base
        `${__dirname}/shared/**/*.js`
    ], () => {
        gulp.start('build-app');
    })
));

gulp.task('watch', ['watch-app', 'watch-service-worker']);
