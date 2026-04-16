const toggle = document.querySelector("[data-testid='test-todo-complete-toggle']");
const status = document.querySelector("[data-testid='test-todo-status']");
const card = document.querySelector("[data-testid='test-todo-card']");
const editForm = document.querySelector("[data-testid='test-todo-edit-form']");
const editBtn = document.querySelector("[data-testid='test-todo-edit-button']");
const saveBtn = document.querySelector("[data-testid='test-todo-save-button']");
const cancelBtn = document.querySelector("[data-testid='test-todo-cancel-button']");
const title = document.getElementById("title");
const description = document.getElementById("description");
const editTitle = document.getElementById("edit-title");
const editDescription = document.getElementById("edit-description");
const timeRemaining = document.getElementById("time-remaining");
const expandBtn = document.getElementById("expand-btn");
const collapsible = document.getElementById("collapsible-section");
const indicator = document.getElementById("priority-indicator");
const text = document.getElementById("priority-text");
const editPriority = document.getElementById("edit-priority");
const overdueIndicator = document.getElementById("overdue-indicator");
const editDate = document.getElementById("edit-date");
const dueDateDisplay = document.querySelector("[data-testid='test-todo-due-date']");
const statusControl = document.getElementById("status-control");
const descriptionText = document.getElementById("description");



expandBtn.addEventListener("click", () => {
    const isExpanded = expandBtn.getAttribute("aria-expanded") === "true";

    expandBtn.setAttribute("aria-expanded", String(!isExpanded));

    if (isExpanded) {
        collapsible.classList.remove("expanded");
        collapsible.classList.add("collapsed");
        expandBtn.textContent = "Show More ⌄";
    } else {
        collapsible.classList.remove("collapsed");
        collapsible.classList.add("expanded");
        expandBtn.textContent = "Show Less ⌃";
    }
});

function checkOverflow() {
    if (collapsible.scrollHeight <= collapsible.clientHeight) {
        expandBtn.style.display = "none";
    } else {
        expandBtn.style.display = "inline-block";
    }
}
checkOverflow();


function updatePriorityUI(value) {


    if (!indicator || !text) return;

    indicator.classList.remove("priority-low", "priority-medium", "priority-high");

    if (value === "Low") {
        indicator.classList.add("priority-low");
        text.style.color = "#22c55e";
    } else if (value === "Medium") {
        indicator.classList.add("priority-medium");
        text.style.color = "#f59e0b";
    } else {
        indicator.classList.add("priority-high");
        text.style.color = "#ef4444";
    }

    text.textContent = value;
}
updatePriorityUI("High");


let dueDate = new Date("2026-04-19T18:00");

function updateTime() {
    const now = new Date();
    const diff = dueDate - now;

    const minutes = Math.floor(Math.abs(diff) / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const isDone = status.classList.contains("complete");

    if (isDone) {
        timeRemaining.textContent = "Completed";
        overdueIndicator.classList.add("hidden");
        card.classList.remove("overdue");
        return;
    }

    if (diff < 0) {
        overdueIndicator.classList.remove("hidden");
        card.classList.add("overdue");

        if (minutes < 60) {
            timeRemaining.textContent = "Overdue just now";
        } else if (hours < 24) {
            timeRemaining.textContent = `Overdue by ${hours} hour${hours > 1 ? "s" : ""}`;
        } else if (days <= 7) {
            timeRemaining.textContent = `Overdue by ${days} day${days > 1 ? "s" : ""}`;
        } else {
            timeRemaining.textContent = "Overdue";
        }
    }

    else {
        overdueIndicator.classList.add("hidden");
        card.classList.remove("overdue");

        if (minutes < 60) {
            timeRemaining.textContent = "Due now!";
        } else if (hours < 24) {
            timeRemaining.textContent = `Due in ${hours} hour${hours > 1 ? "s" : ""}`;
        } else if (days === 1) {
            timeRemaining.textContent = "Due tomorrow";
        } else if (days <= 7) {
            timeRemaining.textContent = `Due in ${days} days`;
        } else {
            timeRemaining.textContent = "Due soon";
        }
    }

}
updateTime();
setInterval(updateTime, 1000);

statusControl.addEventListener("change", () => {
    const value = statusControl.value;

    status.textContent = value;

    status.classList.remove("pending", "complete", "in-progress");

    if (value === "Done") {
        toggle.checked = true;
        status.classList.add("complete");
        title.style.textDecoration = "line-through";
    }
    else if (value === "In Progress") {
        toggle.checked = false;
        status.classList.add("in-progress");
        title.style.textDecoration = "none";
    }
    else {
        toggle.checked = false;
        status.classList.add("pending");
        title.style.textDecoration = "none";
    }
});

toggle.addEventListener("change", () => {
    if (toggle.checked) {
        status.textContent = "Done";
        statusControl.value = "Done";

        status.classList.remove("pending");
        status.classList.add("complete");

        title.style.textDecoration = "line-through";
    } else {
        status.textContent = "Pending";
        statusControl.value = "Pending";

        status.classList.remove("complete");
        status.classList.add("pending");

        title.style.textDecoration = "none";
    }
});

editBtn.addEventListener("click", () => {
    card.classList.add("hidden");
    editForm.classList.remove("hidden");
    editDate.value = dueDate.toISOString().slice(0, 16);

    editTitle.value = title.textContent.trim();
    editDescription.value = description.textContent.trim();
});

cancelBtn.addEventListener("click", () => {
    editForm.classList.add("hidden");
    card.classList.remove("hidden");

    editBtn.focus();
});

saveBtn.addEventListener("click", () => {
    title.textContent = editTitle.value;
    description.textContent = editDescription.value;

    updatePriorityUI(editPriority.value);

    if (editDate.value) {
        dueDate = new Date(editDate.value);
        updateDueDateUI(dueDate);
        updateTime();

    }

    collapsible.classList.add("collapsed");
    collapsible.classList.remove("expanded");

    expandBtn.textContent = "Show More ⌄";
    expandBtn.setAttribute("aria-expanded", "false");

    editForm.classList.add("hidden");
    card.classList.remove("hidden");

    checkOverflow();
    editBtn.focus();
});

function updateDueDateUI(date) {
    const formatted = date.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short"
    });

    dueDateDisplay.textContent = `Due ${formatted}`;
    dueDateDisplay.setAttribute("datetime", date.toISOString());
}

updateDueDateUI(dueDate);
updateTime();
setInterval(updateTime, 1000);

document
    .querySelector("[data-testid='test-todo-delete-button']")
    .addEventListener("click", () => {
        const parent = card.parentElement;

        parent.innerHTML = "";

        const message = document.createElement("p");
        message.textContent = "You have no card, refresh to show card";
        message.style.textAlign = "center";
        message.style.marginTop = "20px";
        message.style.fontWeight = "bold";
        message.style.color = "#2563eb";

        parent.appendChild(message);
    });