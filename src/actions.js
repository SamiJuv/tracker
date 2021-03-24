const path = require("path");
const fs = require("fs");
const dateFormat = require("dateformat");

const LOG_FILE_PATH = path.resolve(__dirname, "../data/trackingLog.json");

const startTracking = () => {
  const date = new Date();
  const timestamp = Date.now();
  const formattedTime = dateFormat(date, "H:MM:ss")

  if (isAlreadyTracking()) {
    console.log("Already tracking!");
    return false;
  }

  const newEntry = {
    startTime: timestamp
  };

  appendJsonToLogFile(newEntry);
  
  console.log(`Time tracking started at ${formattedTime}`);
}

const stopTracking = (message) => {
  const timestamp = Date.now();
  logEndTime(timestamp, message);

  const duration = getDurationOfLastEntry();

  console.log("Tracking stopped");
  console.log(`Duration: ${duration}`);
}

const lastEntryDuration = () => {
  console.log(getDurationOfLastEntry());
}

const listEntries = () => {
  const allEntries = getCurrentJson();

  const formattedEntries = allEntries.slice(0, 20).map(entry => {
    const durationSeconds = entry.endTime - entry.startTime;
    const durationIsoDate = new Date(durationSeconds).toISOString().substr(11, 8);
    
    return {
      message: entry.message,
      duration: durationIsoDate
    }
  });

  console.log(formattedEntries);
}

const isAlreadyTracking = () => {
  const lastEntry = getLastEntryInLogFile();

  if (lastEntry && !lastEntry.hasOwnProperty("endTime")) {
    return true;
  }

  return false;
}

const appendJsonToLogFile = (newJsonItem) => {
  const logFile = fs.readFileSync(LOG_FILE_PATH);
  const currentJson = JSON.parse(logFile);
  const newJson = currentJson.concat(newJsonItem);

  fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(newJson));
}

const logEndTime = (timestamp, message) => {
  const currentJson = getCurrentJson();
  const lastEntry = currentJson[currentJson.length-1];

  const newJson = currentJson.map(entry => {
    if (entry.startTime === lastEntry.startTime) {
      return {
        ...entry,
        endTime: timestamp,
        message: message
      };
    }

    return entry;
  });

  fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(newJson));
}

const getLastEntryInLogFile = () => {
  const currentJson = getCurrentJson();
  const lastEntry = currentJson[currentJson.length-1];

  return lastEntry;
}

const getDurationOfLastEntry = () => {
  const lastEntry = getLastEntryInLogFile();
  const durationSeconds = lastEntry.endTime - lastEntry.startTime;
  const durationIsoDate = new Date(durationSeconds).toISOString().substr(11, 8);

  return durationIsoDate;
}

const getCurrentJson = () => {
  const logFile = fs.readFileSync(LOG_FILE_PATH);
  const currentJson = JSON.parse(logFile);
  
  return currentJson;
}

module.exports = {
  startTracking,
  stopTracking,
  lastEntryDuration,
  listEntries
}