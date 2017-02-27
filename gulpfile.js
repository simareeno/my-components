var gulp = require('gulp'),
		path = require('path'),
		pug = require('gulp-pug'),
		less = require('gulp-less'),
		autoPrefixer = require('autoprefixer'),
		minify = require('cssnano'),
		sourceMaps = require('gulp-sourcemaps'),
		concat = require('gulp-concat'),
		plumber = require('gulp-plumber'),
		notify = require('gulp-notify'),
		util = require('gulp-util'),
		uglify = require('gulp-uglify'),
		postCss = require('gulp-postcss'),
		imageMin = require('imagemin'),
		browserSync = require('browser-sync').create(),
		useref = require('gulp-useref'),
		runSequence = require('run-sequence'),
		del = require('del'),
		argv   = require('minimist')(process.argv);
		gulpif = require('gulp-if');
		prompt = require('gulp-prompt');
		rsync  = require('gulp-rsync');
		join = path.join;


var	COMPONENTS = 'components'
		TEMPLATES = [join(COMPONENTS, '**/*.html'), 'index.html'],
		STYLES = join(COMPONENTS, '**/*.css'),
		SCRIPTS = join(COMPONENTS, '**/*.js'),
		DEST = 'out',
		DEPLOY = 'out'


gulp.task('styles', function() {

	var processors = [
		autoPrefixer({browsers: ['last 2 versions']}),
		minify()
	];

	return gulp.src(STYLES)
		.pipe(plumber({
			errorHandler: notify.onError(function(err) {
				return {
					title: "CSS",
					message: err.message
				}
			})
		}))
		.pipe(sourceMaps.init())
		.pipe(less())
		.pipe(postCss(processors))
		.pipe(sourceMaps.write())
		.pipe(gulp.dest(DEST));
});


gulp.task('templates', function() {
	return gulp.src(TEMPLATES)
		.pipe(plumber())
		.pipe(gulp.dest(DEST));
});


gulp.task('js', function() {

	return gulp.src(SCRIPTS)
		.pipe(plumber({
			errorHandler: notify.onError(function(err) {
				return {
					title: "JS",
					message: err.message
				}
			})
		}))
		.pipe(gulp.dest(DEST));
});


gulp.task('clean:dist', function() {
	return del.sync(DEST);
});


gulp.task('templates:sync', ['templates'], function(done) {
	browserSync.reload();
	done();
});


gulp.task('styles:sync', ['styles'], function(done) {
	browserSync.reload();
	done();
});


gulp.task('js:sync', ['js'], function(done) {
	browserSync.reload();
	done();
});


gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: './out'
		},
	})
	gulp.watch(join(TEMPLATES), ['templates:sync']);
	gulp.watch(join(STYLES), ['styles:sync']);
	gulp.watch(join(SCRIPTS), ['js:sync']);
})


gulp.task('watch', function() {
	runSequence('clean:dist', ['templates', 'styles', 'js', 'browserSync'])
	gulp.watch(join(TEMPLATES), ['templates']);
	gulp.watch(join(STYLES), ['styles']);
	gulp.watch(join(SCRIPTS), ['js']);
})


gulp.task('build', function (callback) {
	runSequence('clean:dist',
		['templates', 'styles', 'js'],
		callback
	)
})

gulp.task('deploy', function() {
	gulp.src('out/**')
		.pipe(rsync({
			root:'out/',
			hostname: '77.222.40.32',
			username: 'nordwestru',
			destination: 'chet/public_html/my-components',
			progress: true,
			incremental: true,
			relative: true,
			emptyDirectories: true,
			recursive: true,
			clean: true,
			exclude: [],
		}));
});
