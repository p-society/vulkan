import express from "express";
import fs from "fs";
import path from "path";

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
    console.log(`Server is running on http://localhost:${PORT}`);
});