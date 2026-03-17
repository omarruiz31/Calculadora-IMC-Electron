const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
    saveImc: (data) => ipcRenderer.invoke('save-imc', data),
    getHistory: () => ipcRenderer.invoke('get-history'),
    clearHistory: () => ipcRenderer.invoke('clear-history')
})
