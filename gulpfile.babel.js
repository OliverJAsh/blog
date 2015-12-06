import gulp from 'gulp';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import rev from 'gulp-rev';
import rename from 'gulp-rename';
import webpackStream from 'webpack-stream';
import webpack from 'webpack';
import vinylFromString from 'gulp-file';
import treeToHTML from 'vdom-to-html';

import mainView from './src/main';

//
// Build
//

gulp.task('build-service-worker', ['build-app', 'build-shell'], () => (
    webpackStream({
        entry: { 'service-worker': './src/public/service-worker.js' },
        output: { filename: 'service-worker.js' },
        module: {
            loaders: [
                { loader: 'babel-loader', test: /\.js$/ },
                { loader: 'json-loader', test: /\.json$/ }
            ]
        },
        devtool: 'source-map'
    })
        .pipe(sourcemaps.init())
        // source map merging will use the lowest resolution of the two inputs,
        // i.e. the uglify source map.
        // https://github.com/mozilla/source-map/issues/216

        // mangling toplevel breaks source maps
        // https://github.com/mishoo/UglifyJS2/issues/880
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./target/public'))
));

gulp.task('build-app', () => (
    webpackStream({
        entry: {
            main: './src/public/js/main.js',
            vendor: [
                'virtual-dom',
                'vdom-virtualize',
                'exports?global.Promise!es6-promise',
                // https://github.com/webpack/webpack/issues/1717
                'imports?this=>global!exports?global.fetch!whatwg-fetch'
            ]
        },
        output: { filename: '[name]-bundle.js' },
        module: { loaders: [ { loader: 'babel-loader' } ] },
        devtool: 'source-map',
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor-bundle.js' }),
            new webpack.ProvidePlugin({
                Promise: 'exports?global.Promise!es6-promise',
                fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch'
            })
        ]
    })
        .pipe(sourcemaps.init())
        // https://github.com/shama/webpack-stream/issues/58#issuecomment-160432440
        .pipe(rename(path => {
            path.dirname = `${path.dirname}/js`;
            return path;
        }))
        .pipe(uglify())
        .pipe(rev())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./target/public'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./target'))
));

gulp.task('build-shell', ['build-app'], () => {
    const docType = '<!DOCTYPE html>';
    const shellHtml = docType + treeToHTML(mainView({}));

    const shellVinyl = vinylFromString('shell.html', shellHtml, { src: true });

    shellVinyl
        .pipe(rev())
        .pipe(gulp.dest('./target/public'))
        .pipe(rev.manifest({ merge: true, cwd: './target' }))
        .pipe(gulp.dest('./target'));
});

gulp.task('build', ['build-app', 'build-shell', 'build-service-worker']);
