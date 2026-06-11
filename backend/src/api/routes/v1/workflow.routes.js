const express = require("express");
const router = express.Router(); // ← THIS WAS MISSING
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ─── GET: Get submissions based on user type and PSGC jurisdiction ─────
router.get("/submissions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Get the user with their PSGC location
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        psgc: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    let whereClause = {};

    // ─── FILTER BASED ON USER TYPE ──────────────────────────────
    if (user.userType === "LILHUB") {
      // LILhub users see only their own submissions
      whereClause = {
        psgcId: user.psgcId,
      };
    } else if (user.userType === "LIAT") {
      // LIAT users see all submissions from LILhubs under their region
      // Get all PSGC codes under this LIAT's region
      const regionPsgcCodes = await prisma.psgcLocation.findMany({
        where: {
          parentId: user.psgcId,
        },
        select: {
          id: true,
        },
      });

      const psgcIds = regionPsgcCodes.map((p) => p.id);
      whereClause = {
        psgcId: {
          in: psgcIds,
        },
      };
    } else if (
      user.accessLevel === "SUPER_ADMIN" ||
      user.userType === "CENTRAL"
    ) {
      // Central Office or Super Admin sees everything
      whereClause = {};
    }

    // Get submissions with workflow status
    const submissions = await prisma.building.findMany({
      where: {
        ...whereClause,
        submissionStatus: {
          not: "DRAFT", // Only show submitted buildings
        },
      },
      include: {
        psgc: true,
        form1: true,
      },
      orderBy: {
        submittedAt: "desc",
      },
    });

    res.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ error: error.message });
  }
});

// ─── POST: Submit a building from LILhub → LIAT ──────────────────────
router.post("/submit", async (req, res) => {
  try {
    const { buildingId, userId } = req.body;

    // Verify the user is a LILhub user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { psgc: true },
    });

    if (!user || user.userType !== "LILHUB") {
      return res
        .status(403)
        .json({ error: "Only LILhub users can submit buildings." });
    }

    // Verify the building exists and belongs to this user's PSGC jurisdiction
    const building = await prisma.building.findUnique({
      where: { id: buildingId },
    });

    if (!building) {
      return res.status(404).json({ error: "Building not found." });
    }

    // Update the building's workflow status
    const updatedBuilding = await prisma.building.update({
      where: { id: buildingId },
      data: {
        currentLevel: "LIAT",
        submissionStatus: "PENDING",
        submittedAt: new Date(),
      },
    });

    res.json({
      message: "Building submitted to LIAT successfully.",
      building: updatedBuilding,
    });
  } catch (error) {
    console.error("Error submitting building:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; // ← THIS WAS ALSO MISSING
