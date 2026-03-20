import express from "express";
import { PrismaClient } from "@prisma/client";
import { protect, AuthRequest } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

// POST send a message
router.post("/", protect, async (req: AuthRequest, res) => {
  try {
    const { receiverId, content } = req.body;
    const message = await prisma.message.create({
      data: {
        senderId: req.user.id,
        receiverId: Number(receiverId),
        content,
      },
    });
    res.status(201).json(message);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET my conversations
router.get("/", protect, async (req: AuthRequest, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: req.user.id }, { receiverId: req.user.id }],
      },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET messages between two users
router.get("/:userId", protect, async (req: AuthRequest, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.id, receiverId: Number(req.params.userId) },
          { senderId: Number(req.params.userId), receiverId: req.user.id },
        ],
      },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "asc" },
    });
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
