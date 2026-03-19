
import "dotenv/config";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email    = process.env.ADMIN_EMAIL    || "admin@evalocal.com";
  const password = process.env.ADMIN_PASSWORD || "Admin@1234!";
  const name     = process.env.ADMIN_NAME     || "Admin";

  const hashed = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: "ADMINISTRATOR",
      emailVerifiedAt: new Date(),
      password: hashed,
      name,
    },
    create: {
      email,
      name,
      password: hashed,
      role: "ADMINISTRATOR",
      emailVerifiedAt: new Date(), // pre-verified — no email flow
    },
  });

  console.log(`✅ Admin account ready: ${user.email} (id: ${user.id})`);
}

main()
  .catch((e) => { console.error("❌ Failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
