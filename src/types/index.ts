import type { Prisma } from '../generated/prisma/client'

export type Parsed = Prisma.EventCreateManyInput

export interface Tab {
  id: string
  label: string
  logs: Parsed[]
  isMain?: boolean
}
