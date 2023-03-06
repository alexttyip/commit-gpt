import inquirer from "inquirer";
import isString from "./isString.js";

const cleanUpCommitMessage = (commitMessage: string) =>
  commitMessage.replace(/^#.*\n?/gm, "").trim();

const finaliseCommitMessage = async (
  suggestions: string[]
): Promise<string> => {
  const editorContent =
    `# These are the ${suggestions.length} suggestions that the AI came up with,\n` +
    `# Modify this file as you wish, this will not commit your changes.\n` +
    `# Lines starting with '#' will be ignored.\n\n` +
    `${suggestions.map((suggestion) => suggestion.trim()).join("\n# ---\n")}\n`;

  for (;;) {
    try {
      const answers = await inquirer.prompt([
        {
          type: "editor",
          message: "Finalise your commit message",
          name: "commitMessage",
          default: editorContent,
        },
      ]);

      const { commitMessage } = answers ?? {};

      if (isString(commitMessage)) {
        return cleanUpCommitMessage(commitMessage);
      }
    } catch (e) {
      console.error(e);
    }

    console.log("Unable to save commit message. Try again?");
  }
};

export default finaliseCommitMessage;
