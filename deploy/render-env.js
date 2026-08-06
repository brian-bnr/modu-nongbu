// Reads `aws ssm get-parameters-by-path` JSON (array of {Name, Value}) from stdin
// and writes KEY=VALUE lines (stripping the /modu-nongbu/prod/ prefix) to stdout.
const PREFIX = "/modu-nongbu/prod/";

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  const params = JSON.parse(input);
  for (const { Name, Value } of params) {
    const key = Name.startsWith(PREFIX) ? Name.slice(PREFIX.length) : Name;
    process.stdout.write(`${key}=${Value}\n`);
  }
});
