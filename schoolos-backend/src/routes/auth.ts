import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { protect, AuthRequest } from "../middleware/auth";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const now = new Date();

    // Validate inputs
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        v: 0,
        name,
        email,
        password: hashedPassword,
        role,
        phone: typeof phone === "string" ? phone : "",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    });

    if (role === "student") {
      await prisma.students.create({
        data: {
          v: 0,
          userId: user.id,
          rollNo: "00",
          address: "N/A",
          admissionDate: new Date(),
          parentName: "N/A",
          parentPhone: "N/A",
          createdAt: now,
          updatedAt: now,
        },
      });
    }

    if (role === "teacher") {
      await prisma.teachers.create({
        data: {
          v: 0,
          userId: user.id,
          qualification: "N/A",
          sectionIds: [],
          subjectIds: [],
          createdAt: now,
          updatedAt: now,
        },
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/me", protect, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true },
    });
    res.json(user);
  } catch (error: any) {
    console.error("Me endpoint error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
