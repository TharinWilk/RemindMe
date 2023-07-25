let notificationInterval;

const selectMessage = () => {
  // Get settings data
  const settings = JSON.parse(localStorage.getItem("settings"));

  // Get list data
  const list = JSON.parse(localStorage.getItem("list"));

  if (settings.reminderIndex === "RANDOM") {
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
  }

  return list[settings.reminderIndex];
};

// Function to show a notification (to be defined later).
export const showNotification = (customMessage) => {
  if (customMessage) {
    window.electronAPI.showNotification(customMessage);
    return;
  }

  const message = selectMessage();
  window.electronAPI.showNotification(message);
};

// Function to set a new interval or change the interval time.
export const setNotificationInterval = () => {
  const settings = JSON.parse(localStorage.getItem("settings"));

  clearInterval(notificationInterval); // Clear the previous interval, if any.
  notificationInterval = setInterval(showNotification, settings.timeout);
};
