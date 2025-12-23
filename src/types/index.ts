import type { Event } from '../generated/prisma'

export type Parsed = { data: Omit<Event, 'id' | 'createAt'> }
