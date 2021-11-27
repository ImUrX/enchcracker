/* eslint-env node */
const express = require("express");
const app = express();

app.use("/", express.static("./www/", {
    setHeaders: res => {
        res.set("Cross-Origin-Opener-Policy", "same-origin");
        res.set("Cross-Origin-Embedder-Policy", "require-corp");
    }
}));
app.get("/pkg/libenchcrack.js", (req, res) => {
    res.type("js"); // enforce mime type because workers are SAFE
    res.sendFile("./www/pkg/libenchcrack.js");
});
app.get("/pkg-threads/libenchcrack.js", (req, res) => {
    res.type("js"); // enforce mime type because workers are SAFE
    res.sendFile("./www/pkg-threads/libenchcrack.js");
});

app.listen(8000, () => console.log("enchcracker started on port 8000")); // eslint-disable-line no-console