import { logger } from "../logger.mjs";
import { Command } from "commander";
import {
  addTemplateUpstream,
  isGitDirty,
  syncTemplate,
} from "../git-actions.mjs";
import inquirer from "inquirer";
import { loadCmgConfig } from "../data/cmg-config.mjs";
import templates from "../data/templates.mjs";

export const sync = new Command()
  .name("sync")
  .description("Sync your game with the latest version of the template.")
//   .option("-y, --yes", "Skip confirmation prompt.", false)
  .action(async (_, options) => {
    const config = loadCmgConfig();

    // console.log("options", options.yes);
    
    try {
      if (!options.yes && isGitDirty()) {
        const answer = await inquirer.prompt({
          type: "confirm",
          name: "confirmGitDirtyProceed",
          message:
            "It seems like you haven't committed some files. Are you sure you want to proceed?",
        });
        if (!answer.confirmGitDirtyProceed) {
          logger.warn("Ended operation.");
          return;
        }
      }

      const output = await syncTemplate();
      logger.success("Synced with remote configuration successfully! Here's the git output:")
      logger.log(output.stdout)

    } catch (error) {
      if (
        String(error).includes(
          "fatal: 'upstream' does not appear to be a git repository"
        )
      ) {
        try {
          const answer = await inquirer.prompt({
            type: "confirm",
            name: "confirmAddUpstream",
            message:
              "Your git is not configured to sync with our template. We will need to add a remote origin called 'upstream' to your git configuration. Proceed?",
          });
          if (!answer.confirmAddUpstream) {
            logger.warn("Ended operation.");
            return;
          }
          const template = templates.find(
            (template) => template.id === config.templateId
          );
          await addTemplateUpstream(template.repository.url);
          const output = await syncTemplate();
          logger.success("Sync with template complete! Here's the git output:")
          logger.log(output.stdout)
        } catch (error) {
          logger.error(error);
        }
      } else {
        logger.error(error);
      }
    }
  });
