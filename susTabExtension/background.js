chrome.runtime.onInstalled.addListener(() => {
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
