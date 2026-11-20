
// ================================
// LIFE DASHBOARD
// ================================

// GREETING
let userName = localStorage.getItem("lifeDashboardName") || "Teman";

function updateGreeting() {
    const now = new Date();

    document.getElementById("clock").textContent =
        now.toLocaleTimeString("id-ID");

    document.getElementById("date").textContent =
        now.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    let hour = now.getHours();
    let greeting = "Selamat malam";

    if (hour >= 4 && hour < 11) greeting = "Selamat pagi";
    else if (hour >= 11 && hour < 15) greeting = "Selamat siang";
    else if (hour >= 15 && hour < 18) greeting = "Selamat sore";

    document.getElementById("greetingText").textContent =
        greeting + ", semangat menjalani hari!";

    document.getElementById("displayName").textContent = userName;
}

document.getElementById("changeName").addEventListener("click", () => {
    let name = prompt("Masukkan nama:");

    if (name && name.trim()) {
        userName = name.trim();
        localStorage.setItem("lifeDashboardName", userName);
        updateGreeting();
    }
});

updateGreeting();
setInterval(updateGreeting, 1000);


// DARK MODE
const themeToggle = document.getElementById("themeToggle");

if (localStorage.getItem("lifeDashboardTheme") === "dark") {
    document.body.classList.add("dark");
}

function updateTheme() {
    themeToggle.textContent =
        document.body.classList.contains("dark")
        ? "☀ Light mode"
        : "☾ Dark mode";
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    let theme = document.body.classList.contains("dark")
        ? "dark"
        : "light";

    localStorage.setItem("lifeDashboardTheme", theme);
    updateTheme();
});

updateTheme();


// FOCUS TIMER
let remainingSeconds = 25 * 60;
let timerInterval = null;

function renderTimer() {
    let minutes = Math.floor(remainingSeconds / 60);
    let seconds = remainingSeconds % 60;

    document.getElementById("timer").textContent =
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");
}

document.getElementById("startTimer").addEventListener("click", () => {
    if (timerInterval !== null || remainingSeconds <= 0) return;

    document.getElementById("timerStatus").textContent =
        "Tetap fokus, kamu pasti bisa!";

    timerInterval = setInterval(() => {
        remainingSeconds--;
        renderTimer();

        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;

            document.getElementById("timerStatus").textContent =
                "Waktu fokus selesai!";

            alert("Sesi fokus selesai!");
        }
    }, 1000);
});

document.getElementById("stopTimer").addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;

    document.getElementById("timerStatus").textContent =
        "Timer dijeda.";
});

document.getElementById("resetTimer").addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
    remainingSeconds = 25 * 60;

    renderTimer();

    document.getElementById("timerStatus").textContent =
        "Waktunya fokus pada satu hal.";
});

renderTimer();


// TO-DO LIST
let tasks = JSON.parse(
    localStorage.getItem("lifeDashboardTasks") || "[]"
);

function saveTasks() {
    localStorage.setItem(
        "lifeDashboardTasks",
        JSON.stringify(tasks)
    );
}

function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach((task) => {
        let item = document.createElement("li");
        item.className = task.done
            ? "task-item done"
            : "task-item";

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;

        checkbox.addEventListener("change", () => {
            task.done = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        let text = document.createElement("span");
        text.className = "task-text";
        text.textContent = task.text;

        let actions = document.createElement("div");
        actions.className = "task-actions";

        let edit = document.createElement("button");
        edit.className = "mini-button";
        edit.textContent = "Edit";

        edit.addEventListener("click", () => {
            let newText = prompt("Edit tugas:", task.text);

            if (!newText || !newText.trim()) return;

            newText = newText.trim();

            let duplicate = tasks.some(t =>
                t.id !== task.id &&
                t.text.toLowerCase() === newText.toLowerCase()
            );

            if (duplicate) {
                document.getElementById("taskMessage").textContent =
                    "Tugas tersebut sudah ada.";
                return;
            }

            task.text = newText;
            saveTasks();
            renderTasks();
        });

        let remove = document.createElement("button");
        remove.className = "mini-button delete";
        remove.textContent = "Hapus";

        remove.addEventListener("click", () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        });

        actions.append(edit, remove);
        item.append(checkbox, text, actions);
        list.appendChild(item);
    });

    let completed = tasks.filter(t => t.done).length;

    document.getElementById("taskCount").textContent =
        tasks.length
        ? `${completed} dari ${tasks.length} tugas selesai.`
        : "Belum ada tugas.";
}

document.getElementById("taskForm").addEventListener("submit", (e) => {
    e.preventDefault();

    let input = document.getElementById("taskInput");
    let text = input.value.trim();
    let message = document.getElementById("taskMessage");

    if (!text) return;

    let duplicate = tasks.some(t =>
        t.text.toLowerCase() === text.toLowerCase()
    );

    if (duplicate) {
        message.textContent = "Tugas ini sudah ada.";
        return;
    }

    tasks.push({
        id: Date.now(),
        text: text,
        done: false
    });

    saveTasks();
    renderTasks();

    input.value = "";
    message.textContent = "";
});

renderTasks();


// QUICK LINKS
let links = JSON.parse(
    localStorage.getItem("lifeDashboardLinks") || "[]"
);

function saveLinks() {
    localStorage.setItem(
        "lifeDashboardLinks",
        JSON.stringify(links)
    );
}

function renderLinks() {
    const list = document.getElementById("linkList");
    list.innerHTML = "";

    links.forEach((link, index) => {
        let chip = document.createElement("div");
        chip.className = "link-chip";

        let anchor = document.createElement("a");
        anchor.href = link.url;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        anchor.textContent = link.name;

        let remove = document.createElement("button");
        remove.className = "remove-link";
        remove.textContent = "×";

        remove.addEventListener("click", () => {
            links.splice(index, 1);
            saveLinks();
            renderLinks();
        });

        chip.append(anchor, remove);
        list.appendChild(chip);
    });
}

document.getElementById("linkForm").addEventListener("submit", (e) => {
    e.preventDefault();

    let name = document.getElementById("linkName").value.trim();
    let rawUrl = document.getElementById("linkUrl").value.trim();

    if (!name || !rawUrl) return;

    try {
        let url = /^https?:\/\//i.test(rawUrl)
            ? rawUrl
            : "https://" + rawUrl;

        let parsed = new URL(url);

        if (!["http:", "https:"].includes(parsed.protocol)) {
            throw new Error("URL tidak valid");
        }

        links.push({
            name: name,
            url: parsed.href
        });

        saveLinks();
        renderLinks();

        document.getElementById("linkForm").reset();

    } catch {
        alert("Masukkan URL yang valid!");
    }
});

renderLinks();
