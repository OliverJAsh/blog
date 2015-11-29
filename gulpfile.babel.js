import gulp from 'gulp';
import watch from 'gulp-watch';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import sourcemaps from 'gulp-sourcemaps';
import rev from 'gulp-rev';
import rename from 'gulp-rename';
import webpackStream from 'webpack-stream';
import webpack from 'webpack';
import mergeStream from 'merge2';
import vinylFromString from 'gulp-file';
import treeToHTML from 'vdom-to-html';

import mainView from './shared/views/main';

import { getAssetFilename } from './shared/helpers';


//
// Build
//

gulp.task('build-service-worker', ['build-app', 'build-shell'], () => {
    const shellFileName = getAssetFilename('shell.html');
    const shellAssetFileNames = [
        getAssetFilename('js/main-bundle.js'),
        getAssetFilename('js/vendor-bundle.js')
    ];

    const shellManifest = `
        const shellFileName = '${shellFileName}';
        const shellAssets = [${shellAssetFileNames.map(x => `'${x}'`)}];
    `;

    const serviceWorker = gulp.src('./public-src/service-worker.js');
    const shellManifestFile = vinylFromString('shell-manifest.js', shellManifest, { src: true });

    return mergeStream(shellManifestFile, serviceWorker)
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('service-worker.js'))
        // source map merging will use the lowest resolution of the two inputs,
        // i.e. the uglify source map.
        // https://github.com/mozilla/source-map/issues/216

        // mangling toplevel breaks source maps
        // https://github.com/mishoo/UglifyJS2/issues/880
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./public'));
});

gulp.task('build-app', () => (
    webpackStream({
        entry: {
            main: './public-src/js/main.js',
            vendor: ['virtual-dom', 'vdom-virtualize']
        },
        // fs is only used on the server
        node: { fs: 'empty' },
        output: { filename: '[name]-bundle.js' },
        module: { loaders: [ { loader: 'babel-loader' } ] },
        devtool: 'source-map',
        plugins: [ new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor-bundle.js' }) ]
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
        .pipe(gulp.dest('./public'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('.'))
));

// Promise of stream will not be waited on
// https://github.com/gulpjs/gulp/issues/1421
gulp.task('build-shell', ['build-app'], (cb) => {
    const shellHtmlPromise = mainView().then(treeToHTML);

    shellHtmlPromise.then(shellHtml => {
        const shellVinyl = vinylFromString('shell.html', shellHtml, { src: true });

        const stream = shellVinyl
            .pipe(rev())
            .pipe(gulp.dest('./public'))
            .pipe(rev.manifest({
                merge: true
            }))
            .pipe(gulp.dest('.'));

        stream.on('end', cb);
    });
});

gulp.task('build', ['build-app', 'build-shell', 'build-service-worker']);

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
