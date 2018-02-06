var gulp          = require('gulp'),
	sass          = require('gulp-sass'),
	concat        = require('gulp-concat'),
	rename        = require('gulp-rename'),
	uglify        = require('gulp-uglify'),
	minifyCss     = require('gulp-minify-css'),
	jshint        = require('gulp-jshint'),
	rtlcss        = require('gulp-rtlcss'),
	cssbeautify   = require('gulp-cssbeautify'),
	headerComment = require('gulp-header-comment'),
	version       = require('gulp-version-number'),
	fileinclude   = require('gulp-file-include'),
	clean         = require('gulp-clean'),
	sourcemaps    = require('gulp-sourcemaps');


var globs = {
	jsTar        : 'examples/assets/js',
	cssTar       : 'examples/assets/css',
	cssRTLTar    : 'examples/assets/css/rtl',
	cleanFilesTar: [ 'examples/include-*.html', '_components/**/scss/*.css', '_components/**/scss-rtl/*.css' ],
	htmlFiles    : '_components/**/*.{html, htm}',
    js           : '_components/**/js/*.js',
    scss         : '_components/**/scss/*.scss',
	scssRTL      : '_components/**/scss-rtl/*.scss'
};


var customComment = `
		## Project Name        :  Uix Kit
		## Description         :  Free Responsive HTML5 UI Kit for Fast Web Design Based On Bootstrap
		## Version             :  0.0.8
		## Last Update         :  <%= moment().format( "MMMM D, YYYY" ) %>
		## Created             :  by UIUX Lab (https://uiux.cc)
		## Contact Us          :  uiuxlab@gmail.com
		## Compatible With     :  Bootstrap 3.x, Chinese, English
		## Compatible Browsers :  IE9, IE10, IE11, Firefox, Safari, Opera, Chrome, Edge
		## Released under the MIT license.
	`;



/*! 
 *************************************
 * Automatically add version number to request for preventing browser cache
 *************************************
 */
function base64_encode(str) {
	// Cross-Browser Method (compressed)  
	// Create Base64 Object  
	var Base64 = {
		_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
		encode: function(e) {
			var t = "";
			var n, r, i, s, o, u, a;
			var f = 0;
			e = Base64._utf8_encode(e);
			while (f < e.length) {
				n = e.charCodeAt(f++);
				r = e.charCodeAt(f++);
				i = e.charCodeAt(f++);
				s = n >> 2;
				o = (n & 3) << 4 | r >> 4;
				u = (r & 15) << 2 | i >> 6;
				a = i & 63;
				if (isNaN(r)) {
					u = a = 64
				} else if (isNaN(i)) {
					a = 64
				}
				t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
			}
			return t
		},
		decode: function(e) {
			var t = "";
			var n, r, i;
			var s, o, u, a;
			var f = 0;
			e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
			while (f < e.length) {
				s = this._keyStr.indexOf(e.charAt(f++));
				o = this._keyStr.indexOf(e.charAt(f++));
				u = this._keyStr.indexOf(e.charAt(f++));
				a = this._keyStr.indexOf(e.charAt(f++));
				n = s << 2 | o >> 4;
				r = (o & 15) << 4 | u >> 2;
				i = (u & 3) << 6 | a;
				t = t + String.fromCharCode(n);
				if (u != 64) {
					t = t + String.fromCharCode(r)
				}
				if (a != 64) {
					t = t + String.fromCharCode(i)
				}
			}
			t = Base64._utf8_decode(t);
			return t
		},
		_utf8_encode: function(e) {
			e = e.replace(/\r\n/g, "\n");
			var t = "";
			for (var n = 0; n < e.length; n++) {
				var r = e.charCodeAt(n);
				if (r < 128) {
					t += String.fromCharCode(r)
				} else if (r > 127 && r < 2048) {
					t += String.fromCharCode(r >> 6 | 192);
					t += String.fromCharCode(r & 63 | 128)
				} else {
					t += String.fromCharCode(r >> 12 | 224);
					t += String.fromCharCode(r >> 6 & 63 | 128);
					t += String.fromCharCode(r & 63 | 128)
				}
			}
			return t
		},
		_utf8_decode: function(e) {
			var t = "";
			var n = 0;
			var r = c1 = c2 = 0;
			while (n < e.length) {
				r = e.charCodeAt(n);
				if (r < 128) {
					t += String.fromCharCode(r);
					n++
				} else if (r > 191 && r < 224) {
					c2 = e.charCodeAt(n + 1);
					t += String.fromCharCode((r & 31) << 6 | c2 & 63);
					n += 2
				} else {
					c2 = e.charCodeAt(n + 1);
					c3 = e.charCodeAt(n + 2);
					t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
					n += 3
				}
			}
			return t
		}
	}
	// Encode the String  
	return Base64.encode(unescape(encodeURIComponent(str)));
}


//Delete include files
gulp.task('clean-scripts', [ 'html' ], function () {
  return gulp.src( globs.cleanFilesTar, {read: true})
	.pipe(clean());
});




gulp.task('html', function() {
	
	var ver = new Date().getTime();
	ver     = base64_encode( ver );
	
	var versionConfig = {
		'value'    : '%MDS%',
		'replaces' : [  
			[/assets\/css\/rtl\/uix-kit-rtl(.*)\"/ig, 'assets\/css\/rtl\/uix-kit-rtl.css?ver=' + ver + '\"' ],
			[/assets\/css\/uix-kit.min(.*)\"/ig, 'assets\/css\/uix-kit.min.css?ver=' + ver + '\"' ],
			[/assets\/css\/uix-kit.IE(.*)\"/ig, 'assets\/css\/uix-kit.IE.css?ver=' + ver + '\"' ],
			[/assets\/js\/uix-kit.min(.*)\"/ig, 'assets\/js\/uix-kit.min.js?ver=' + ver + '\"' ]
		],
	};

	
  console.log( 'cache:' + ver );
	
  return gulp.src( globs.htmlFiles )

		//File include
		.pipe(fileinclude({
		  prefix: '@@',
		  basepath: '@file'
		}))

		//Add version
		.pipe(version( versionConfig ))

		//Remove a folder structure when copying files in gulp
		.pipe(rename({dirname: ''}))
		.pipe(gulp.dest( 'examples' ));
	
	

	
	
});	




/*! 
 *************************************
 * Javascript & CSS tasks
 *************************************
 */
//Compile SCSS (RTL)
gulp.task('styles', function(){
  return gulp.src( globs.scssRTL )
    .pipe(sourcemaps.init())
	.pipe(concat('uix-kit-rtl.scss'))
	.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))

	.pipe(cssbeautify({
		indent: '    ',
		openbrace: 'end-of-line',
		autosemicolon: true
	}))


	.pipe(headerComment(`
		---------------------------
		MAIN TEMPLATE STYLES (RTL)
		---------------------------

		Adding support for language written in a Right To Left (RTL) direction is easy -
		it's just a matter of overwriting all the horizontal positioning attributes
		of your CSS stylesheet in a separate stylesheet file named rtl.css.

		` + customComment + `

	`))
    .pipe(sourcemaps.write({includeContent: false}))
	.pipe(gulp.dest( globs.cssRTLTar ));

});	

//Compile SCSS
gulp.task('sass', function(){
	
  gulp.start( 'clean-scripts' );
  return gulp.src( globs.scss )
    .pipe(sourcemaps.init())
    .pipe(concat('uix-kit.scss'))
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
  
	.pipe(cssbeautify({
		indent: '    ',
		openbrace: 'end-of-line',
		autosemicolon: true
	}))
  

	.pipe(headerComment(`
		---------------------------
		MAIN TEMPLATE STYLES
		---------------------------

		` + customComment + `

	`))
    .pipe(sourcemaps.write({includeContent: false}))
    .pipe(gulp.dest( globs.cssTar ))
  
    .pipe(minifyCss())
	.pipe(rename({
		suffix: '.min'
	}))
	
	.pipe(headerComment( customComment))
	.pipe(gulp.dest( globs.cssTar ));
	
	
});


//Merge JS
gulp.task('jshint', function () {
	return gulp.src( globs.js )
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('scripts', function() {
	
	 gulp.start( 'clean-scripts' );
     return gulp.src( globs.js )
	    .pipe(sourcemaps.init())
        .pipe(concat('uix-kit.js'))
	 
		.pipe(headerComment(`
			---------------------------
			MAIN SCRIPTS
			---------------------------

			` + customComment + `

		`))
	 
	    .pipe(sourcemaps.write({includeContent: false}))
	    .pipe(gulp.dest( globs.jsTar ))
	 
	    //Compress
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
	
	    .pipe(headerComment( customComment))
	    .pipe(gulp.dest( globs.jsTar ));

	
	
});




/*! 
 *************************************
 * Auto spy the project files
 *************************************
 */
gulp.watch('files-to-watch', ['tasks_to_run']); 
gulp.task('default', ['jshint'], function() {
    gulp.start( [ 'sass', 'scripts', 'styles', 'watch' ] );
});

gulp.task('watch', function(){
	gulp.watch( globs.scssRTL, [ 'styles' ] ); 
	gulp.watch( globs.scss, [ 'sass' ] ); 
	gulp.watch( globs.js, [ 'scripts' ] ); 
	gulp.watch( globs.htmlFiles, [ 'clean-scripts' ] ); 
	
	
})
