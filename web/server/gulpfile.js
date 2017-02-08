var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var clean = require('gulp-clean');
var server = require('gulp-develop-server');

var serverTS = ["**/*.ts", "!node_modules/**", '!bin/**'];

gulp.task('ts', ['clean'], function () {
    return gulp
        .src(serverTS, { base: './' })
        .pipe(tsProject())
        .pipe(gulp.dest('./'));
});

gulp.task('clean', function () {
    return gulp
        .src([
            'dist/app.js',
            'dist/**/*.js',
            'dist/**/*.js.map',
            '!dist/swagger-ui/**',
            '!node_modules/**',
            '!gulpfile.js',
            '!bin/**'
        ], { read: false })
        .pipe(clean())
});

gulp.task('server:start', ['ts'], function () {
    server.listen({ path: 'server.js' }, function (error) {
        console.log(error);
    });
});

gulp.task('server:restart', ['ts'], function () {
    server.restart();
});

gulp.task('default', ['server:start'], function () {
    gulp.watch(serverTS, ['server:restart']);
});

