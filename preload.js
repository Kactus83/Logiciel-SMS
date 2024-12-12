const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    selectPdf: async () => await ipcRenderer.invoke('select-pdf'),
});
