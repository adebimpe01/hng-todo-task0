const toggle = document.querySelector("[data-testid='test-todo-complete-toggle']");
const status = document.querySelector("[data-testid='test-todo-status']");
const title = document.querySelector("[data-testid='test-todo-title']");
const timeRemaining = document.querySelector("[data-testid='test-todo-time-remaining']");
const card = document.querySelector("[data-testid='test-todo-card']");
const editBtn = document.querySelector("[data-testid='test-todo-edit-button']");
const modal = document.getElementById("edit-modal");
const input = document.getElementById("edit-input");
const saveBtn = document.getElementById("save-edit");
const cancelBtn = document.getElementById("cancel-edit");
const description = document.getElementById("description");


toggle.addEventListener("change", () => {
    if (toggle.checked) {
        status.textContent = "Complete";
        status.classList.remove("pending");
        status.classList.add("complete");

        title.style.textDecoration = "line-through";
    } else {
        status.textContent = "Pending";
        status.classList.remove("complete");
        status.classList.add("pending");

        title.style.textDecoration = "none";
    }
});

const dueDate = new Date(Date.now() + 2 * 60 * 60 * 1000);

function updateTime() {
    const now = new Date();
    const diff = dueDate - now;

    const minutes = Math.floor(Math.abs(diff) / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (diff < 0) {
        if (hours < 1) {
            timeRemaining.textContent = "Overdue by a few minutes";
        } else if (hours < 24) {
            timeRemaining.textContent = `Overdue by ${hours} hour${hours > 1 ? "s" : ""}`;
        } else {
            timeRemaining.textContent = `Overdue by ${days} day${days > 1 ? "s" : ""}`;
        }
    }

    else if (minutes < 60) {
        timeRemaining.textContent = "Due now!";
    }

    else if (hours < 24) {
        timeRemaining.textContent = `Due in ${hours} hour${hours > 1 ? "s" : ""}`;
    }

    else if (days === 1) {
        timeRemaining.textContent = "Due tomorrow";
    }

    else {
        timeRemaining.textContent = `Due in ${days} days`;
    }
}

    updateTime();

    setInterval(updateTime, 60000);

    let step = "title";

    editBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");

    step = "title";
    input.value = title.textContent;
    input.placeholder = "Edit title...";
    input.focus();
    });

    saveBtn.addEventListener("click", () => {
    if (input.value.trim() === "") return;

    if (step === "title") {
        title.textContent = input.value;

        step = "description";
        input.value = description.textContent;
        input.placeholder = "Edit description...";
    } else {
        description.textContent = input.value;

        modal.classList.add("hidden");
    }
    });

    cancelBtn.addEventListener("click", () => {
    if (step === "title") {
        modal.classList.add("hidden");
    } else {
        step = "title";
        input.value = title.textContent;
        input.placeholder = "Edit title...";
    }
    });


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