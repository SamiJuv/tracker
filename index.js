#!/usr/bin/env node

const { program } = require("commander");
const { startTracking, stopTracking, lastEntryDuration, listEntries } = require("./src/actions");

program.version("0.0.1", "-v, --version", "output the current version");
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
  .description("List latest 20 entries")
  .action(() => listEntries());

program.parse(process.argv);