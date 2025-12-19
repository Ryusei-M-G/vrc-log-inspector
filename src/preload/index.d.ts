import { ElectronAPI } from '@electron-toolkit/preload'
import type { Event } from '../generated/prisma'

type Parsed = { data: Omit<Event, 'id' | 'createAt'> }

interface Api {
  readFile: () => Promise<Parsed[]>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: Api
  }
}
