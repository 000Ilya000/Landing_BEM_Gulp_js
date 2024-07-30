const { src, dest, watch, parallel, series } = require("gulp"); // подключаем необходимые модули gulp
const scss = require("gulp-sass")(require("sass")); // подключаем модуль для конвертации scss в css с помощью sass
const concat = require("gulp-concat"); // подключаем модуль для объединения файлов в один
const uglify = require("gulp-uglify-es").default; // подключаем модуль для минификации js
const browserSync = require("browser-sync").create(); // подключаем модуль для автоматического обновления страницы при изменении html
const clean = require("gulp-clean"); // подключаем модуль для очистки папки dist
const avif = require("gulp-avif"); // Конвертация изображений в формат AVIF для лучшего сжатия и качества
const webp = require("gulp-webp"); // Конвертация изображений в формат WebP для уменьшения размера файлов
const imagemin = require("gulp-imagemin"); // Минификация изображений без значительной потери качества
const newer = require("gulp-newer"); // Кэширование обработанных файлов для ускорения сборки
const fonter = require("gulp-fonter"); // Фонтер для работы со шрифтами
const ttf2woff2 = require("gulp-ttf2woff2"); // Работа со шрифтами ttf2 woff2
//
//
//__

// функция обработки шрифтов
function fonts() {
  return src("app/fonts/src/*.*")
    .pipe(
      fonter({
        formats: ["woff", "ttf"], // переделывает все форматы в woff и ttf
      })
    )
    .pipe(src("app/fonts/*.ttf")) // переделывает все а woff и woff2
    .pipe(ttf2woff2())
    .pipe(dest("app/fonts"));
}

// функция обработки картинок
function images() {
  return src(["app/images/src/*.*", "!app/images/src/*.svg"]) //обращается ко всем картинкам кроме svg
    .pipe(newer("app/images/src/*.*"))
    .pipe(avif({ quality: 75 })) // обрабатываем и сжимаем изображения в avif
    .pipe(imagemin()) // минифицируем изображения из оригинальной пачки
    .pipe(dest("app/images")); // выкладываем все в dist
}

// функция для обработки js файлов
function scripts() {
  return src(["app/js/main.js"])
    .pipe(concat("main.min.js")) // объединяем файлы в main.min.js
    .pipe(uglify()) // минифицируем js
    .pipe(dest("app/js")) // выгружаем результат в папку app/js
    .pipe(browserSync.stream()); // обновляем браузер
}

// функция для обработки scss файлов
function styles() {
  return src("app/styles/scss/main.scss")
    .pipe(concat("style.min.css")) // объединяем файлы в style.min.css
    .pipe(scss({ outputStyle: "compressed" })) // конвертируем scss в css и минифицируем
    .pipe(dest("app/styles/css")) // выгружаем результат в папку app/css
    .pipe(browserSync.stream()); // обновляем браузер
}

// функция сторожа, который автоматизирует слежку за файлами и выполнениями других функций
function watching() {
  watch(["app/images/src"], images); // следим за папкой картинок (images/src)
  watch(["app/styles/scss/main.scss"], styles); // следим за scss файлами и запускаем функцию styles при изменении
  watch(["app/js/main.js"], scripts); // следим за main.js и запускаем функцию scripts при изменении
  watch(["app/*.html"]).on("change", browserSync.reload); // следим за html файлами и обновляем браузер при изменении
}

// функция для запуска сервера
function browsersync() {
  browserSync.init({
    server: {
      baseDir: "app/", // указываем папку для сервера
    },
  });
}

// функция для сборки проекта в папку dist
function building() {
  return src(
    [
      "app/images/*.*",
      "app/styles/css/style.min.css",
      "app/js/main.min.js",
      "app/**/*.html",
      "app/fonts/*.*",
      "!app/images/*.svg",
    ],
    {
      base: "app",
    }
  ).pipe(dest("dist")); // копируем файлы из app в dist
}

// функция для очистки папки dist
function cleanDist() {
  return src("dist").pipe(clean());
}

// экспортируем функции для использования в командной строке
exports.browsersync = browsersync;
exports.fonts = fonts;
exports.styles = styles;
exports.building = building;
exports.scripts = scripts;
exports.watching = watching;
exports.images = images;

// экспортируем сборку проекта
exports.build = series(cleanDist, building);

// экспортируем задачу по умолчанию
exports.default = parallel(
  styles,
  images,
  fonts,
  scripts,
  browsersync,
  watching
);
