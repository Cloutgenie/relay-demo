import { spawnSync } from "node:child_process";

process.env.DATABASE_URL ??=
  "postgres://46c01ae8003393c71ee663f307c670bf79ce01c92ee33879938b8e394b1604fa:sk_n95MTGdCyvE57C-cSR09O@db.prisma.io:5432/postgres?sslmode=require";
process.env.SPRINKLR_MODE ??= "mock";
process.env.DEMO_ADMIN_EMAIL ??= "admin@relay.demo";
process.env.DEMO_ADMIN_PASSWORD ??= "demo";

const steps = [
  ["npx", ["prisma", "generate"]],
  ["npx", ["prisma", "db", "push", "--skip-generate"]],
  ["npx", ["tsx", "prisma/seed.ts"]],
  ["npx", ["next", "build"]],
];

for (const [cmd, args] of steps) {
  const result = spawnSync(cmd, args, { stdio: "inherit", env: process.env });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
