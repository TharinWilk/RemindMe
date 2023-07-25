export default document.addEventListener("DOMContentLoaded", () => {
  // Stored List Data
  const list = [];

  const getStoredList = () => {
    const jsonList = localStorage.getItem("list");
    const parsedList = JSON.parse(jsonList);

    list.push(...parsedList);
  };

  window.addEventListener("load", () => {
    getStoredList();

    list.forEach((item) => createListElement(item));
  });

  const setStoredList = () => {
    const jsonList = JSON.stringify(list);
    localStorage.setItem("list", jsonList);
  };

  // Handle DOM Manipulation
  const input = document.querySelector('input[name="focus-item"]');
  const addButton = document.getElementById("addButton");
  const focusMessages = document.getElementById("focusMessages");

  const addNewListItem = () => {
    const value = input.value.trim();

    if (value) {
      // Update List & Storage
      list.push(value);
      setStoredList();

      // Create List Element
      createListElement(value);
    }
  };

  // Add Event Listeners To Adding Items
  addButton.addEventListener("click", addNewListItem);

  input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addNewListItem();
    }
  });

  // Create List Element
  const createListElement = (string) => {
    const li = document.createElement("li");
    li.classList.add("list-item", "fade-in-right");
    li.innerHTML = `
        <button class="button-sm remove-button">
          <span>remove</span>
        </button>
        <span>${string}</span>
      `;

    // Add List Item && Reset Textarea
    focusMessages.appendChild(li);
    input.value = "";

    setTimeout(() => {
      li.classList.remove("fade-in-right");
    }, 10);

    // Add Remove Event Listener
    const removeButton = li.querySelector(".remove-button");
    removeButton.addEventListener("click", () => {
      // Update Storage
      const index = list.findIndex((item) => item === string);
      list.splice(index, 1);
      setStoredList();

      li.classList.add("fade-out-left");

      setTimeout(() => {
        li.remove();
      }, 300);
    });
  };
});
