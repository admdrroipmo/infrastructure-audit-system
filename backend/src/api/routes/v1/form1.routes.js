const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/submit", async (req, res) => {
  try {
    const { data, userId } = req.body;

    // Get the user to get their PSGC location
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Create the building record
    const building = await prisma.building.create({
      data: {
        buildingName: data.building_name || "Unnamed Building",
        psgcId: user.psgcId,
        assessmentStatus: "PENDING_RVS",
        form1: {
          create: {
            data: data,
            status: "DRAFT",
          },
        },
      },
    });

    res.json({ buildingId: building.id });
  } catch (error) {
    console.error("Error submitting Form 1:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
