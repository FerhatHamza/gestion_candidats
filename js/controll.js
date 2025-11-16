const currentUser = document.getElementById("currentUser");
const logoutBtn = document.getElementById("logoutBtn");
const username = localStorage.getItem("username");
const role = localStorage.getItem("role");

init();
function init() {
    if (username && username !== null && username !== "null") {
        if (currentUser) {
            currentUser.textContent = username;
        }
        if (logoutBtn) {
            logoutBtn.addEventListener("click", logout);
        }

        if (role === "admin") {
            const adminOnlyNav = document.getElementById("adminOnly");
            if (adminOnlyNav) {
                adminOnlyNav.classList.remove("hidden");
            }
        }
    } else {
        // user is not logged in
        window.location.href = "index.html";
    }

}
function logout() {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("agent_id");

    window.location.href = "index.html";
}
