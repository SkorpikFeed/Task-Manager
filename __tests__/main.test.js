/**
 * @jest-environment jsdom
 */

const {
  addNewCardAction,
  saveCards,
  loadCards,
  addTask,
  deleteButtonAction,
  drag,
  drop,
} = require("../script");

describe("UI Functions", () => {
  beforeEach(() => {
    // Setup proper DOM structure before each test
    document.body.innerHTML = `
      <div id="cards">
        <div class="card-row" id="row0">
          <div class="card">
            <button class="btn-add"></button>
          </div>
        </div>
        <div class="card-row" id="row1"></div>
        <div class="card-row" id="row2"></div>
      </div>
    `;

    // Setup localStorage mock
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });

    // Clear any global state
    window._draggedElement = null;
  });

  test("addNewCardAction should add a new card", () => {
    addNewCardAction();
    const card = document.querySelector(".card-option");
    expect(card).not.toBeNull();
    expect(card.querySelector(".btn-add-card")).not.toBeNull();
  });

  test("saveCards should save to localStorage", () => {
    const testContent = "<div>Test Card</div>";
    document.getElementById("cards").innerHTML = testContent;
    saveCards();
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "cards",
      testContent
    );
  });

  test("loadCards should restore saved state", () => {
    const testContent = "<div>Test Card</div>";
    window.localStorage.getItem.mockReturnValue(testContent);
    loadCards();
    expect(document.getElementById("cards").innerHTML).toBe(testContent);
  });

  test("addTask should add a new task to a card", () => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = '<button class="btn-add"></button>';
    addTask(card);

    const task = card.querySelector(".checkbox-item");
    expect(task).not.toBeNull();
    expect(task.draggable).toBe(true);
    expect(task.querySelector("span").textContent).toBe("New Task");
  });

  test("deleteButtonAction should remove an item", () => {
    // Setup proper DOM structure for this test
    document.body.innerHTML = `
      <div id="cards">
        <div class="checkbox-item">
          <button class="btn-delete-item"></button>
        </div>
      </div>
    `;
    deleteButtonAction();
    document.querySelector(".btn-delete-item").click();
    expect(document.querySelector(".checkbox-item")).toBeNull();
  });

  test("drag and drop functionality should move items between cards", () => {
    // Setup test environment
    document.body.innerHTML = `
      <div id="cards">
        <div class="card source-card">
          <div class="checkbox-item">Test Item</div>
          <button class="btn-add"></button>
        </div>
        <div class="card target-card">
          <button class="btn-add"></button>
        </div>
      </div>
    `;

    const item = document.querySelector(".checkbox-item");
    const targetCard = document.querySelector(".target-card");

    // Simulate drag start
    const dragEvent = new Event("dragstart");
    item.dispatchEvent(dragEvent);
    drag(dragEvent);

    // Simulate drop
    const dropEvent = new Event("drop");
    Object.defineProperty(dropEvent, "target", { value: targetCard });
    drop(dropEvent);

    expect(targetCard.contains(item)).toBeTruthy();
    expect(document.querySelector(".source-card").contains(item)).toBeFalsy();
  });
});
