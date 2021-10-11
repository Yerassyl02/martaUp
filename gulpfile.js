const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const imagecomp = require('compress-images');

function browsersync() {
  browserSync.init({
    server: {baseDir: 'app/' },
    notify: false,
    online: true,
    browser: 'chrome'
  })
}

function scripts() {
  return src(['app/js/main.js'])
  .pipe(concat('app.min.js'))
  .pipe(uglify())
  .pipe(dest('app/js/'))
  .pipe(browserSync.stream())
}

function styles() {
  return src('app/sass/main.sass')
  .pipe(sass())
  .pipe(concat('app.min.css'))
  .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
  .pipe(cleancss(( { level: { 1: { specialComments: 0 } } } )))
  .pipe(dest('app/css/'))
  .pipe(browserSync.stream())
}

async function images() {
	imagecomp(
		"app/imgs/src/**/*", // Берём все изображения из папки источника
		"app/imgs/dest/", // Выгружаем оптимизированные изображения в папку назначения
		{ compress_force: false, statistic: true, autoupdate: true }, false, // Настраиваем основные параметры
		{ jpg: { engine: "mozjpeg", command: ["-quality", "75"] } }, // Сжимаем и оптимизируем изображеня
		{ png: { engine: "pngquant", command: ["--quality=75-100", "-o"] } },
		{ svg: { engine: "svgo", command: "--multipass" } },
		{ gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
		function (err, completed) { // Обновляем страницу по завершению
			if (completed === true) {
				browserSync.reload()
			}
		}
	)
}

function cleanimg() {
	return del('app/imgs/dest/**/*', { force: true }) // Удаляем все содержимое папки "app/images/dest/"
}

function buildcopy() {
	return src([ // Выбираем нужные файлы
		'app/css/**/*.min.css',
		'app/js/**/*.min.js',
		'app/imgs/dest/**/*',
		'app/**/*.html',
		], { base: 'app' }) // Параметр "base" сохраняет структуру проекта при копировании
	.pipe(dest('dist')) // Выгружаем в папку с финальной сборкой
}

function cleandist() {
	return del('dist/**/*', { force: true }) // Удаляем все содержимое папки "dist/"
}

function startwatch() {
  watch( 'app/**/*', styles)
  watch(['app/**/*.js', '!app/**/*.min.js'], scripts)
  watch('app/**/*.html').on('change', browserSync.reload)
  watch('app/imgs/src/**/*', images);
}

exports.browsersync = browsersync;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;
exports.cleanimg = cleanimg;

exports.build = series(cleandist, styles, scripts, images, buildcopy);

exports.default = parallel(styles, scripts, browsersync, startwatch)