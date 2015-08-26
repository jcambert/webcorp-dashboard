var gulp = require('gulp'), uglify=require('gulp-uglify'), concat = require("gulp-concat"), header = require('gulp-header');
 
gulp.task('compress_all', function() {
  return gulp.src('src/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});
var src=['./src/webcorp.js','./src/locationService.js','./src/configService.js','./src/webcorp.angular.js'];
var js='webcorp-core.js';
var min='webcorp-core.min.js';
var dest='./dist';
gulp.task('dist', function () {
    gulp.src(src) // path to your files
    .pipe(concat(js))  // concat and name it "concat.js"
    .pipe(gulp.dest(dest));
	
	gulp.src(src) // path to your files
    .pipe(concat(min))  // concat and name it "concat.js"
	.pipe(uglify())
    .pipe(gulp.dest(dest));
});