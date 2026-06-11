const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const regions = [
  { psgcCode: "010000000", name: "Region I (Ilocos Region)", type: "REGION" },
  { psgcCode: "020000000", name: "Region II (Cagayan Valley)", type: "REGION" },
  { psgcCode: "030000000", name: "Region III (Central Luzon)", type: "REGION" },
  { psgcCode: "040000000", name: "Region IV-A (CALABARZON)", type: "REGION" },
  { psgcCode: "050000000", name: "Region V (Bicol Region)", type: "REGION" },
  {
    psgcCode: "060000000",
    name: "Region VI (Western Visayas)",
    type: "REGION",
  },
  {
    psgcCode: "070000000",
    name: "Region VII (Central Visayas)",
    type: "REGION",
  },
  {
    psgcCode: "080000000",
    name: "Region VIII (Eastern Visayas)",
    type: "REGION",
  },
  {
    psgcCode: "090000000",
    name: "Region IX (Zamboanga Peninsula)",
    type: "REGION",
  },
  {
    psgcCode: "100000000",
    name: "Region X (Northern Mindanao)",
    type: "REGION",
  },
  { psgcCode: "110000000", name: "Region XI (Davao Region)", type: "REGION" },
  { psgcCode: "120000000", name: "Region XII (SOCCSKSARGEN)", type: "REGION" },
  {
    psgcCode: "130000000",
    name: "National Capital Region (NCR)",
    type: "REGION",
  },
  {
    psgcCode: "140000000",
    name: "Cordillera Administrative Region (CAR)",
    type: "REGION",
  },
  { psgcCode: "150000000", name: "Region XV (Bangsamoro)", type: "REGION" },
];

async function main() {
  console.log("🌱 Seeding PSGC data...");

  for (const region of regions) {
    await prisma.psgcLocation.create({
      data: region,
    });
    console.log(`✅ Created: ${region.name}`);
  }

  const count = await prisma.psgcLocation.count();
  console.log(`📊 Total PSGC Locations: ${count}`);
}

main()
  .catch((e) => console.error("❌ Error:", e))
  .finally(() => prisma.$disconnect());
