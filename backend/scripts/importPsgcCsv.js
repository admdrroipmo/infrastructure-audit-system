const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const prisma = new PrismaClient();

async function importPsgcCsv() {
  const filePath = path.join(
    __dirname,
    "../../frontend/src/components/forms/psgc_data.csv",
  );

  console.log("📂 Reading CSV file from:", filePath);

  if (!fs.existsSync(filePath)) {
    console.error("❌ File not found at:", filePath);
    return;
  }

  // Read the file as text
  const fileContent = fs.readFileSync(filePath, "utf8");
  const lines = fileContent.split("\n");

  console.log(`📊 File has ${lines.length} lines`);

  // Parse the CSV manually
  const results = [];
  const headers = lines[0].split(",").map((h) => h.trim());

  console.log("📋 Headers:", headers);

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(",").map((v) => v.trim());
    if (values.length !== headers.length) continue;

    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });

    const psgcCode = row["10-digit PSGC"] || "";
    const name = row["Name"] || "";
    const type = row["Geographic Level"] || "";

    if (psgcCode && name && type) {
      results.push({
        psgcCode: String(psgcCode).trim(),
        name: String(name).trim(),
        type: String(type).trim().toUpperCase(),
      });
    }
  }

  console.log(`📊 Found ${results.length} records`);

  if (results.length === 0) {
    console.log("⚠️ No records found. Please check the CSV format.");
    return;
  }

  // Get all existing PSGC codes to filter out duplicates
  const existingCodes = await prisma.psgcLocation.findMany({
    select: { psgcCode: true },
  });
  const existingSet = new Set(existingCodes.map((e) => e.psgcCode));

  // Filter out existing records
  const newRecords = results.filter((r) => !existingSet.has(r.psgcCode));

  console.log(
    `📊 ${newRecords.length} new records to import (skipped ${results.length - newRecords.length} duplicates)`,
  );

  if (newRecords.length === 0) {
    console.log("✅ All records already exist in the database.");
    return;
  }

  // Batch insert
  const batchSize = 100;
  let imported = 0;

  for (let i = 0; i < newRecords.length; i += batchSize) {
    const batch = newRecords.slice(i, i + batchSize);

    const batchData = batch.map((row) => ({
      psgcCode: row.psgcCode,
      name: row.name,
      type: row.type,
      parentId: null,
    }));

    await prisma.psgcLocation.createMany({
      data: batchData,
      skipDuplicates: true,
    });

    imported += batch.length;
    console.log(
      `✅ Imported batch ${i / batchSize + 1}/${Math.ceil(newRecords.length / batchSize)} (${batch.length} records)`,
    );
  }

  console.log(`\n🎉 Import complete! ${imported} records imported.`);

  // ─── OPTIMIZED PARENT UPDATE ──────────────────────────────────
  console.log("🔄 Updating parent relationships in batch...");

  // Get all imported records with their parent codes
  const allImported = await prisma.psgcLocation.findMany({
    where: {
      psgcCode: { in: newRecords.map((r) => r.psgcCode) },
    },
    select: { id: true, psgcCode: true },
  });

  const psgcCodeToId = {};
  allImported.forEach((r) => {
    psgcCodeToId[r.psgcCode] = r.id;
  });

  // Build updates in memory
  const updates = [];
  for (const row of newRecords) {
    if (row.type !== "REGION") {
      const parentCode = row.psgcCode.substring(0, 9) + "0000000000";
      const parentId = psgcCodeToId[parentCode];
      if (parentId) {
        updates.push({
          id: psgcCodeToId[row.psgcCode],
          parentId: parentId,
        });
      }
    }
  }

  // Update in batches
  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize);
    const promises = batch.map((u) =>
      prisma.psgcLocation.update({
        where: { id: u.id },
        data: { parentId: u.parentId },
      }),
    );
    await Promise.all(promises);
    console.log(
      `✅ Updated parent relationships batch ${i / batchSize + 1}/${Math.ceil(updates.length / batchSize)}`,
    );
  }

  console.log("✅ Parent relationships updated.");
  await prisma.$disconnect();
}

importPsgcCsv().catch(console.error);
