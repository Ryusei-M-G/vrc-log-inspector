import type { Event } from '../generated/prisma'

export type Parsed = Omit<Event, 'id' | 'createAt'>
