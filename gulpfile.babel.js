import gulp from 'gulp';
import watch from 'gulp-watch';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import rev from 'gulp-rev';
import webpackStream from 'webpack-stream';
import webpack from 'webpack';

//
// Build
//

gulp.task('build-service-worker', () => (
    gulp.src('./public-src/service-worker.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        // source map merging will use the lowest resolution of the two inputs,
        // i.e. the uglify source map.
        // https://github.com/mozilla/source-map/issues/216

        // mangling toplevel breaks source maps
        // https://github.com/mishoo/UglifyJS2/issues/880
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./public'))
));

gulp.task('build-app', () => (
    webpackStream({
        entry: {
            main: './public-src/js/main.js',
            vendor: ['virtual-dom', 'vdom-virtualize']
        },
        output: { filename: '[name]-bundle.js' },
        module: { loaders: [ { loader: 'babel-loader' } ] },
        devtool: 'source-map',
        plugins: [ new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor-bundle.js' }) ]
    })
        .pipe(sourcemaps.init())
        .pipe(uglify())
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
