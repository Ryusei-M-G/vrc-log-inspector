import { PrismaClient } from '../generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

import type { Parsed } from '../types'
const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

export const saveLogsToDb = async (logs: Parsed[]) => {
  try {
    const result = await prisma.event.createMany({
      data: logs,
    })
    return result;
  } catch (error) {
    return error;
  }
}

//test

export const getLogs = async () => {
  try {
    const result = await prisma.event.findMany();
    console.log(result);
    return result;
  } catch (error) {
    console.log(error)
    return error;
  }
}
