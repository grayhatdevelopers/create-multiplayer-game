import { logger } from '../logger.mjs'
import { Command } from "commander"
import inquirer from "inquirer";
// import download from "download-git-repo";
import _ from "lodash";
import ora from "ora";
import chalk from "chalk";
import path from "path";
import { promises as fs } from "fs"; // Import promises version of fs for async file operations

import templates from "../data/templates.mjs";
import { replaceInDirectory } from "../cookie-cutting/replacer.mjs";
import { addTemplateUpstream, cloneTemplate } from "../git-actions.mjs";

import { DEFAULT_CONFIG_NAME } from '../data/cmg-config.mjs';

import { getPackageInfo } from "../data/package-info.mjs";
const { version } = getPackageInfo()

export const initAction = async (name, options, program) => {
    
  let projectName = program.args[0];
  let gameName = projectName;
  let templateId = program.template;
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
    if (!templateId && config.templateId) templateId = config.templateId;
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

  if (!templateId) {
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "templateId",
        message: "Which template would you like to use?",
        choices: templates.map((template) => template.id + (template.source === "community" ? " (community)" : "")),
      },
    ]);
    templateId = answers.templateId.split(" ")[0]; // <-- remove any addons to the ID
  }

  const chosenTemplate = templates.find(
    (template) => template.id === templateId
  )

  const templateRepoUrl = chosenTemplate.repository.url;
  const cwd = process.cwd()
  const targetPath = path.join(cwd, projectName);
  const spinner = ora("Downloading project template...").start();

  try {
    await cloneTemplate(templateRepoUrl, projectName, cwd)
  }
  catch (err) {
    spinner.fail(chalk.red("Failed to download project template."));
    if (chosenTemplate.price === "premium") {
      logger.warn("This template is 👑 Premium. We're releasing Premium purchases soon at https://grayhat.studio/games/pricing. Until then, sit tight!")
    }
    else {
      logger.error("Couldn't clone your project. Please check your git configuration, or check if a folder with a similar name to the project you want to create already exists.");
      logger.log("Detailed error log:");
    }
    console.error(err);
  }


  try {
    const addTemplateUpstreamOutput = await addTemplateUpstream(templateRepoUrl, targetPath)
    // console.log("addTemplateUpstreamOutput", addTemplateUpstreamOutput);
  }
  catch(error) {
    if (!String(error).includes("remote upstream already exists")) {
      logger.error("Couldn't configure the repository properly.")
      logger.error(error)
    }
  }

  if (chosenTemplate.editable) {
    // Cookie cutting
    replaceInDirectory(targetPath, new RegExp("%GAME_NAME%", "g"), gameName);
  }

  spinner.succeed(chalk.green("Project template downloaded successfully."));
  logger.warn(`\nProject initialized at ${targetPath}`);

  logger.info("\nHappy coding!");

  // Write configuration to file
  const configData = {
    projectName,
    gameName,
    templateId,
    generatedAt,
    lastRunAt,
    version
  };

  let configFileWritePath = path.join(targetPath, DEFAULT_CONFIG_NAME);
  fs.writeFile(configFileWritePath, JSON.stringify(configData, null, 2))
    .then(() =>
      logger.success(`Configuration saved to ${configFileWritePath}`)
    )
    .catch((err) =>
      logger.error(`Error writing configuration file: ${err.message}`)
    );

}

export const init = new Command()
.name("init")
.arguments("[project-name]")
.option("-t, --template <template>", "Specify the template")
.option("-c, --config <config>", "Specify the configuration file")
.description("Scaffold a game")
  .action(initAction)
