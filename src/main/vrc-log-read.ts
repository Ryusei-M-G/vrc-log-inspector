import fs from 'node:fs';
import readline from 'node:readline';
import path from 'node:path';
import os from 'node:os';

const username = os.userInfo().username;
const logpath = path.resolve(
  `C:/Users/${username}/AppData/LocalLow/VRChat/VRChat/`
)

const getLogFilePath = (): string | null => {
  try {
    const files = fs.readdirSync(logpath);
    const txtFile = files.find(file => path.extname(file) === '.txt');
    return txtFile ? path.join(logpath, txtFile) : null;
  } catch (error) {
    console.error('Failed to read log directory:', error);
    return null;
  }
}

const readFile = () => {
  const logPath = getLogFilePath();
  if (!logPath) {
    console.error('Log file not found');
    return;
  }

  const stream = fs.createReadStream(logPath, { encoding: 'utf8' });

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  rl.on('line', (line) => {
    console.log('line', line);
  })

  rl.on('close', () => {
    console.log('finish read');
  })
}

export { readFile }
