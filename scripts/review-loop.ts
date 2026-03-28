import process from "node:process";

const project = process.argv[2] ?? "portfolio-v1";

const phases = {
  architect: [
    "define the desired outcome",
    "list acceptance criteria and constraints",
    "state any layout, motion, or accessibility guardrails",
  ],
  coder: [
    "implement the smallest valid slice",
    "keep strict TypeScript and narrow data contracts",
    "avoid extra abstraction and unrelated cleanup",
  ],
  reviewer: [
    "human-coded aesthetics",
    "zero rounded corners",
    "high-contrast",
    "no redundant explanatory text",
    "deliberate spacing, typography, and motion",
    "accessible focus states and contrast",
    "reject generic or slop UI",
  ],
} as const;

console.log(`ClawdBot review loop for ${project}\n`);
for (const [phase, items] of Object.entries(phases)) {
  console.log(`${phase.toUpperCase()}:`);
  for (const item of items) {
    console.log(`- ${item}`);
  }
  console.log("");
}
