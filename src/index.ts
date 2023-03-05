#!/usr/bin/env node

import { program } from "commander";
import { requestCommitMessagesFromOpenAi } from "./openAiClient.js";
import fetchGitDiff from "./fetchGitDiff.js";
import { oraPromise } from "ora";
import { getOrRequestOpenAiApiKey } from "./config.js";

const openAiApiKey = await getOrRequestOpenAiApiKey();

program
  .name("CommitGPT")
  .description("Let AI write your commit messages for you!")
  .version("1.0.0");

program.parse();

const diff = await oraPromise(fetchGitDiff(), {
  text: "🗒 Fetching Git diff",
  successText: "🗒 Fetched Git diff",
});

const res = await oraPromise(
  requestCommitMessagesFromOpenAi(openAiApiKey, diff),
  {
    text: "🧠 The AI overlords are thinking...",
    successText: "💡 The AI overlords have answered",
  }
);

console.log(res);
