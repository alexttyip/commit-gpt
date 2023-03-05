import { Configuration, OpenAIApi } from "openai";

const SYSTEM_MESSAGE =
  "You are a helpful assistant to a software engineer that writes git commit messages.";
const USER_CONTENT_START_TEXT = `
I have made some changes to the codebase. I will provide you with the git diff of the changes I made.
You should summarise the changes I made in the form of a git commit message.
You should write the git commit message in the present tense.
You should write the git commit message in one single line.
You should summarise what the changes achieved in the git commit message.

The following is the git diff of the changes I made:
`;

const requestCommitMessagesFromOpenAi = async (
  gitDiff: string
): Promise<string[]> => {
  if (!gitDiff) {
    throw "Git diff is empty.";
  }

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0301",
    messages: [
      {
        role: "system",
        content: SYSTEM_MESSAGE,
      },
      {
        role: "user",
        content: USER_CONTENT_START_TEXT + gitDiff,
      },
    ],
    n: 5,
  });

  return response.data.choices
    .map(({ message }) => message?.content)
    .filter((content): content is string => Boolean(content));
};

export default requestCommitMessagesFromOpenAi;
