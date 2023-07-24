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
    width: isDev ? 1000 : 500,
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

const showNotification = (notificationMessage) => {
  const notification = new Notification({
    toastXml: toastXml(notificationMessage),
  });

  notification.show();
};

app.whenReady().then(() => {
  ipcMain.on("show-notification", (event, data) => {
    showNotification(data);
  });

  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow(notificationMessage);
    }
  });

  mainWindow.show();

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
