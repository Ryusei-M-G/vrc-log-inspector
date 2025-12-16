import fs from 'node:fs';
import readline from 'node:readline';
import path from 'node:path';
import os from 'node:os';
import { is } from '@electron-toolkit/utils';
import { parsed } from './parser';

import type { Event } from '../generated/prisma'
type Parsed = { data: Omit<Event, 'id' | 'createAt'> }

const username = os.userInfo().username;
const productionLogPath = path.resolve(
  `C:/Users/${username}/AppData/LocalLow/VRChat/VRChat/`
)
const developmentLogPath = path.resolve(process.cwd(), 'sample.txt')


const getLogFilePath = (): string | null => {
  // Development mode: use test log file in project root
  if (is.dev) {
    if (fs.existsSync(developmentLogPath)) {
      console.log('Development mode: using test log file at', developmentLogPath);
      return developmentLogPath;
    } else {
      console.error('Development mode: test log file not found at', developmentLogPath);
      return null;
    }
  }

  // Production mode: use VRChat log directory
  try {
    const files = fs.readdirSync(productionLogPath);
    const txtFile = files.find(file => path.extname(file) === '.txt');
    return txtFile ? path.join(productionLogPath, txtFile) : null;
  } catch (error) {
    console.error('Failed to read log directory:', error);
    return null;
  }
}

const readFile = async () => {
  const logResult: Parsed[] = [];
  const logPath = getLogFilePath();
  if (!logPath) {
    throw new Error('log file not found');
  }

  const stream = fs.createReadStream(logPath, { encoding: 'utf8' });

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const parsedData = parsed(line);
    if (parsedData) {
      logResult.push(parsedData);
    }
  }
  console.log(logResult);
  return logResult
}

export { readFile }
