const gulp = require('gulp');
const sass = require('gulp-sass'); //编译sass
const cssmin = require('gulp-clean-css'); //压缩css
const sourcemaps = require('gulp-sourcemaps'); //查错是显示编译前的文件
const webpack = require('webpack');
const uglify = require('gulp-uglify');
const webpackStream = require('webpack-stream');
const runSequence = require('run-sequence'); //指定顺序运行并发任务
const revCollector = require('gulp-rev-collector'); //版本控制
const rev = require('gulp-rev');
const browserSync = require('browser-sync').create(); //建立本地服务器
const bsReload = browserSync.reload; //服务器重载
const watch = require('gulp-watch'); //文件监听
const watchPath = require('gulp-watch-path'); //监听单个文件变化
const del = require('del'); //清理
const autoprefixer = require('gulp-autoprefixer');
const ifElse = require('gulp-if-else');
const base64 = require('gulp-base64');
const replace = require('gulp-replace');
const CDN = '';
var webpackConfig = require('./webpack.config.js'); //引入webpack配置
var BUILD = "DEV";

//开发环境定义路径
const src = {
	css: './src/css/**/*.css',
	js: './src/js/**/*.js',
	sass: './src/sass/**/*.scss',
	components: './src/components/**/.{vue,jsx}',
	images: './src/images/**/*.{jpg,gif,png,jpeg}',
	view: './src/**/*.html'
}
//导出路径
const public = {
	css: './public/css/',
	js: './public/js/',
	sass: './public/sass/',
	images: './public/images/',
	view: './public/'
}

//拷贝文件
function cp(from, to) {
	gulp.src(from)
		.pipe(gulp.dest(to));
}

//拷贝html
gulp.task('views', function () {
	return gulp.src(src.view)
		.pipe(gulp.dest(public.view));
});

gulp.task('views:build', function () {
	return gulp.src(src.view)
		.pipe(replace('../../', '' + CDN + '/')) // 替换html页面静态资源地址
		.pipe(replace('../', '' + CDN + '/')) // 替换html页面静态资源地址
		.pipe(replace('./', '' + CDN + '/'))
		.pipe(gulp.dest(public.view));
});

//拷贝图片
gulp.task('images', function () {
	cp(src.images, public.images);
});

//编译sass
gulp.task('sass', function () {
	gulp.src(['src/sass/*.scss'])
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(cssmin())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./src/css'))
		.pipe(gulp.dest('public/css/'));
});

//拷贝js
gulp.task('js', function () {
	cp('./src/js/lib/*.js', './public/js/lib');
	return compileJS(['./src/js/**/*.js', '!./src/js/lib/*.js']);
});

//清理
gulp.task('clean', function () {
	del(['public/**/*']);
});

gulp.task('js:build', function () {
	cp('./src/js/lib/*.js', './src/tmp/js/lib');
	return compileJS(['./src/js/**/*.js', '!./src/js/lib/*.js'], './src/tmp');
});

gulp.task('ugjs:build', function () {
	return gulp.src('./src/tmp/**/*.js')
		.pipe(ifElse(BUILD === 'PUBLIC', uglify))
		.pipe(gulp.dest('./public/'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('./public/'));
});

gulp.task('css:build', function () {
	return gulp.src(src.css)
		.pipe(base64({
			extensions: ['png', /\.jpg#datauri$/i],
			maxImageSize: 10 * 1024 // bytes,
		}))
		.pipe(gulp.dest(public.css))
		.pipe(rev.manifest())
		.pipe(gulp.dest(public.css));
});

//引用webpack对js进行操作
function compileJS(path, dest) {
	console.log("执行webpack");
	dest = dest || './public';
	webpackConfig.output.publicPath = BUILD === 'PUBLIC' ? '' + CDN + '/' : '/';

	return gulp.src(path)
		.pipe(webpackStream(webpackConfig))
		.on('error', function (err) {
			this.end()
		})
		.pipe(gulp.dest(dest))
		.pipe(bsReload({
			stream: true
		}));
}

//监听变化
function dev() {
	watch([src.view]).on('change', function () {
		runSequence('views', function () {
			bsReload()
		});
	});
	watch([src.sass]).on('change', function () {
		runSequence('sass', function () {
			compileJS(['./src/js/main.js']);
		});
	});
	watch([src.js], function (event) {
		var paths = watchPath(event, src.js, public.js);
		var sp = paths.srcPath.indexOf('\\') > -1 ? '\\' : '/';

		if (paths.srcPath.split(sp).length === 3) { // 共有库情况,要编译所有js
			compileJS(['./src/js/**/*.js', '!./src/js/lib/*.js']);
		} else { // 否则 只编译变动js
			compileJS(paths.srcPath);
		}
	});
	watch(['./src/components/**/*.vue'], function (event) {
		compileJS(['./src/js/main.js']);
	});
};

//开发环境
gulp.task('dev', function () {
	webpackConfig.plugins.push(new webpack.DefinePlugin({
		NODE_ENV: JSON.stringify(process.env.NODE_ENV) || 'dev'
	}));
	runSequence('images', 'js', 'sass', 'views', function () {
		browserSync.init({ // 静态服务器
			startPath: "/",
			server: {
				baseDir: "./public"
			},
			notify: false
		});
		dev();
	})
})

//生产环境
gulp.task('default', function () {
	cp('./src/favicon.ico', './public/');
	BUILD = 'PUBLIC';
	webpackConfig.plugins.push(new webpack.DefinePlugin({
		NODE_ENV: JSON.stringify(process.env.NODE_ENV) || 'production'
	}));
	runSequence('clean', 'sass', 'css:build', 'js:build', 'ugjs:build', 'images', 'views:build', function () {
		del(['./src/tmp'])
	});
});