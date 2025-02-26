// webpack.config.js
const path = require("path");

module.exports = {
    mode: "development",            // oder "production" für optimierten Build
    entry: "./js/taskViewClient.js", // Dein Entry-Point
    output: {
        filename: "bundle.taskView.js",              // Name der gebündelten Datei
        path: path.resolve(__dirname, "public/dist"), // Pfad, wo das Bundle landet
    },
};
