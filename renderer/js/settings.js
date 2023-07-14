export default document.addEventListener("DOMContentLoaded", () => {
  let settings = {
    timeout: 60000,
    reminderIndex: "RANDOM",
  };

  window.addEventListener("load", () => {
    const storedSettings = localStorage.getItem("settings");

    if (storedSettings) {
      settings = JSON.parse(storedSettings);
      window.electronAPI.updateSettings(settings);
    } else {
      const jsonSettings = JSON.stringify(settings);
      localStorage.setItem("settings", jsonSettings);
    }

    initDOMSettings();
  });

  const initDOMSettings = () => {
    const time = settings.timeout / 60000;
    timeSlider.value = time;
    timeLabel.textContent = `Time (${time} minutes)`;
  };

  // Time Settings Logic
  const timeSlider = document.querySelector("[name=time-slider]");
  const timeLabel = document.getElementById("time-label");

  timeSlider.addEventListener("input", () => {
    const time = timeSlider.value;
    timeLabel.textContent = `Time (${time} minutes)`;

    settings.timeout = time * 60000;
  });

  // Reminder Settings
  const reminderToggle = document.getElementById("reminder-toggle");
  const reminderFieldset = document.getElementById("reminder-fieldset");
  const reminderSelect = document.getElementById("reminder-select");

  const createSelectOptions = () => {
    // reset node
    Array.from(reminderSelect.children).forEach((child) => {
      reminderSelect.removeChild(child);
    });

    const jsonList = localStorage.getItem("list");
    const list = JSON.parse(jsonList);

    list.forEach((item) => {
      const truncatedItem = item.length > 48 ? item.slice(0, 48) + "..." : item;
      const option = document.createElement("option");
      option.innerText = truncatedItem;
      option.value = item;
      reminderSelect.appendChild(option);
    });
  };

  reminderToggle.addEventListener("change", (event) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      createSelectOptions();
      reminderFieldset.classList.remove("hidden");
      settings.reminderIndex = 0;
    } else {
      reminderFieldset.classList.add("hidden");
      settings.reminderIndex = "RANDOM";
    }
  });

  reminderSelect.addEventListener("change", () => {
    settings.reminderIndex = reminderSelect.selectedIndex;
  });

  // Save Settings Button
  const saveButton = document.getElementById("settings-button");

  saveButton.addEventListener("click", () => {
    localStorage.setItem("settings", JSON.stringify(settings));
    window.electronAPI.updateSettings(settings);
  });
});
