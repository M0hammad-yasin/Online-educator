import prisma from "./prisma.client.js"; // adjust path to your prisma client wrapper

async function main() {
  await prisma.student.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      grade: 10,
      passwordHash: "hashedpassword",
      role: "STUDENT",
    },
  });

  await prisma.teacher.create({
    data: {
      name: "Ms. Smith",
      email: "smith@example.com",
      passwordHash: "hashedpassword",
      role: "TEACHER",
    },
  });

  console.log("✅ Seed data inserted!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
