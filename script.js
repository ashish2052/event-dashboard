function loadPage(page) {
    fetch(`components/${page}.html`)
        .then(res => res.text())
        .then(html => {
            document.querySelector("#content").innerHTML = html;
        })
        .catch(err => {
            document.querySelector("#content").innerHTML =
                `<p style="color:red">Error loading ${page}.html</p>`;
        });
}

// default page
loadPage("cards");

// button switching
document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".active")?.classList.remove("active");
        btn.classList.add("active");

        const page = btn.dataset.page === "overview" ? "cards" : "table";
        loadPage(page);
    });
});
