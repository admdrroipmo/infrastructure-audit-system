const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all form elements for a specific form type
router.get("/fields/:formType", async (req, res) => {
  try {
    const { formType } = req.params;
    const elements = await prisma.formField.findMany({
      where: { formType, isActive: true },
      orderBy: { order: "asc" },
    });
    res.json(elements);
  } catch (error) {
    console.error("Error fetching elements:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new form element (TITLE, SUBTITLE, or FIELD)
router.post("/fields", async (req, res) => {
  try {
    const {
      formType,
      elementType,
      fieldKey,
      fieldLabel,
      fieldType,
      options,
      validation,
      order,
      parentId,
    } = req.body;

    const element = await prisma.formField.create({
      data: {
        formType,
        elementType,
        fieldKey: elementType === "FIELD" ? fieldKey : null,
        fieldLabel: fieldLabel || null,
        fieldType: elementType === "FIELD" ? fieldType : null,
        options: options || null,
        validation: validation || null,
        order: order || 0,
        parentId: parentId || null,
      },
    });
    res.json(element);
  } catch (error) {
    console.error("Error creating element:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update a form element
router.put("/fields/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const element = await prisma.formField.update({
      where: { id },
      data: req.body,
    });
    res.json(element);
  } catch (error) {
    console.error("Error updating element:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a form element
router.delete("/fields/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.formField.delete({
      where: { id },
    });
    res.json({ message: "Element deleted successfully" });
  } catch (error) {
    console.error("Error deleting element:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
