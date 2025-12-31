import { ElectronAPI } from '@electron-toolkit/preload'
import type { Parsed } from '../types'

interface SearchOptions {
  searchText?: string
  startDate?: string
  endDate?: string
}

interface Api {
  getLog: () => Promise<Parsed[]>
  saveToDb: () => Promise<void>
  getLogsByDate: (startDate: string, endDate: string) => Promise<Parsed[]>
  searchLogs: (options: SearchOptions) => Promise<Parsed[]>
  openExternal: (url: string) => Promise<void>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: Api
  }
}
