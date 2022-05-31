const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const fs = require("fs");

const audioList = require("./lib");
const logger = require("./core/logger");

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
// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser());
// initialize express-session to allow us track the logged-in user across sessions.
app.use(
    session({
        key: "user_sid",
        secret: "hoanganh",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 600000,
        },
    }),
);

app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie("user_sid");
    }
    next();
});

// middleware function to check for logged-in users
const sessionChecker = (req, res, next) => {
    if (!req.session.user || !req.cookies.user_sid) {
        res.redirect("/login");
    }
    next();
};

app.get("/", sessionChecker, (req, res) => {
    res.sendFile(path.join(__dirname, "/public/home.html"));
});

app.route("/login")
    .get((req, res) => {
        res.sendFile(path.join(__dirname, "/public/login.html"));
    })
    .post((req, res) => {
        const { username } = req.body;

        if (username) {
            req.session.user = username;
            res.redirect("/");
        }
    });

app.get("/list", sessionChecker, (req, res) => res.json(audioLists));

// eslint-disable-next-line consistent-return
app.get("/play/:id", sessionChecker, (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "requires a audio id" });
    }
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

module.exports = app;
