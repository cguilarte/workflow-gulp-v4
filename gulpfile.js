const gulp = require('gulp');
const browserSync  = require( 'browser-sync');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify-es').default;
const cssnano = require('gulp-cssnano');
const imagemin = require('gulp-imagemin');
const autoprefixer = require('autoprefixer');
const plumber = require("gulp-plumber");
const babel = require('gulp-babel');
const postcss = require('gulp-postcss');
const gcmq = require('gulp-group-css-media-queries');
const cssnext = require('cssnext');
const precss = require('precss');
const request = require('request');
const path = require( 'path' );
const criticalcss = require("criticalcss");
const fs = require('fs');
const tmpDir = require('os').tmpdir();

//Configurations default
const config = {
    pathCss: './static/css/',
    pathJs: './static/js/',
    pathSass: './static/sass/',
    pathImg: './static/img/',
    serverHost: 'http://localhost:3001',
    fileCss: 'app.css',
    fileSass: 'app.scss',
    serverRun : this.serverHost
}
 
function cssCritical() {
    console.log('critical');
    let cssUrl = config.serverHost +'/'+ config.pathCss + config.fileCss;
    let cssPath = path.join( tmpDir, config.fileCss );
   
    request(cssUrl).pipe(fs.createWriteStream(cssPath)).on('close', function() {
    criticalcss.getRules(cssPath, function(err, output) {
        if (err) {
        throw new Error(err);
        } else {
        criticalcss.findCritical(config.serverHost, { rules: JSON.parse(output) }, function(err, output) {
            if (err) {
            throw new Error(err);
            } else {
                fs.writeFileSync('./'+config.pathCss+'critical.css', output );
            }
        });
        }
    });
    });
}

function css(){
    console.log('run sass');
    const processors = [ autoprefixer, cssnext, precss ];
    return gulp.src(config.pathSass + config.fileSass)
        .pipe(plumber())
        .pipe(sass({
            'outputStyle': 'compressed'
        }))
        .pipe(gcmq())
        .pipe(postcss(processors))
        .pipe(cssnano())
        .pipe(gulp.dest(config.pathCss))
        .pipe(browserSync.stream());
}

function images() {
    console.log('run imagen');
    gulp.src(config.pathImg + '**/*')
        .pipe(plumber())
        .pipe(imagemin())
        .pipe(gulp.dest(config.pathImg));
}

function javascript() {
    console.log('run javascripts');
    gulp.src(config.pathJs + '*.js')
        .pipe(plumber())
        .pipe(babel({       
            "presets": ["env"],
            "plugins": ["transform-remove-strict-mode"]
         }))
        .pipe(uglify())
        .pipe(gulp.dest(config.pathJs + 'dist'))
        .pipe(browserSync.stream());
}

function html() {
    console.log('run html');
    gulp.src('**/*.html')
    .pipe(plumber())
    .pipe(gulp.dest('./'));
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

gulp.watch(config.pathSass + '*.scss').on('change', function(){
    css();
    browserSync.reload;
});

}

//Task Default
const build = gulp.parallel(css, javascript, watch);
gulp.task('default', build);


//Task Critical Css - gulp critical
gulp.task('critical', function(done){
    cssCritical();
    done();
});

//Task Imagen - criticalgulp images
gulp.task('images', function(done){
    images();
    done();
});

exports.css = css;
exports.cssCritical = cssCritical;
exports.javascript = javascript;
exports.images = images;
exports.html = html;
exports.watch = watch;