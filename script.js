document.addEventListener("DOMContentLoaded", (event) => {
  loadCards();
  deleteButtonAction();
  addButtonAction(document);
  renameAction();
  addNewCardAction();
});

function addButtonAction(element) {
  const addButtons = element.querySelectorAll(".btn-add");
  addButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const card = button.closest(".card");
      addTask(card);
    });
  });
}

function addNewCardAction() {
  document.querySelector(".card-option").remove();
  const newCard = document.createElement("div");
  newCard.className = "card card-option";
  newCard.innerHTML = `          
      <button class="btn-add-card">Add New Card</button>`;
  document.getElementById(defineRow()).appendChild(newCard);
  const addCardButton = document.querySelector(".btn-add-card");
  addCardButton.addEventListener("click", (e) => {
    addNewCard();
    addNewCardAction();
  });
}

function renameAction() {
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

function addTask(card) {
  const newTask = document.createElement("div");
  newTask.className = "checkbox-item";
  newTask.innerHTML = `
      <input type="checkbox" />
      <span>New Task</span>
      <button class="btn-delete-item">
          <img src="images/xmark.svg" alt="xmark image" width="13px">
      </button>
  `;
  card.insertBefore(newTask, card.querySelector(".btn-add"));
  saveCards();
  deleteButtonAction();
  renameAction();
}

function defineRow() {
  const rows = document.querySelectorAll(".card-row");
  let minRow = null;
  let minItems = Infinity;

  rows.forEach((row) => {
    const itemCount =
      row.querySelectorAll(".checkbox-item").length +
      row.querySelectorAll(".btn-add").length;
    if (itemCount < minItems) {
      minItems = itemCount;
      minRow = row;
    }
  });
  return minRow.id;
}

function addNewCard() {
  const newCard = document.createElement("div");
  newCard.className = "card";
  newCard.innerHTML = `          
      <div class="top-bar">
        <p class="card-title">New Card</p>
        <button>
          <img src="images/trash.svg" alt="trash image" width="16px" />
        </button>
      </div>
      <button class="btn-add">Add task</button>`;
  document.getElementById(defineRow()).appendChild(newCard);
  addButtonAction(newCard);
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
