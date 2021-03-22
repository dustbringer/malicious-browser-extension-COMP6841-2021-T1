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
        this.dataFolder = "backend/data/";
        this.makePath = (uid) => `${this.dataFolder}${uid}.json`;
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
        const path = this.makePath(uid);
        if (this.data[uid]) {
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

    addPassword(uid, data) {
        // User not already added
        if (this.getUser(uid)) {
            if (!this.data[uid].passwords) {
                this.data[uid].passwords = [data];
            } else {
                this.data[uid].passwords.push(data);
            }
            this.updateUser(uid);
        }
    }
}
