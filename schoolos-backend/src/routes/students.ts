import express from "express";
import { PrismaClient } from "@prisma/client";
import { protect, AuthRequest } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

// GET all students
router.get("/", protect, async (req: AuthRequest, res) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });
    res.json(students);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET single student by ID
router.get("/:id", protect, async (req: AuthRequest, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        attendance: true,
        feeRecords: true,
      },
    });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET my own student profile (for student role)
router.get("/me/profile", protect, async (req: AuthRequest, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { userId: req.user.id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        attendance: true,
        feeRecords: true,
      },
    });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
