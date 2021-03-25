const dateFormat = require("dateformat");
const chalk = require("chalk");
const inquirer = require("inquirer");

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
    console.log(chalk.red("Already tracking!"));
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
      
      console.log(chalk.blue(`Time tracking started at ${formattedTime}`));
    });
}

const stopTracking = (message) => {
  const timestamp = Date.now();
  logEndTime(timestamp, message);

  const duration = getDurationOfLastEntry();

  console.log(chalk.green("Tracking stopped"));
  console.log(chalk.cyan(`Duration: ${duration}`));
}

const lastEntryDuration = () => {
  console.log(getDurationOfLastEntry());
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

  console.log(formattedEntries);
}

const createProject = (name) => {
  const newProject = {
    name: name,
    machineName: stringToMachineName(name)
  };

  if (addNewProject(newProject)) {
    console.log(chalk.green(`New project added: ${name}`));
  } else {
    console.log(chalk.red("Error while creating project"));
  }
}

const listProjects = () => {
  const allProjects = getAllProjects();

  allProjects.forEach(project => {
    console.log(chalk.green(project.name));
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
        console.log(chalk.green("Project deleted"));
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