/* eslint-env node */
const express = require("express");
const app = express();

app.use("/", express.static("./www/"));
app.get("/wasm/libenchcrack.js", (req, res) => {
    res.type("js"); // enforce mime type because workers are SAFE
    res.sendFile("./www/wasm/libenchcrack.js");
});

app.listen(8000, () => console.log("enchcracker started on port 8000")); // eslint-disable-line no-console