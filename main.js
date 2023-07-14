// Import Files
const {
  app,
  BrowserWindow,
  Notification,
  Tray,
  Menu,
  ipcMain,
} = require("electron");
const path = require("path");

// Check Environment
const isDev = process.env.NODE_ENV !== "production";

// Check Platform
const isMac = process.platform === "darwin";

// Creating Main Window Logic
function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "refocus",
    width: isDev ? 1200 : 500,
    height: 600,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "./renderer/js/preload.js"),
    },
  });

  // Open devtools in dev env
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadFile(path.join(__dirname, "./renderer/index.html"));
}

const notificationTitle = "Reminder";
let notificationMessage = "Remember to set a reminder.";
let notificationSettings = { timeout: 10000 };
let notificationInterval;

const toastXml = (message) => {
  return `
  <toast>
    <visual>
      <binding template="ToastText02">
        <text id="1">${notificationTitle}</text>
        <text id="2">${message}</text>
      </binding>
    </visual>
  </toast>`;
};

let list = null;
const showNotification = () => {
  let notificationMessage;

  if (notificationSettings.reminderIndex === "RANDOM") {
    // Generate a random index within the range of the list array
    const randomIndex = Math.floor(Math.random() * list.length);
    notificationMessage = list[randomIndex];
  } else {
    // Get the reminder index from the settings object
    const reminderIndex = notificationSettings.reminderIndex;
    notificationMessage = list[reminderIndex];
  }

  return new Notification({
    toastXml: toastXml(notificationMessage),
  });
};

app.whenReady().then(() => {
  ipcMain.on("set-list", (event, data) => {
    if (data.length > 0) {
      list = data;
    } else {
      notificationMessage = "Remember to set a reminder.";
    }
  });

  ipcMain.on("update-settings", (event, data) => {
    // Clear the existing interval if change to timeout setting
    if (notificationSettings.timeout !== data.timeout) {
      clearInterval(notificationInterval);
    }

    // Update notification settings
    notificationSettings = data;

    // Create a new interval with the updated timeout
    notificationInterval = setInterval(() => {
      let notification = showNotification();
      notification.show();
    }, notificationSettings.timeout);
  });

  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });

  mainWindow.show();

  // Create a notification
  notificationInterval = setInterval(() => {
    let notification = showNotification();
    notification.show();
  }, notificationSettings.timeout);

  // Create a tray icon
  const trayIconPath = path.join(__dirname, "assets/test.jpg");
  const tray = new Tray(trayIconPath);

  // Optionally, you can set a tooltip for the tray icon
  tray.setToolTip("My Electron App");

  // Show the main window when clicking the tray icon
  tray.on("click", () => {
    mainWindow.show();
  });

  // Create a context menu for the tray icon
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Close Refocus",
      click: () => {
        app.quit();
      },
    },
  ]);

  // Set the context menu on the tray icon
  tray.setContextMenu(contextMenu);
});

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});
