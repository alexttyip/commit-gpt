import Conf from "conf";
import inquirer from "inquirer";
import { validateOpenAiApiKey } from "./openAiClient.js";

export const confSchema = {
  OPENAI_API_KEY: {
    type: "string",
  },
};

const OPENAI_API_KEY_CONFIG_KEY = "OPENAI_API_KEY";

const isString = (apiKey: unknown): apiKey is string =>
  typeof apiKey === "string";

export const getOrRequestOpenAiApiKey = async (): Promise<string> => {
  const config = new Conf({ projectName: "commit-gpt", schema: confSchema });
  const apiKey = config.get(OPENAI_API_KEY_CONFIG_KEY);

  if (isString(apiKey)) {
    if (await validateOpenAiApiKey(apiKey)) {
      return apiKey;
    }

    console.log("API key is invalid.");
  }

  for (;;) {
    try {
      const answers = await inquirer.prompt([
        {
          type: "password",
          message: "Enter your OpenAI API key",
          name: "apiKey",
          validate: async (input) => {
            if (!isString(input)) {
              return "API key is invalid.";
            }

            if (!input?.length) {
              return "API key cannot be empty.";
            }

            if (!(await validateOpenAiApiKey(input))) {
              return "API key is invalid.";
            }

            return true;
          },
        },
      ]);

      const { apiKey } = answers ?? {};

      if (isString(apiKey)) {
        config.set(OPENAI_API_KEY_CONFIG_KEY, apiKey);

        return apiKey;
      }
    } catch (e) {
      console.error(e);
    }

    console.log("Unable to set API key. Try again?");
  }
};
