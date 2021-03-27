const fs = require("fs");

const { LOG_FILE_PATH, PROJECTS_FILE_PATH } = require("../constants");
const { calculateDuration } = require("./times");

const appendJsonToLogFile = (jsonItem) => {
  const logFile = fs.readFileSync(LOG_FILE_PATH);
  const currentJson = JSON.parse(logFile);
  const newJson = currentJson.concat(jsonItem);

  fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(newJson));
}

const getLastEntryInLogFile = () => {
  const allLogEntries = getAllLogEntires();
  const lastEntry = allLogEntries[allLogEntries.length-1];

  return lastEntry;
}

const getDurationOfLastEntry = () => {
  const lastEntry = getLastEntryInLogFile();
  const duration = calculateDuration(lastEntry.startTime, lastEntry.endTime);

  return duration;
}

const logEndTime = (timestamp, message) => {
  const allLogEntries = getAllLogEntires();
  const lastEntry = allLogEntries[allLogEntries.length-1];

  const newJson = allLogEntries.map(entry => {
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

const getAllLogEntires = () => {
  try {
    fs.accessSync(LOG_FILE_PATH, fs.constants.R_OK);

    const logFile = fs.readFileSync(LOG_FILE_PATH);
    const currentEntries = JSON.parse(logFile);
    
    return currentEntries;
  } catch (err) {
    return false;
  }
}

const getAllProjects = () => {
  try {
    fs.accessSync(PROJECTS_FILE_PATH, fs.constants.R_OK);
    
    const projectsFile = fs.readFileSync(PROJECTS_FILE_PATH);
    const allProjects = JSON.parse(projectsFile);

    return allProjects;
  } catch (err) {
    return false;
  }
}

const addNewProject = (newProject) => {
  fs.access(PROJECTS_FILE_PATH, fs.constants.F_OK, (err) => {
    if (err) {
      fs.writeFileSync(PROJECTS_FILE_PATH, JSON.stringify([newProject]));
    } else {
      const allProjects = getAllProjects();
      const newJson = allProjects.concat(newProject);

      fs.writeFileSync(PROJECTS_FILE_PATH, JSON.stringify(newJson));
    }
  });

  return true;
}

const deleteProjectData = (projectMachineName) => {
  // Remove from projects
  const allProjects = getAllProjects();
  const newProjectsJson = allProjects.filter(project => project.machineName !== projectMachineName);

  fs.writeFileSync(PROJECTS_FILE_PATH, JSON.stringify(newProjectsJson));

  // Remove from time log
  const logEntries = getAllLogEntires();
  const newLogJson = logEntries.filter(entry => entry.project !== projectMachineName);

  fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(newLogJson));
}

const getProjectByMachineName = (projectMachineName) => {
  const allProjects = getAllProjects();
  const project = allProjects.find(project => project.machineName === projectMachineName);
  
  return project;
}

const getProjectTotalTime = (projectMachineName) => {
  if (!projectMachineName) {
    return false;
  }

  const allEntries = getAllLogEntires();
  const selectedProjectsEntries = allEntries.filter(entry => entry.project === projectMachineName);
  
  const totalMilliSeconds = selectedProjectsEntries.reduce((acc, curr) => {
    const durationMilliSeconds = curr.endTime - curr.startTime;
    return acc + durationMilliSeconds;
  }, 0);

  const totalTime = new Date(totalMilliSeconds).toISOString().substr(11, 8);

  return totalTime;
}

module.exports = {
  appendJsonToLogFile,
  getLastEntryInLogFile,
  getDurationOfLastEntry,
  logEndTime,
  getAllLogEntires,
  getAllProjects,
  addNewProject,
  deleteProjectData,
  getProjectByMachineName,
  getProjectTotalTime
}