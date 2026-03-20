import express from "express";
import { PrismaClient } from "@prisma/client";
import { protect, AuthRequest } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

// POST add a fee record
router.post("/", protect, async (req: AuthRequest, res) => {
  try {
    const { studentId, amount, feeType, status, dueDate, note } = req.body;
    const fee = await prisma.feeRecord.create({
      data: {
        studentId: Number(studentId),
        amount: Number(amount),
        feeType,
        status,
        dueDate: new Date(dueDate),
        note,
      },
    });
    res.status(201).json(fee);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PUT record a payment
router.put("/:id/pay", protect, async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;
    const fee = await prisma.feeRecord.update({
      where: { id: Number(req.params.id) },
      data: {
        status,
        paidDate: new Date(),
      },
    });
    res.json(fee);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET all fee records
router.get("/", protect, async (req: AuthRequest, res) => {
  try {
    const fees = await prisma.feeRecord.findMany({
      include: {
        student: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(fees);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET fee records by student
router.get("/student/:studentId", protect, async (req: AuthRequest, res) => {
  try {
    const fees = await prisma.feeRecord.findMany({
      where: { studentId: Number(req.params.studentId) },
      orderBy: { createdAt: "desc" },
    });
    res.json(fees);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
