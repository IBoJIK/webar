let gulp = require("gulp"),
	sass = require("gulp-sass"),
	/* Автоматическое обновление (команда "npm i browser-sync --save-dev") */
	browserSync = require('browser-sync'),

	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	autoprefixer = require('gulp-autoprefixer');

let ngrok = require("ngrok"),
	config = {
		server: {
			baseDir: "app/"//укажем дирректорию где лежит index.html
		},
		//tunnel: true,
		host: 'localhost',
		port: 3000,
		directoryListing: true,
		logPrefix: ''
	};

gulp.task('webserver', function () {
	browserSync(config, function (err, bs) {
		ngrok.connect({
			proto: 'http', // http|tcp|tls 
			addr: bs.options.get('port'), // port or network address 
		}, function (err, url) {
		});
	});
});

/* Берет scss и трансформирует в css (ввод команды "gulp scss") */
gulp.task('scss', function () {
	return gulp.src('app/scss/**/*.scss')
		.pipe(sass({ outputStyle: 'compressed' }))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 8 versions']
		}))
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({ stream: true }))
});

gulp.task('css', function () {
	return gulp.src([
		'node_modules/normalize.css/normalize.css'
	])
		.pipe(concat('_libs.scss'))
		.pipe(gulp.dest('app/scss'))
		.pipe(browserSync.reload({ stream: true }))
});

gulp.task('html', function () {
	return gulp.src('app/*.html')
		.pipe(browserSync.reload({ stream: true }))
});

// gulp.task('script', function () {
// 	return gulp.src('app/js/*.js')
// 		.pipe(browserSync.reload({ stream: true }))
// });

gulp.task('js', function () {
	return gulp.src([
		'node_modules/@google/model-viewer/dist/model-viewer.js'
	])
		.pipe(concat('libs.min.js'))
		.pipe(gulp.dest('app/js'))
		.pipe(browserSync.reload({ stream: true }))
});

//Автоматическое обновление
gulp.task('browser-sync', function () {
	browserSync.init({
		server: {
			baseDir: "app/"
		}
	});
});

/* Автоматическое обновление css 
(без ввода команды "gulp scss") при изменениях в scss (ввод команды "gulp watch") */
gulp.task('watch', function () {
	gulp.watch('app/scss/**/*.scss', gulp.parallel('scss'))
	gulp.watch('app/*.html', gulp.parallel('html'))
	// gulp.watch('app/js/*.js', gulp.parallel('script'))
});

/* Вводим команду "gulp" активируется препроцессор и автоматическое обновление страницы*/
gulp.task('default', gulp.parallel('css', 'scss',  'webserver', 'watch'))