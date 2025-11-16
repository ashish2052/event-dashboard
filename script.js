// ============================
// Global API URL
// ============================
const API_URL = "https://novevent-report-worker.ashishoct34.workers.dev/";

// ============================
// DOM Elements
// ============================
const overviewTab = document.querySelector("#tab-overview");
const attendeesTab = document.querySelector("#tab-attendees");
const overviewSection = document.querySelector("#overview");
const attendeesSection = document.querySelector("#attendees");
const errorBox = document.querySelector("#errorBox");

// Card elements
const cardTotal = document.querySelector("#cardTotal");
const cardUnassigned = document.querySelector("#cardUnassigned");
const cardMissing = document.querySelector("#cardMissing");
const cardConverted = document.querySelector("#cardConverted");
const cardLost = document.querySelector("#cardLost");
const cardWarmCold = document.querySelector("#cardWarmCold");
const cardAvgFollow = document.querySelector("#cardAvgFollow");
const cardExpense = document.querySelector("#cardExpense");

// Table container
const attendeesTableContainer = document.querySelector("#attendeesTableContainer");

// ============================
// Fetch Data From Cloudflare
// ============================
async function loadDashboard() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Bad response from server");

        const data = await response.json();

        if (!data.success) throw new Error("API returned unsuccessful");

        updateCards(data.metrics);
        renderTable(data.attendees);

        errorBox.classList.add("hidden");
    } catch (err) {
        console.error(err);
        errorBox.textContent = "Error fetching data: " + err.message;
        errorBox.classList.remove("hidden");
    }
}

// ============================
// Update Overview Cards
// ============================
function updateCards(m) {
    cardTotal.textContent = m.totalAttendees;
    cardUnassigned.textContent = m.unassigned;
    cardMissing.textContent = m.missingStatus;
    cardConverted.textContent = m.converted;
    cardLost.textContent = m.lost;
    cardWarmCold.textContent = m.warmCold;
    cardAvgFollow.textContent = m.avgFollow.toFixed(1);
    cardExpense.textContent = "₹ " + m.totalExpense.toLocaleString();
}

// ============================
// Render Attendees Table
// ============================
function renderTable(rows) {
    let html = `
        <div class="table-box">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Assignee</th>
                        <th>Status</th>
                        <th>Country</th>
                        <th>Follow Ups</th>
                    </tr>
                </thead>
                <tbody>
    `;

    rows.forEach(r => {
        html += `
            <tr>
                <td>${r.Name || "-"}</td>
                <td>${r.Assignees || "-"}</td>
                <td>
                    <span class="status-pill ${statusClass(r.Status_clean)}">
                        ${r.Status_clean || "None"}
                    </span>
                </td>
                <td>${r.Country || "-"}</td>
                <td>${r.Follow_clean || "-"}</td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    attendeesTableContainer.innerHTML = html;
}

// ============================
// Status Styling Helpers
// ============================
function statusClass(status) {
    if (!status) return "status-empty";

    status = status.toLowerCase();

    if (status.includes("lost")) return "status-lost";
    if (status.includes("converted")) return "status-converted";
    if (status.includes("warm")) return "status-warm";
    if (status.includes("cold")) return "status-cold";

    return "status-empty";
}

// ============================
// Tab Switching
// ============================
overviewTab.addEventListener("click", function () {
    overviewTab.classList.add("active");
    attendeesTab.classList.remove("active");
    overviewSection.classList.remove("hidden");
    attendeesSection.classList.add("hidden");
});

attendeesTab.addEventListener("click", function () {
    attendeesTab.classList.add("active");
    overviewTab.classList.remove("active");
    attendeesSection.classList.remove("hidden");
    overviewSection.classList.add("hidden");
});

// ============================
// Load Everything
// ============================
loadDashboard();

