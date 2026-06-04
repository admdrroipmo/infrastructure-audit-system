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
    const { fullName, email, password, psgcId, accessLevel } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash: hashedPassword,
        psgcId,
        accessLevel,
      },
    });
    res.json(user);
  } catch (error) {
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

module.exports = router;
