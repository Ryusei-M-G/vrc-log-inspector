
import type { Event } from '../generated/prisma'
type Parsed = { data: Omit<Event, 'id' | 'createAt'> }

const parsed = (line: string): Parsed | undefined => {
  const timeStampPattern = /^(\d{4}\.\d{2}\.\d{2}\s+\d{2}:\d{2}:\d{2})/;//YYYY.MM.DD HH:MM:SS
  const timeStampMatch = line.match(timeStampPattern);

  //return undefined if no timestamp
  if (!timeStampMatch) {
    return undefined;
  }

  const _timeStamp = timeStampMatch[1];

  const [datePart, timePart] = _timeStamp.split(' ');
  const [year, month, day] = datePart.split('.');
  const [hour, minute, second] = timePart.split(':');
  const timeStamp = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hour),
    parseInt(minute),
    parseInt(second)
  );

  const afterTimeStamp = line.substring(_timeStamp.length).trim();
  let _logLevel;
  const logLevels = ["Debug", "Log", "Warning", "Error"];

  for (const level of logLevels) {
    if (afterTimeStamp.includes(level)) {
      _logLevel = level;
      break;
    }
  }

  if (!_logLevel) {
    _logLevel = 'unknown';
  }

  const categoryMatch = afterTimeStamp.match(/\[([^\]]+)\]/);//[category]
  const _category = categoryMatch ? categoryMatch[1] : "";

  let _message = afterTimeStamp;

  if (categoryMatch) {
    const categoryEnd = afterTimeStamp.indexOf(categoryMatch[0]) + categoryMatch[0].length;
    _message = afterTimeStamp.substring(categoryEnd).trim();
  } else {
    //wip
  }
  //return parsed data
  return {
    data: {
      timeStamp: timeStamp,
      loglevel: _logLevel,
      category: _category,
      message: _message,
    }
  }
}

export { parsed };
