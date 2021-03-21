// Backend calls
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

const addUser = (uid) => {
    const data = {
        uid: uid,
        extension_id: chrome.runtime.id,
        date_created: new Date().toString(),
    };
    postRequest("/user/add/", data)
        .then((ret) => console.log(ret))
        .catch((err) => console.log(err.message));
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

chrome.runtime.onInstalled.addListener((details) => {
    // Made unique identifier for this user
    if (details.reason === "install" || details.reason === "update") {
        chrome.storage.sync.get("userid", function (items) {
            const userid = items.userid ? items.userid : getRandomToken();
            chrome.storage.sync.set({ userid: userid });
            addUser(userid);
        });
    }

    chrome.contextMenus.create({
        id: "sampleContextMenu",
        title: "Sample Context Menu",
        contexts: ["page"],
    });

    // Get get past 10 elements in history
    chrome.history.search({ text: "", maxResults: 10 }, (data) => {
        console.log(data);
    });
});
