const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function finalFixPsgcHierarchy10() {
  console.log("🔧 Final fix for 10-digit PSGC hierarchy...");

  const locations = await prisma.psgcLocation.findMany();

  const codeToId = {};
  locations.forEach((loc) => {
    codeToId[loc.psgcCode] = loc.id;
  });

  let updated = 0;

  // Step 1: Set province/HUC parent to region
  console.log("📌 Setting province/HUC parent to region...");
  for (const loc of locations) {
    if (loc.type === "PROVINCE" || loc.type === "HUC") {
      // Get the region code (first 2 digits + 0000000000)
      const regionCode = loc.psgcCode.substring(0, 2) + "0000000000";
      if (codeToId[regionCode]) {
        await prisma.psgcLocation.update({
          where: { id: loc.id },
          data: { parentId: codeToId[regionCode] },
        });
        updated++;
        console.log(`✅ ${loc.name} → region: ${regionCode}`);
      } else {
        console.log(`⚠️ No region found for ${loc.name} (${loc.psgcCode})`);
      }
    }
  }

  // Step 2: Set city/municipality parent to province/HUC
  console.log("📌 Setting city/municipality parent to province/HUC...");
  for (const loc of locations) {
    if (loc.type === "CITY" || loc.type === "MUNICIPALITY") {
      // Get the province/HUC code (first 5 digits + 0000000000)
      const provinceCode = loc.psgcCode.substring(0, 5) + "0000000000";
      if (codeToId[provinceCode]) {
        await prisma.psgcLocation.update({
          where: { id: loc.id },
          data: { parentId: codeToId[provinceCode] },
        });
        updated++;
        console.log(`✅ ${loc.name} → province/HUC: ${provinceCode}`);
      } else {
        console.log(
          `⚠️ No province/HUC found for ${loc.name} (${loc.psgcCode})`,
        );
      }
    }
  }

  console.log(`\n🎉 Updated ${updated} records.`);
  await prisma.$disconnect();
}

finalFixPsgcHierarchy10().catch(console.error);
