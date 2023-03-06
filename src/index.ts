#!/usr/bin/env node

import { requestCommitMessagesFromOpenAi } from "./openAiClient.js";
import fetchGitDiff from "./fetchGitDiff.js";
import { oraPromise } from "ora";
import { getOrRequestOpenAiApiKey } from "./config.js";
import finaliseCommitMessage from "./finaliseCommitMessage.js";

const openAiApiKey = await getOrRequestOpenAiApiKey();

// program
//   .name("CommitGPT")
//   .description("Let AI write your commit messages for you!")
//   .version("1.0.0")
//   .parse();

const diff = await oraPromise(fetchGitDiff(), {
  text: "🗒 Fetching Git diff",
  successText: "🗒 Fetched Git diff",
});

const suggestions = await oraPromise(
  requestCommitMessagesFromOpenAi(openAiApiKey, diff),
  {
    text: "🧠 The AI overlords are thinking...",
    successText: "💡 The AI overlords have answered",
  }
);

const commitMessage = await finaliseCommitMessage(suggestions);

console.log("Here's your commit message!");

console.log(commitMessage);
