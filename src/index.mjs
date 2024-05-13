#!/usr/bin/env node
import { program } from "commander";

import { sync } from "./utils/commands/sync.mjs";
import { init, initAction } from "./utils/commands/init.mjs";

import packageJson from "../package.json" with { type: "json" };
const { version } = packageJson

const cmds = {
  init,
  sync
}

const isArgumentACommand = !!cmds[process.argv[2]]
const isContainsHelp = process.argv.includes(a => a === "--help")

program
  .version(
    version,
    "-v, --version",
    "Display the version number"
  )
  .argument("[command]")
  .argument("[project-name]")
  
  if (isArgumentACommand || isContainsHelp) {
    Object.values(cmds).forEach(cmd => {
      program.addCommand(cmd)
    })
  }
  else {
    program
    .option("-t, --template <template>", "Specify the template")
    .option("-c, --config <config>", "Specify the configuration file")
    .action(async (command, projectName, options) => {
        // If no command is provided, run the default command (init)
        await initAction(projectName, options, program);
    });
  }

program.parse(process.argv);
