export default document.addEventListener("DOMContentLoaded", () => {
  const listButton = document.getElementById("list-button");
  const timerButton = document.getElementById("timer-button");
  const listSection = document.getElementById("list-section");
  const settingsSection = document.getElementById("settings-section");

  // Function to toggle visibility of sections with fade effect
  const toggleSections = async (currentSection, nextSection) => {
    // Fade Out Current Section
    await new Promise((resolve) => {
      currentSection.addEventListener("transitionend", () => {
        resolve();
      });

      currentSection.style.opacity = 0;
      currentSection.style.pointerEvents = "none";
      currentSection.style.transition = "opacity 300ms";
    });

    // Change Visible Section
    currentSection.style.display = "none";
    nextSection.style.display = "flex";

    // Fade In Next Section
    setTimeout(() => {
      nextSection.style.opacity = 1;
      nextSection.style.pointerEvents = "auto";
      nextSection.style.transition = "opacity 300ms";
    }, 1);
  };

  // Event listener for list button
  listButton.addEventListener("click", () => {
    toggleSections(settingsSection, listSection);
  });

  // Event listener for settings button
  timerButton.addEventListener("click", () => {
    toggleSections(listSection, settingsSection);
  });
});
