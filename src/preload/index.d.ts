import { ElectronAPI } from '@electron-toolkit/preload'
import type { Parsed } from '../types'

interface Api {
  readFile: () => Promise<Parsed[]>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: Api
  }
}
