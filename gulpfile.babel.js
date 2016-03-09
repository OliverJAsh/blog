import gulp from 'gulp';

gulp.task('build-images', () => {
    return gulp.src('./src/public/images/**')
        .pipe(gulp.dest('./target/public/images'));
});

gulp.task('build', ['build-images']);
