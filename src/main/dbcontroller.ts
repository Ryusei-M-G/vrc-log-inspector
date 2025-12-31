import { PrismaClient } from '../generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

import type { Parsed } from '../types'
const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

export const saveLogsToDb = async (logs: Parsed[]) => {
  const queries = logs.map(log => {
    const timeStamp = new Date(log.timeStamp).toISOString()
    return prisma.$executeRaw`
      INSERT OR IGNORE INTO Event (timeStamp, loglevel, category, message, createAt)
      VALUES (${timeStamp}, ${log.loglevel}, ${log.category}, ${log.message}, ${new Date().toISOString()})
    `
  })
  await prisma.$transaction(queries)
  return { count: logs.length }
}

//test

export const getLogs = async () => {
  try {
    const result = await prisma.event.findMany();
    return result;
  } catch (error) {
    console.log(error)
    return error;
  }
}

export const getLogsByDate = async (startDate: string, endDate: string) => {
  try {
    const result = await prisma.event.findMany({
      where: {
        timeStamp: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      orderBy: {
        timeStamp: 'asc'
      }
    })
    return result
  } catch (error) {
    console.log(error)
    return []
  }
}

export interface SearchOptions {
  searchTerms?: string[]
  startDate?: string
  endDate?: string
}

export const searchLogs = async (options: SearchOptions) => {
  try {
    const { searchTerms, startDate, endDate } = options
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conditions: any[] = []

    if (searchTerms && searchTerms.length > 0) {
      const textConditions = searchTerms.flatMap((term) => [
        { message: { contains: term } },
        { category: { contains: term } },
        { loglevel: { contains: term } }
      ])
      if (textConditions.length > 0) {
        conditions.push({ OR: textConditions })
      }
    }

    if (startDate && endDate) {
      conditions.push({
        timeStamp: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      })
    }

    const result = await prisma.event.findMany({
      where: conditions.length > 0 ? { AND: conditions } : undefined,
      orderBy: { timeStamp: 'asc' }
    })
    return result
  } catch (error) {
    console.error(error)
    return []
  }
}
