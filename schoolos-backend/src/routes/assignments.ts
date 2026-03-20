import express from "express";
import { PrismaClient } from "@prisma/client";
import { protect, AuthRequest } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

// POST create assignment
router.post("/", protect, async (req: AuthRequest, res) => {
  try {
    const { teacherId, title, subject, class: className, dueDate } = req.body;
    const assignment = await prisma.assignment.create({
      data: {
        teacherId: Number(teacherId),
        title,
        subject,
        class: className,
        dueDate: new Date(dueDate),
      },
    });
    res.status(201).json(assignment);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET all assignments
router.get("/", protect, async (req: AuthRequest, res) => {
  try {
    const assignments = await prisma.assignment.findMany({
      include: {
        teacher: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
      orderBy: { dueDate: "asc" },
    });
    res.json(assignments);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET assignments by class
router.get("/class/:class", protect, async (req: AuthRequest, res) => {
  try {
    const assignments = await prisma.assignment.findMany({
      where: { class: String(req.params.class) },
      include: {
        teacher: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
      orderBy: { dueDate: "asc" },
    });
    res.json(assignments);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
