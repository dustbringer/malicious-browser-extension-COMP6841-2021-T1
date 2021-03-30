const toggles = ["passwordWatcher", "historyWatcher", "keyPressWatcher"];
const toggleElems = {};
toggles.forEach((t) => {
    toggleElems[t] = document.getElementById(t);
});

// Check boxes
chrome.storage.sync.get(toggles, (res) => {
    toggles.forEach((t) => {
        if (!res[t]) {
            const obj = {};
            obj[t] = false;
            chrome.storage.sync.set(obj);
            toggleElems[t].checked = false;
        } else {
            toggleElems[t].checked = res[t];
        }
    });
});

// Listeners on check and uncheck
toggles.forEach((t) => {
    toggleElems[t].addEventListener("change", () => {
        const obj = {};
        obj[t] = toggleElems[t].checked;
        chrome.storage.sync.set(obj);
    });
});

// Reload button
const reload = document.getElementById("reload");
reload.onclick = () => chrome.runtime.reload();
