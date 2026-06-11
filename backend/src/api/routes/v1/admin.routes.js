const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

// Get all users (with PSGC relations)
router.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { psgc: true },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new user
router.post("/users", async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      psgcId,
      accessLevel,
      userType,
      locationType,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash: hashedPassword,
        psgcId,
        accessLevel,
        userType: userType || null,
        locationType: locationType || null,
      },
    });
    res.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update a user
router.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, psgcId, accessLevel, userType, locationType } =
      req.body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        fullName,
        email,
        psgcId,
        accessLevel,
        userType: userType || null,
        locationType: locationType || null,
      },
    });
    res.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a user (prevent Super Admin deletion)
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.accessLevel === "SUPER_ADMIN") {
      return res.status(400).json({ error: "Cannot delete Super Admin" });
    }
    await prisma.user.delete({ where: { id } });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all PSGC locations
router.get("/psgc", async (req, res) => {
  try {
    const psgc = await prisma.psgcLocation.findMany();
    res.json(psgc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single user by ID
router.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: { psgc: true },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single PSGC location with its hierarchy
router.get("/psgc/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const psgc = await prisma.psgcLocation.findUnique({
      where: { id },
      include: {
        parent: {
          include: {
            parent: true, // Get grandparent (region)
          },
        },
      },
    });
    if (!psgc)
      return res.status(404).json({ error: "PSGC location not found" });

    // Build the hierarchy result
    const result = {
      id: psgc.id,
      name: psgc.name,
      type: psgc.type,
      coordinates: null, // You can add coordinates to the PsgcLocation model if needed
    };

    if (psgc.type === "PROVINCE" || psgc.type === "HUC") {
      result.region = psgc.parent;
    } else if (psgc.type === "CITY" || psgc.type === "MUNICIPALITY") {
      result.province = psgc.parent;
      result.region = psgc.parent?.parent;
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
