var gulp = require('gulp'),
	lp = require('gulp-load-plugins')();

gulp.task('styl', function () {
    return gulp.src('src/main.styl')
		.pipe(lp.sourcemaps.init())
        //.pipe(lp.stylus())
        .pipe(lp.stylus().on( 'error', lp.notify.onError(
			  {
				message: "<%= error.message %>",
				title  : "Stylus Error!"
			  } ) )
		  )
        .pipe(lp.csso({restructure: true}))
        .pipe(lp.sourcemaps.write('maps'))	
        .pipe(gulp.dest('relise'))
});

gulp.task('pug', function () {
    return gulp.src('src/index.pug')
		.pipe(lp.pug({
			pretty: true
		}))
        .pipe(gulp.dest('relise'))
});

gulp.task('js', function () {
    return gulp.src(['src/**/*.js'])
		.pipe(lp.sourcemaps.init())
        .pipe(lp.babel({presets: ['env']}))
		.pipe(lp.concat('main.js'))
		.pipe(lp.sourcemaps.write('maps'))
		.pipe(gulp.dest('relise'))
});

gulp.task('default', ['styl', 'pug', 'js'], function () {
    gulp.watch('src/**/*.styl', ['styl']);
    gulp.watch('src/**/*.pug', ['pug']);
    gulp.watch('src/**/*.js', ['js']);
});