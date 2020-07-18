import { src, dest, parallel, series, watch } from "gulp";
import babel from "gulp-babel";
import concat from "gulp-concat";
import sass from "gulp-dart-sass";
import autoPrefixer from "gulp-autoprefixer";
import uglify from "gulp-uglify";
import bs from "browser-sync";
import cssNano from "gulp-cssnano";

const polyfill = "./node_modules/babel-polyfill/dist/polyfill.min.js";
const server = bs.create();

export function js() {
  return src(["./js/*.js", polyfill], { sourcemaps: true })
    .pipe(
      babel({
        presets: [
          [
            "@babel/preset-env",
            {
              useBuiltIns: "entry",
            },
          ],
        ],
      })
    )
    .pipe(uglify())
    .pipe(concat("index.min.js"))
    .pipe(dest("dist/js/"));
}

export function css() {
  return src("./sass/*.scss", { sourcemaps: true })
    .pipe(sass().on("error", sass.logError))
    .pipe(autoPrefixer())
    .pipe(cssNano())
    .pipe(dest("css/"));
}

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: "./",
    },
  });
  done();
}

export const watchJS = watch("js/*", js);
export const watchCSS = watch("sass/*", css);
export const build = parallel(js, css);

export const dev = series(build, serve, function devwatch() {
  watch("js/*", series(js, reload));
  watch("sass/*", series(css, reload));
});

export default build;
