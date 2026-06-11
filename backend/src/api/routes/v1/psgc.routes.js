const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get PSGC location by code
router.get("/location/:code", async (req, res) => {
  try {
    // Inside the match endpoint, after building the result:
    console.log("📦 Returning PSGC data:", result);
    const { code } = req.params;
    const location = await prisma.psgcLocation.findUnique({
      where: { psgcCode: code },
      include: {
        parent: {
          include: {
            parent: true,
          },
        },
      },
    });
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }
    res.json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get coordinates for a location name via Nominatim
router.get("/geocode/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(name)}&limit=1&accept-language=en`,
    );
    const data = await response.json();
    if (data && data.length > 0) {
      const result = data[0];
      res.json({
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        displayName: result.display_name,
        address: result.address,
      });
    } else {
      res.status(404).json({ error: "Location not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Match a location name to the closest PSGC entry
// Match a location name to the closest PSGC entry with full hierarchy
router.get("/match/:name", async (req, res) => {
  try {
    const { name } = req.params;
    // Search for the location name in the PSGC database
    const locations = await prisma.psgcLocation.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
      include: {
        parent: {
          include: {
            parent: {
              include: {
                parent: true, // Get up to 4 levels (region, province, city, barangay)
              },
            },
          },
        },
      },
      take: 5,
    });

    if (locations.length === 0) {
      return res
        .status(404)
        .json({ error: "Location not found in PSGC database" });
    }

    // Return the best match with full hierarchy
    const bestMatch =
      locations.find((l) => l.name.toLowerCase() === name.toLowerCase()) ||
      locations[0];

    // Build the hierarchy
    const result = {
      id: bestMatch.id,
      psgcCode: bestMatch.psgcCode,
      name: bestMatch.name,
      type: bestMatch.type,
      parentId: bestMatch.parentId,
      region: null,
      province: null,
      city: null,
      barangay: null,
    };

    // Traverse up the parent chain to set region, province, city
    let current = bestMatch;
    while (current.parent) {
      if (current.parent.type === "REGION") {
        result.region = current.parent.name;
      } else if (
        current.parent.type === "PROVINCE" ||
        current.parent.type === "HUC"
      ) {
        result.province = current.parent.name;
      } else if (
        current.parent.type === "CITY" ||
        current.parent.type === "MUNICIPALITY"
      ) {
        result.city = current.parent.name;
      }
      current = current.parent;
    }

    res.json(result);
  } catch (error) {
    console.error("Error matching location:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
