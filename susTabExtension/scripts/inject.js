const links = document.links;

// Every link is a rick roll
Array.from(links).map((l) => {
    l.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
});
