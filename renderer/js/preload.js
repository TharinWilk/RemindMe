const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  sendList: (list) => ipcRenderer.send("set-list", list),
  updateSettings: (settings) => ipcRenderer.send("update-settings", settings),
});
