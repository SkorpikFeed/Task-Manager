document.addEventListener("DOMContentLoaded", (event) => {
  loadCards();
  deleteButtonAction();
  addButtonAction();
  addRenameAction();
});

function addButtonAction() {
  const addButtons = document.querySelectorAll(".btn-add");
  addButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const rowId = e.target.closest(".card-row").id;
      addTask(rowId);
    });
  });
}

function addRenameAction() {
  const spans = document.querySelectorAll(".checkbox-item > span");
  spans.forEach((span) => {
    span.addEventListener("dblclick", (e) => {
      span.contentEditable = true;
      span.focus();

      span.addEventListener("blur", () => {
        span.contentEditable = false;
        saveCards();
      });

      span.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          span.contentEditable = false;
          saveCards();
        }
      });
    });
  });
}

function deleteButtonAction() {
  const deleteButtons = document.querySelectorAll(".btn-delete-item");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const checkboxItem = e.target.closest(".checkbox-item");
      if (checkboxItem) {
        checkboxItem.remove();
        saveCards();
      }
    });
  });
}

function addTask(rowId) {
  const row = document.getElementById(rowId);
  const newTask = document.createElement("div");
  newTask.className = "checkbox-item";
  newTask.innerHTML = `
      <input type="checkbox" />
      <span>New Task</span>
      <button class="btn-delete-item">
          <img src="images/xmark.svg" alt="xmark image" width="13px">
      </button>
  `;
  row
    .querySelector(".card")
    .insertBefore(newTask, row.querySelector(".btn-add"));
  saveCards();
  deleteButtonAction();
  addRenameAction();
}

function saveCards() {
  const cards = document.getElementById("cards").innerHTML;
  localStorage.setItem("cards", cards);
}

function loadCards() {
  const savedCards = localStorage.getItem("cards");
  if (savedCards) {
    document.getElementById("cards").innerHTML = savedCards;
  }
}
