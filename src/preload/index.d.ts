import { ElectronAPI } from '@electron-toolkit/preload'
import type { Parsed } from '../types'

interface Api {
  getLog: () => Promise<Parsed[]>
  saveToDb: () => Promise<void>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: Api
  }
}
