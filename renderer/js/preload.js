const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  showNotification: (message) => ipcRenderer.send("show-notification", message),
});
