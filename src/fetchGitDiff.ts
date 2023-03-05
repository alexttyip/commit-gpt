import { exec } from "child_process";
import { promisify } from "util";

const promisifiedExec = promisify(exec);

const fetchGitDiff = async (
  excludePatterns = ["./package-lock.json"]
): Promise<string> => {
  const excludePatternsString = excludePatterns
    .map((pattern) => `':!${pattern}'`)
    .join(" ");

  const { stdout } = await promisifiedExec(
    `git diff HEAD -- . ${excludePatternsString}`,
    {
      encoding: "utf-8",
    }
  );

  return stdout;
};

export default fetchGitDiff;
