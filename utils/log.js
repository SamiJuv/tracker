const chalk = require("chalk");

const log = (message, type) => {
  if (type) {
    switch (type) {
      case "notice":
        console.log(chalk.blue(message));
        break;

      case "info":
        console.log(chalk.cyan(message));
        break;

      case "success":
        console.log(chalk.green(message));
        break;

      case "error":
        console.log(chalk.red(message));
        break;

      default:
        console.log(message);
        break;
    }
  } else {
    console.log(message);
  }
}

module.exports = { log };