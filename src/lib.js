import fs from "fs";
import path from "path";

let id = 0;
export const getAllFiles = (dir, done) => {
    let results = [];
    // eslint-disable-next-line consistent-return
    fs.readdir(dir, (err, list) => {
        if (err) return done(err);
        let pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(file => {
            // eslint-disable-next-line no-param-reassign
            file = path.resolve(dir, file);
            fs.stat(file, (_err, stat) => {
                if (stat && stat.isDirectory()) {
                    getAllFiles(file, (__err, res) => {
                        results = results.concat(res);
                        // eslint-disable-next-line no-plusplus
                        if (!--pending) done(null, results);
                    });
                } else {
                    results.push(file);
                    // eslint-disable-next-line no-plusplus
                    if (!--pending) done(null, results);
                }
            });
        });
    });
};

function audioList(dir, done) {
    let audio = [];
    // eslint-disable-next-line consistent-return
    getAllFiles(dir, (err, results) => {
        if (err) return err;
        audio = results
            .filter(item => path.extname(item) === ".mp3")
            .map(item => ({
                // eslint-disable-next-line no-plusplus
                id: id++,
                name: path.basename(item, path.extname(item)),
                path: item,
            }));
        done(null, audio);
    });
}

export default audioList;
