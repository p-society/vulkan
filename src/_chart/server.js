import express from "express";
import fs from "fs";
import open from "open";

const app = express();
const PORT = 3000;

app.get("/api/logs", (req, res) => {
    const logs = fs.readFileSync("performance.log", "utf8")
        .split("\n")
        .filter(line => line)
        .map(line => JSON.parse(line));
    res.json(logs);
});

app.get("/", (req, res) => {
    res.sendFile("/home/majorbruteforce/codes/vulkan/src/_chart/public/index.html");
});

app.use(express.static("/home/majorbruteforce/codes/vulkan/src/_chart/public"));

app.listen(PORT, () => {

    open(`http://localhost:${PORT}`)
        .then(() => {})
        .catch(err => console.error("Failed to launch browser:", err));
});