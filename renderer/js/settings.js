export default document.addEventListener("DOMContentLoaded", () => {
  let settings = {
    timeout: 5000,
  };

  window.addEventListener("load", () => {
    const storedSettings = localStorage.getItem("settings");

    if (storedSettings) {
      settings = JSON.parse(storedSettings);
      window.electronAPI.updateSettings(settings);
    }

    initDOMSettings();
  });

  const initDOMSettings = () => {
    const time = settings.timeout / 100;
    timeSlider.value = time;
    timeLabel.textContent = `Time (${time} minutes)`;
  };

  // Time Settings Logic
  const timeSlider = document.querySelector("[name=time-slider]");
  const timeLabel = document.getElementById("time-label");

  timeSlider.addEventListener("input", () => {
    const time = timeSlider.value;
    timeLabel.textContent = `Time (${time} minutes)`;

    settings.timeout = time * 1000;
  });

  // Save Settings Button
  const saveButton = document.getElementById("settings-button");

  saveButton.addEventListener("click", () => {
    localStorage.setItem("settings", JSON.stringify(settings));
    window.electronAPI.updateSettings(settings);
  });
});
