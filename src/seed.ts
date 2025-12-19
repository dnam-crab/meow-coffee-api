import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

async function main(): Promise<void> {
  const email = "admin@meow.local";
  const password = "123456";

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: {
      email,
      passwordHash,
      role: "ADMIN", // nếu schema của mày dùng enum role
    },
  });

  // eslint-disable-next-line no-console
  console.log("Seeded user:", { email, password });
}

main()
  .catch((e: unknown) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
