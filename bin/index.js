#!/usr/bin/env node

const { program } = require("commander");
const { 
  startTracking,
  stopTracking,
  lastEntryDuration,
  listEntries,
  createProject,
  listProjects,
  deleteProject,
  totalTime
} = require("../actions");

program.version("0.1.0", "-v, --version", "output the current version");
program.description("Command line operated time tracking tool");

const options = program.opts();

program
  .command("start")
  .description("Start time tracking")
  .action(() => startTracking());

program
  .command("stop")
  .description("Stop time tracking")
  .option("-m, --message <msg>", "Add message to the time entry")
  .action((options) => stopTracking(options.message));

program
  .command("last-duration")
  .alias("dur")
  .description("Get duration of the last entry")
  .action(() => lastEntryDuration());

program
  .command("list-entries")
  .alias("ls")
  .description("List latest 10 entries")
  .action(() => listEntries());
  
program
  .command("create-project <name>")
  .alias("crproj")
  .description("Create new project")
  .action((name) => createProject(name));

program
  .command("list-projects")
  .alias("lsproj")
  .description("List all project")
  .action(() => listProjects());

program
  .command("delete-project")
  .alias("delproj")
  .description("Delete project")
  .action(() => deleteProject());

program
  .command("total")
  .description("Show total time logged to project")
  .action(() => totalTime());

program.parse(process.argv);