const fs = require("fs");

const { LOG_FILE_PATH, PROJECTS_FILE_PATH } = require("../constants");

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
  const durationSeconds = lastEntry.endTime - lastEntry.startTime;
  const durationIsoDate = new Date(durationSeconds).toISOString().substr(11, 8);

  return durationIsoDate;
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
  const logFile = fs.readFileSync(LOG_FILE_PATH);
  const currentEntries = JSON.parse(logFile);
  
  return currentEntries;
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

const deleteProjectFromFile = (projectMachineName) => {
  const allProjects = getAllProjects();
  const newJson = allProjects.filter(project => project.machineName !== projectMachineName);

  fs.writeFileSync(PROJECTS_FILE_PATH, JSON.stringify(newJson));
}

const getProjectNameByMachineName = (machineName) => {
  const allProjects = getAllProjects();
  const project = allProjects.find(project => project.machineName === machineName);
  
  return project.name;
}

module.exports = {
  appendJsonToLogFile,
  getLastEntryInLogFile,
  getDurationOfLastEntry,
  logEndTime,
  getAllLogEntires,
  getAllProjects,
  addNewProject,
  deleteProjectFromFile,
  getProjectNameByMachineName
}