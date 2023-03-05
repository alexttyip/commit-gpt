#!/usr/bin/env node

import * as dotenv from "dotenv";
dotenv.config();

import { program } from "commander";
import requestCommitMessagesFromOpenAi from "./openAiClient.js";
import fetchGitDiff from "./fetchGitDiff.js";
import { oraPromise } from "ora";

// console.log({ argv: process.argv });

program
  .name("CommitGPT")
  .description("Let AI write your commit messages for you!")
  .version("1.0.0");

program.parse();

const diff = await oraPromise(fetchGitDiff(), {
  text: "🗒 Fetching Git diff",
  successText: "🗒 Fetched Git diff",
});

const res = await oraPromise(requestCommitMessagesFromOpenAi(diff), {
  text: "🧠 The AI overlords are thinking...",
  successText: "💡 The AI overlords have answered",
});

console.log(res);

// clear();
// console.log(
//   chalk.red(figlet.textSync("CommitGPT", { horizontalLayout: "full" }))
// );
