#!/usr/bin/env node
import { program } from 'commander';
import inquirer from 'inquirer';
import download from 'download-git-repo';
import ora from 'ora';
import chalk from 'chalk';
import path from 'path';

const templateOptions = [
  'Vite + React + React Router + Framer Motion + Tailwind + Material UI',
  'Nextjs (appDir) + Framer Motion + Tailwind + Material UI',
  'Nextjs (pagesDir) + Framer Motion + Tailwind + Material UI',
];

program
  .version('1.0.0')
  .command('init <project-name>')
  .description('Initialize a new web game project')
  .action(async (projectName) => {
    const prompt = inquirer.createPromptModule();

    const answers = await prompt([
      {
        type: 'list',
        name: 'templateChoice',
        message: 'Which template would you like to use?',
        choices: templateOptions,
      },
    ]);

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
