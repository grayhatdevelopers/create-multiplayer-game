#!/usr/bin/env node
import { program } from 'commander';
import inquirer from 'inquirer';
import download from 'download-git-repo';
import ora from 'ora';
import chalk from 'chalk';
import path from 'path';

const templateOptions = [
  'vanilla',
  'vanilla-ts',
  'vue',
  'vue-ts',
  'react',
  'react-ts',
  'react-swc',
  'react-swc-ts',
  'preact',
  'preact-ts',
  'lit',
  'lit-ts',
  'svelte',
  'svelte-ts',
  'solid',
  'solid-ts',
  'qwik',
  'qwik-ts',
];

program
  .version('1.0.0')
  .arguments('[project-name]')
  .option('-t, --template <template>', 'Specify the template')
  .parse(process.argv);

async function run() {
  let projectName = program.args[0];
  let templateChoice = program.template;

  if (!projectName) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Enter the project name:',
        validate: (input) => !!input.trim(),
      },
    ]);
    projectName = answers.projectName;
  }

  if (!templateChoice) {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'templateChoice',
        message: 'Which template would you like to use?',
        choices: templateOptions,
      },
    ]);
    templateChoice = answers.templateChoice;
  }

  const templateRepoUrl = `your/${templateChoice}-template-repo`;
  const targetPath = path.join(process.cwd(), projectName);
  const spinner = ora('Downloading project template...').start();

  download(templateRepoUrl, targetPath, { clone: true }, (err) => {
    if (err) {
      spinner.fail(chalk.red('Failed to download project template.'));
      console.error(err);
    } else {
      spinner.succeed(chalk.green('Project template downloaded successfully.'));
      console.log(chalk.yellow(`\nProject initialized at ${targetPath}`));

      // Additional setup or post-processing here if needed

      console.log(chalk.cyan('\nHappy coding!'));
    }
  });
}

run();
