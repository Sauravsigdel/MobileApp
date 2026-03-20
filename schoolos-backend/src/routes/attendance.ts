import express from "express";
import { PrismaClient } from "@prisma/client";
import { protect, AuthRequest } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

// POST mark attendance
router.post("/", protect, async (req: AuthRequest, res) => {
  try {
    const { studentId, teacherId, date, status, subject } = req.body;
    const attendance = await prisma.attendance.create({
      data: {
        studentId: Number(studentId),
        teacherId: Number(teacherId),
        date: new Date(date),
        status,
        subject,
      },
    });
    res.status(201).json(attendance);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET attendance by student
router.get("/student/:studentId", protect, async (req: AuthRequest, res) => {
  try {
    const attendance = await prisma.attendance.findMany({
      where: { studentId: Number(req.params.studentId) },
      orderBy: { date: "desc" },
    });
    res.json(attendance);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET attendance by class and date
router.get("/class/:class", protect, async (req: AuthRequest, res) => {
  try {
    const { date } = req.query;
    const attendance = await prisma.attendance.findMany({
      where: {
        subject: req.params.class,
        ...(date ? { date: new Date(date as string) } : {}),
      },
      include: {
        student: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
    });
    res.json(attendance);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
