#!/usr/bin/env node
import { program } from 'commander';
import inquirer from 'inquirer';
import download from 'download-git-repo';
import ora from 'ora';
import chalk from 'chalk';
import path from 'path';
import { URLSearchParams } from 'url';

const templateOptions = [
  'Vite + React + React Router + Framer Motion + Tailwind + Material UI',
  'Nextjs (appDir) + Framer Motion + Tailwind + Material UI',
  'Nextjs (pagesDir) + Framer Motion + Tailwind + Material UI',
];

// Create the prompt module outside the action function
const prompt = inquirer.createPromptModule();

program
  .version('1.0.0')
  .arguments('[project-name]')
  .description('Initialize a new web game project')
  .action(async (projectName = null) => {
      const answers = await prompt([
        !projectName ? {
          type: 'input',
          name: 'projectName',
          message: 'Enter the project name:',
          validate: (input) => (input ? true : 'Project name is required'),
        } : undefined,
        {
          type: 'list',
          name: 'templateChoice',
          message: 'Which template would you like to use?',
          choices: templateOptions,
        },
      ].filter(Boolean));

      if (!projectName) projectName = answers.projectName;

    const templateIndex = templateOptions.indexOf(answers.templateChoice);

    if (templateIndex === -1) {
      console.error(chalk.red('Invalid template choice.'));
      process.exit(1);
    }

    const templateRepoUrls = [
      'your/vite-react-router-framer-tailwind-material-ui-template-repo',
      'your/nextjs-appdir-framer-tailwind-material-ui-template-repo',
      'your/nextjs-pagesdir-framer-tailwind-material-ui-template-repo',
    ];

    const templateRepo = templateRepoUrls[templateIndex];
    const targetPath = path.join(process.cwd(), projectName);
    const spinner = ora('Downloading project template...').start();

    // Download the template from the repository
    download(templateRepo, targetPath, { clone: true }, (err) => {
      if (err) {
        spinner.fail(chalk.red('Failed to download project template.'));
        console.error(err);
      } else {
        spinner.succeed(chalk.green('Project template downloaded successfully.'));
        console.log(chalk.yellow(`\nProject initialized at ${targetPath}`));

        // You can perform additional setup or post-processing here if needed

        console.log(chalk.cyan('\nHappy coding!'));
      }
    });
  });

program.parse(process.argv);
