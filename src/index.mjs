#!/usr/bin/env node
import { program } from "commander";
import inquirer from "inquirer";
import download from "download-git-repo";
import ora from "ora";
import chalk from "chalk";
import path from "path";
import _ from "lodash";
import { promises as fs } from "fs"; // Import promises version of fs for async file operations

import templates from "./utils/data/templates.mjs";
import { replaceInDirectory } from "./utils/cookie-cutting/replacer.mjs";

import packageJson from "../package.json" with { type: "json" };

let DEFAULT_CONFIG_NAME = "create-multiplayer-game.config.json";

const { version } = packageJson

program
  .version(
    version,
    "-v, --version",
    "Display the version number"
  )
  .arguments("[project-name]")
  .option("-t, --template <template>", "Specify the template")
  .option("-c, --config <config>", "Specify the configuration file")
  .parse(process.argv);

async function main() {
  let projectName = program.args[0];
  let gameName = projectName;
  let templateChoice = program.template;
  let configPath = program.config || DEFAULT_CONFIG_NAME; // Default config file path
  let currentRun = Date.now();
  let generatedAt = currentRun;
  let lastRunAt = currentRun;

  // Check if config file exists
  let configExists = false;
  try {
    await fs.access(configPath);
    configExists = true;
  } catch (err) {
    // Config file doesn't exist, continue without it
  }

  // If config file exists, read configuration from it
  if (configExists) {
    const spinner = ora(
      `Reading config file at ${path.join(process.cwd(), configPath)}...`
    ).start();
    const configData = await fs.readFile(configPath, "utf-8");
    const config = JSON.parse(configData);
    if (!projectName && config.projectName) projectName = config.projectName;
    if (!gameName && config.gameName) gameName = config.gameName;
    if (!templateChoice && config.templateChoice) templateChoice = config.templateChoice;
    if (config.generatedAt) generatedAt = config.generatedAt;
    spinner.succeed();
  }

  // If config file doesn't exist, prompt user for input
  if (!projectName) {
    const answersGameName = await inquirer.prompt([
      {
        type: "input",
        name: "gameName",
        message: "What will you call your game?",
        validate: (input) => !!input.trim(),
      },
    ]);
    gameName = answersGameName.gameName;

    const kebabCaseGameName = _.kebabCase(gameName);

    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "projectName",
        message: "Enter the project name:",
        default: kebabCaseGameName,
        validate: (input) => !!input.trim(),
      },
    ]);
    projectName = answers.projectName;
  }

  if (!templateChoice) {
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "templateChoice",
        message: "Which template would you like to use?",
        choices: templates.map((template) => template.id + (template.source === "community" ? " (community)" : "")),
      },
    ]);
    templateChoice = answers.templateChoice.split(" ")[0]; // <-- remove any addons to the ID
  }

  const chosenTemplate = templates.find(
    (template) => template.id === templateChoice
  )

  const templateRepoUrl = chosenTemplate.url;
  const targetPath = path.join(process.cwd(), projectName);
  const spinner = ora("Downloading project template...").start();

  download(templateRepoUrl, targetPath, { clone: true }, (err) => {
    if (err) {
      spinner.fail(chalk.red("Failed to download project template."));
      if (chosenTemplate.price === "premium") {
        console.info(chalk.yellow("This template is 👑 Premium. We're releasing Premium purchases soon at https://grayhat.studio/games/pricing. Until then, sit tight!"))
      }
      else {
        console.error("Couldn't clone your project. Please check your git configuration, or check if a folder with a similar name to the project you want to create already exists.");
        console.log("Detailed error log:");
      }
      console.error(err);
    } else {

      if (chosenTemplate.editable) {
        // Cookie cutting
        replaceInDirectory(targetPath, new RegExp("%GAME_NAME%", "g"), gameName);
      }

      spinner.succeed(chalk.green("Project template downloaded successfully."));
      console.log(chalk.yellow(`\nProject initialized at ${targetPath}`));

      console.log(chalk.cyan("\nHappy coding!"));

      // Write configuration to file
      const configData = {
        projectName,
        gameName,
        templateChoice,
        generatedAt,
        lastRunAt,
        version
      };

      let configFileWritePath = path.join(targetPath, DEFAULT_CONFIG_NAME);
      fs.writeFile(configFileWritePath, JSON.stringify(configData, null, 2))
        .then(() =>
          console.log(
            chalk.green(`Configuration saved to ${configFileWritePath}`)
          )
        )
        .catch((err) =>
          console.error(
            chalk.red(`Error writing configuration file: ${err.message}`)
          )
        );
    }
  });
}

main();
