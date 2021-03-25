const path = require("path");

const LOG_FILE_PATH = path.resolve(__dirname, "../data/trackingLog.json");
const PROJECTS_FILE_PATH = path.resolve(__dirname, "../data/projects.json");

module.exports = {
  LOG_FILE_PATH,
  PROJECTS_FILE_PATH
}