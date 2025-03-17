document.addEventListener("DOMContentLoaded", (event) => {
  loadCards();
  deleteButtonAction();
  addButtonAction(document);
  renameAction();
  addNewCardAction();
  deleteCardAction(document);
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

function deleteCardAction(element) {
  const deleteButttons = element.querySelectorAll(".btn-delete-card");
  deleteButttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      button.closest(".card").remove();
      addNewCardAction();
      saveCards();
    });
  });
}

function addNewCardAction() {
  const cardOption = document.querySelector(".card-option");
  if (cardOption) {
    cardOption.remove();
  }
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
  const spans = document.querySelectorAll(".card span, .card p");
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
  newTask.draggable = true;
  newTask.setAttribute("ondragstart", "drag(event)");
  newTask.setAttribute("ondrop", "drop(event)");
  newTask.setAttribute("ondragover", "allowDrop(event)");
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
  let minRow = "row0";
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
  newCard.setAttribute("ondrop", "drop(event)");
  newCard.setAttribute("ondragover", "allowDrop(event)");
  newCard.innerHTML = `          
      <div class="top-bar">
        <p class="card-title">New Card</p>
        <button class="btn-delete-card">
          <img src="images/trash.svg" alt="trash image" width="16px" />
        </button>
      </div>
      <button class="btn-add">Add task</button>`;
  document.getElementById(defineRow()).appendChild(newCard);
  addButtonAction(newCard);
  deleteCardAction(newCard);
  renameAction();
  saveCards();
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

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  window._draggedElement = event.target;
}

function drop(event) {
  event.preventDefault();
  const draggedElement = window._draggedElement;
  const target = event.target.closest(".checkbox-item, .card");

  if (!draggedElement || !target) return;

  if (target.classList.contains("checkbox-item")) {
    const draggedParent = draggedElement.parentNode;
    const targetParent = target.parentNode;

    if (target !== draggedElement) {
      const draggedNext = draggedElement.nextElementSibling;
      const targetNext = target.nextElementSibling;

      if (draggedNext === target) {
        targetParent.insertBefore(draggedElement, targetNext);
      } else {
        targetParent.insertBefore(draggedElement, target);
        draggedParent.insertBefore(target, draggedNext);
      }
    }
  } else if (target.classList.contains("card")) {
    const addButton = target.querySelector(".btn-add");
    target.insertBefore(draggedElement, addButton);
  }

  window._draggedElement = null;
  saveCards();
}

module.exports = {
  addNewCardAction,
  saveCards,
  loadCards,
  addTask,
  deleteButtonAction,
  deleteCardAction,
  addButtonAction,
  renameAction,
  defineRow,
  addNewCard,
  allowDrop,
  drag,
  drop,
};
