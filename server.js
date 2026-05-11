// server.js

console.log("Starting server...")
const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get("/male.html", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "male.html"));
});

app.get("/female.html", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "female.html"));
});

app.get("/male-product.html", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "male-product.html"));
});

app.get("/female-product.html", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "female-product.html"));
});