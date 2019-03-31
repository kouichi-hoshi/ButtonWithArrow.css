//const fs           = require('fs');
const gulp         = require('gulp');
const sass         = require('gulp-sass');
const plumber      = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps   = require('gulp-sourcemaps');
const notify       = require('gulp-notify');
const htmlhint     = require('gulp-htmlhint');

// ディレクトリ設定
const dir = {
	src: '_src',
	dist: 'dist'
};

//copyタスクのソース
const copySource = [
	dir.src + '/**/**.html',
	dir.src + '/**/vendor/**',
];

//sassファイル監視対象指定
const watchSass = [
	dir.src + '/_sass/**/*.scss',
];

// デスクトップにエラー通知を出す
const errorOpt = {
	errorHandler: notify.onError('Error: [エラー発生!] <%= error %>')
};

//指定したディリクトリのsassファイルを指定したディリクトリにコンパイルする
gulp.task('sass', () => {
	return (
		gulp.src(watchSass)
			.pipe(plumber(errorOpt))
			.pipe(sourcemaps.init())
			.pipe(sass({outputStyle: 'expanded'}))
			.pipe(autoprefixer("last 3 version"))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(dir.dist))
	);
});

//指定したファイルをコピーする
gulp.task('copy', () => {
	return (
		gulp.src(copySource,{base: dir.src}) //,{base: dir.src}と記述するとコピー元のディリクトリ構造を維持する
	   .pipe(gulp.dest( dir.dist ))
	);
});

//html構文チェック
gulp.task('htmlhint', () => {
	return (
		gulp.src(dir.dist + '/**/*.html')
		.pipe(htmlhint())
		.pipe(htmlhint.reporter())
	);
});

// watch sassコンパイル実行、指定ファイルをdistにコピー実行、htmlhint実行
gulp.task("watch", () => {
	gulp.watch(watchSass, gulp.task('sass'));
	gulp.watch(dir.dist + '/**/*.html', gulp.task('htmlhint'));
	gulp.watch(copySource, gulp.task('copy'));
});

//  default（build） sassコンパイル、指定ファイルをdistにコピー、htmlhint 各一回実行
gulp.task('default',gulp.series('sass', 'htmlhint', 'copy', (done) => {
	done();
}));