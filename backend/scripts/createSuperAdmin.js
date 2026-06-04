const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Creating Super Admin...");

  // Check if Super Admin PSGC exists
  let psgc = await prisma.psgcLocation.findUnique({
    where: { psgcCode: "000000000" },
  });

  if (!psgc) {
    psgc = await prisma.psgcLocation.create({
      data: {
        psgcCode: "000000000",
        name: "Super Admin Access",
        type: "REGION",
      },
    });
    console.log("✅ Super Admin PSGC created:", psgc.psgcCode);
  } else {
    console.log("✅ Super Admin PSGC already exists:", psgc.psgcCode);
  }

  // Check if Super Admin user exists
  const existingUser = await prisma.user.findUnique({
    where: { email: "admin@auditph.gov.ph" },
  });

  if (existingUser) {
    console.log("⚠️ Super Admin already exists:", existingUser.email);
    return;
  }

  // Create Super Admin user
  const hashedPassword = await bcrypt.hash("sadmin123", 10);

  const admin = await prisma.user.create({
    data: {
      fullName: "Super Admin",
      email: "admin@auditph.gov.ph",
      passwordHash: hashedPassword,
      psgcId: psgc.id,
      accessLevel: "SUPER_ADMIN",
    },
  });

  console.log("✅ Super Admin created successfully!");
  console.log("📧 Email:", admin.email);
  console.log("🔑 Password: sadmin123");
}

main()
  .catch((e) => console.error("❌ Error:", e))
  .finally(() => prisma.$disconnect());
