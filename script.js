// ============================
//  GLOBAL SETTINGS
// ============================

const API_URL = "https://novevent-report-worker.ashishoct34.workers.dev/";


// ============================
//  DOM ELEMENTS
// ============================

// Tabs
const tabOverview = document.getElementById("tab-overview");
const tabAttendees = document.getElementById("tab-attendees");

// Sections
const sectionOverview = document.getElementById("section-overview");
const sectionAttendees = document.getElementById("section-attendees");

// Cards
const cardTotal = document.getElementById("cardTotal");
const cardUnassigned = document.getElementById("cardUnassigned");
const cardMissing = document.getElementById("cardMissing");
const cardConverted = document.getElementById("cardConverted");
const cardLost = document.getElementById("cardLost");
const cardWarmCold = document.getElementById("cardWarmCold");
const cardAvgFollow = document.getElementById("cardAvgFollow");
const cardExpense = document.getElementById("cardExpense");

// Table body
const attendeesTable = document.getElementById("attendeesTable");

// Error box
const errorBox = document.getElementById("errorBox");


// ============================
//  FETCH DATA FROM CLOUDFLARE
// ============================

async function loadDashboard() {
    try {
        const res = await fetch(API_URL);

        if (!res.ok) {
            throw new Error("Server returned an invalid response.");
        }

        const data = await res.json();

        if (!data.success) {
            throw new Error("API success = false");
        }

        updateCards(data.metrics);
        renderTable(data.attendees);

        errorBox.style.display = "none";

    } catch (err) {
        console.error(err);
        errorBox.textContent = "⚠️ Error fetching data: " + err.message;
        errorBox.style.display = "block";
    }
}


// ============================
//  UPDATE DASHBOARD CARDS
// ============================

function updateCards(m) {
    cardTotal.textContent = m.totalAttendees;
    cardUnassigned.textContent = m.unassigned;
    cardMissing.textContent = m.missingStatus;
    cardConverted.textContent = m.converted;
    cardLost.textContent = m.lost;
    cardWarmCold.textContent = m.warmCold;
    cardAvgFollow.textContent = m.avgFollow.toFixed(1);
    cardExpense.textContent = "Rs. " + m.totalExpense.toLocaleString();
}


// ============================
//  RENDER ATTENDEES TABLE
// ============================

function renderTable(list) {

    attendeesTable.innerHTML = ""; // Clear table first

    list.forEach(row => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${clean(row.Name)}</td>
            <td>${clean(row.Assignees)}</td>
            <td>${formatStatus(row.Status_clean)}</td>
            <td>${clean(row.Country)}</td>
            <td>${clean(row.Number)}</td>
            <td>${clean(row.Follow_clean)}</td>
        `;

        attendeesTable.appendChild(tr);
    });
}


// ============================
//  STATUS COLOR BADGE
// ============================

function formatStatus(status) {
    if (!status) {
        return `<span class="status-pill status-empty">None</span>`;
    }

    const s = status.toLowerCase();

    if (s.includes("converted"))
        return `<span class="status-pill status-converted">Converted</span>`;

    if (s.includes("lost"))
        return `<span class="status-pill status-lost">Lost</span>`;

    if (s.includes("warm"))
        return `<span class="status-pill status-warm">Warm</span>`;

    if (s.includes("cold"))
        return `<span class="status-pill status-cold">Cold</span>`;

    return `<span class="status-pill status-empty">${status}</span>`;
}


// ============================
//  CLEAN TEXT HELPERS
// ============================

function clean(v) {
    if (!v || v === "" || v === " ") return "-";
    return v;
}


// ============================
//  TAB SWITCHING
// ============================

tabOverview.addEventListener("click", () => {
    tabOverview.classList.add("active");
    tabAttendees.classList.remove("active");

    sectionOverview.style.display = "block";
    sectionAttendees.style.display = "none";
});

tabAttendees.addEventListener("click", () => {
    tabAttendees.classList.add("active");
    tabOverview.classList.remove("active");

    sectionAttendees.style.display = "block";
    sectionOverview.style.display = "none";
});


// ============================
//  INIT DASHBOARD
// ============================
loadDashboard();
