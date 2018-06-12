var fs           = require('fs');
var gulp         = require('gulp');
var sass         = require('gulp-sass');
var plumber      = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps   = require('gulp-sourcemaps');
var notify       = require('gulp-notify');
var watch        = require('gulp-watch');
var htmlhint     = require('gulp-htmlhint');

// ディレクトリ設定
var dir = {
	src: '_src',
	dist: 'dist'//WordPressのテーマ格納ディリクトリを指定
};

//copyタスクのソース
var copySource = [
	dir.src + '/**/',
	'!' + dir.src + '/_*/',
	'!' + dir.src + '/_*/**/',
];

//sassファイル監視対象指定
var watchSass = [
	dir.src + '/_sass/**/*.scss',
]

// デスクトップにエラー通知を出す
var errorOpt = {
	errorHandler: notify.onError('Error: [エラー発生!] <%= error %>')
};

//指定したディリクトリのsassファイルを指定したディリクトリにコンパイルする
gulp.task('sass', function() {
	gulp.src(watchSass)
		.pipe(plumber(errorOpt))
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'expanded'}))
		.pipe(autoprefixer("last 3 version"))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(dir.dist));
});


//指定したファイルをコピーする
gulp.task('copy', function() {
	gulp.src(copySource,{base: dir.src}) //,{base: dir.src}と記述するとコピー元のディリクトリ構造を維持する
   .pipe(gulp.dest( dir.dist ));
});

//html構文チェック
gulp.task('htmlhint', function(){
	gulp.src(dir.dist + '/**/*.html')
	.pipe(htmlhint())
	.pipe(htmlhint.reporter());
});

//指定したディリクトリ、ファイルを監視してタスクを実行する
gulp.task('watch', function () {
	watch(watchSass, function(){
		gulp.start('sass');
	});
	watch(copySource, function(){
		gulp.start('copy');
	});
	// watch(dir.dist + '/**/*.html', function(){
	// 	gulp.start('htmlhint');
	// });
});

// デフォルトのgulpコマンドで実行されるタスクを指定
gulp.task('default', ['sass', 'copy', 'htmlhint']);


