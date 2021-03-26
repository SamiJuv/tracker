const dateFormat = require("dateformat");
const inquirer = require("inquirer");

const { log } = require("../utils/log");

const { 
  appendJsonToLogFile,
  getLastEntryInLogFile,
  getDurationOfLastEntry,
  logEndTime,
  getAllLogEntires,
  getAllProjects,
  addNewProject,
  deleteProjectFromFile
} = require("../utils/files");
const { stringToMachineName } = require("../utils/strings");

const startTracking = () => {
  const date = new Date();
  const timestamp = Date.now();
  const formattedTime = dateFormat(date, "H:MM:ss")

  if (isAlreadyTracking()) {
    log("Already tracking!", "error");
    return false;
  }

  const projectOptions = getProjectOptions();

  inquirer
    .prompt([
      {
        type: "list",
        name: "project",
        message: "Select the project where you want to log the time",
        choices: [
          "No project",
          new inquirer.Separator(),
          ...projectOptions,
          new inquirer.Separator(),
          "Cancel"
        ]
      }
    ])
    .then((answer) => {
      if (answer.project === "Cancel") {
        return false;
      }

      const newEntry = {
        startTime: timestamp,
        ...answer.project !== "No project" && { project: answer.project }
      };
    
      appendJsonToLogFile(newEntry);
      
      log(`Time tracking started at ${formattedTime}`, "notice");
    });
}

const stopTracking = (message) => {
  const timestamp = Date.now();
  logEndTime(timestamp, message);

  const duration = getDurationOfLastEntry();

  log("Tracking stopped", "success");
  log(`Duration: ${duration}`, "info");
}

const lastEntryDuration = () => {
  log(getDurationOfLastEntry(), "info");
}

const listEntries = () => {
  const allEntries = getAllLogEntires();

  const formattedEntries = allEntries.slice(0, 20).map(entry => {
    const durationSeconds = entry.endTime - entry.startTime;
    const durationIsoDate = new Date(durationSeconds).toISOString().substr(11, 8);
    
    return {
      ...entry.project && { project: entry.project },
      message: entry.message,
      duration: durationIsoDate
    }
  });

  log(formattedEntries, "info");
}

const createProject = (name) => {
  const newProject = {
    name: name,
    machineName: stringToMachineName(name)
  };

  if (addNewProject(newProject)) {
    log(`New project added: ${name}`, "success");
  } else {
    log("Error while creating project", "error");
  }
}

const listProjects = () => {
  const allProjects = getAllProjects();

  if (!allProjects) {
    log("You haven't created projects yet", "error");
    return;
  }

  allProjects.forEach(project => {
    log(project.name, "info");
  });
}

const deleteProject = () => {
  const projectOptions = getProjectOptions();

  inquirer
    .prompt([
      {
        type: "list",
        name: "project",
        message: "Select the project you want to delete",
        choices: [
          ...projectOptions,
          new inquirer.Separator(),
          "Cancel"
        ]
      }
    ])
    .then((answer) => {
      if (answer.project !== "Cancel") {
        deleteProjectFromFile(answer.project);
        log("Project deleted", "success");
      }
    });
}

const isAlreadyTracking = () => {
  const lastEntry = getLastEntryInLogFile();

  if (lastEntry && !lastEntry.hasOwnProperty("endTime")) {
    return true;
  }

  return false;
}

const getProjectOptions = () => {
  const projects = getAllProjects();
  const projectOptions = projects.map(project => {
    return {
      name: project.name,
      value: project.machineName
    }
  });

  return projectOptions;
}

module.exports = {
  startTracking,
  stopTracking,
  lastEntryDuration,
  listEntries,
  createProject,
  listProjects,
  deleteProject
}