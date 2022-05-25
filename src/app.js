import express from "express";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";

import audioList from "./lib";
import logger from "./core/logger";

const app = express();

app.use(express.static(path.join(__dirname, "public")));

const audioPath = path.join(__dirname, "./public/assets/audios");

let audioLists = [];
logger.info(`Building index of audio files at ${audioPath}`);

audioList(audioPath, (err, data) => {
    audioLists = data;
    logger.info("Finished building index");
});

app.use(bodyParser.json({ limit: "10mb" }));
app.use(
    bodyParser.urlencoded({
        limit: "10mb",
        extended: true,
        parameterLimit: 50000,
    }),
);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/list", (req, res) => {
    res.json(audioLists);
});

// eslint-disable-next-line consistent-return
app.get("/play/:id", (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "requires a audio id" });
    }
    const { id } = req.params;
    const audioIndex = audioLists.findIndex(item => item.id.toString() === id);
    if (audioIndex < 0) {
        return res.status(400).json({ error: "id didn't match any records" });
    }

    const file = audioLists[audioIndex].path;

    fs.stat(file, (err, stats) => {
        let start;
        let end;
        const total = stats.size;

        const { range } = req.headers;
        if (range) {
            const positions = range.replace(/bytes=/, "").split("-");
            start = parseInt(positions[0], 10);
            end = positions[1] ? parseInt(positions[1], 10) : total - 1;
        } else {
            start = 0;
            end = total - 1;
        }
        const chunksize = end - start + 1;

        res.writeHead(200, {
            "Content-Range": `bytes ${start}-${end}/${total}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": "audio/mpeg",
        });

        const stream = fs.createReadStream(file, { start, end });
        stream
            .on("open", () => {
                stream.pipe(res);
            })
            .on("error", _err => {
                res.end(_err);
            });
    });
});
export default app;
