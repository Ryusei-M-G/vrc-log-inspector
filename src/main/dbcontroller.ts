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
  searchText?: string
  startDate?: string
  endDate?: string
}

export const searchLogs = async (options: SearchOptions) => {
  try {
    const { searchText, startDate, endDate } = options
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}

    if (searchText) {
      where.OR = [
        { message: { contains: searchText } },
        { category: { contains: searchText } },
        { loglevel: { contains: searchText } }
      ]
    }

    if (startDate && endDate) {
      where.timeStamp = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const result = await prisma.event.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { timeStamp: 'asc' }
    })
    return result
  } catch (error) {
    console.error(error)
    return []
  }
}
