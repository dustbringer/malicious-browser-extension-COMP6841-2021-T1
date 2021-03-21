import fs from "fs";

const writeJSON = (path, data) => {
    fs.writeFile(path, JSON.stringify(data, null, 2), function (err) {
        if (err) {
            console.log(err);
        }
    });
};

const readJSON = (path) => JSON.parse(fs.readFileSync(path, "utf8"));
const fileExists = (path) => fs.existsSync(path);

export default class SaveData {
    constructor() {
        this.path = "backend/data/data.json";
        if (fileExists(this.path)) {
            this.data = readJSON(this.path);
        } else {
            this.data = { users: [] };
            writeJSON(this.path, this.data);
        }
        console.log(this.data);
    }

    appendToFile(fileName, text) {
        return fileName + text; // to satisfy eslint
    }

    placeholder(text) {
        console.log(`called ${text}`);
        this.data.users.push(text);
        writeJSON(this.path, { ...this.data });
    }
}
