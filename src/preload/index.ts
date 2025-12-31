import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

export interface SearchOptions {
  searchText?: string
  startDate?: string
  endDate?: string
}

// Custom APIs for renderer
const api = {
  getLog: () => ipcRenderer.invoke('getLog'),
  saveToDb: () => ipcRenderer.invoke('saveToDb'),
  getLogsByDate: (startDate: string, endDate: string) =>
    ipcRenderer.invoke('getLogsByDate', startDate, endDate),
  searchLogs: (options: SearchOptions) => ipcRenderer.invoke('searchLogs', options),
  openExternal: (url: string) => ipcRenderer.invoke('openExternal', url)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
