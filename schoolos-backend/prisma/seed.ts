import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

declare const process: any;

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = "password123";

async function upsertUsers() {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  const now = new Date();

  const principal = await prisma.users.upsert({
    where: { email: "saurav@gyansetu.com" },
    update: {
      name: "Principal Saurav",
      role: "admin",
      password: passwordHash,
    },
    create: {
      v: 0,
      name: "Principal Saurav",
      email: "saurav@gyansetu.com",
      role: "admin",
      password: passwordHash,
      phone: "9999999999",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
  });

  const teacherUser = await prisma.users.upsert({
    where: { email: "ram@gyansetu.com" },
    update: {
      name: "Ram",
      role: "teacher",
      password: passwordHash,
    },
    create: {
      v: 0,
      name: "Ram",
      email: "ram@gyansetu.com",
      role: "teacher",
      password: passwordHash,
      phone: "8888888888",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
  });

  await prisma.teachers.upsert({
    where: { userId: teacherUser.id },
    update: {
      qualification: "B.Ed",
    },
    create: {
      userId: teacherUser.id,
      v: 0,
      qualification: "B.Ed",
      sectionIds: [],
      subjectIds: [],
      createdAt: now,
      updatedAt: now,
    },
  });

  const studentUser = await prisma.users.upsert({
    where: { email: "aarav@gyansetu.com" },
    update: {
      name: "Aarav",
      role: "student",
      password: passwordHash,
    },
    create: {
      v: 0,
      name: "Aarav",
      email: "aarav@gyansetu.com",
      role: "student",
      password: passwordHash,
      phone: "7777777777",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
  });

  await prisma.students.upsert({
    where: { userId: studentUser.id },
    update: {
      rollNo: "001",
    },
    create: {
      userId: studentUser.id,
      v: 0,
      rollNo: "001",
      address: "123 Main Street",
      admissionDate: now,
      parentName: "Parent Aarav",
      parentPhone: "6666666666",
      createdAt: now,
      updatedAt: now,
    },
  });

  return {
    principal,
    teacherUser,
    studentUser,
  };
}

async function main() {
  const { principal, teacherUser, studentUser } = await upsertUsers();

  console.log("Seed complete");
  console.log(`Principal: ${principal.email} / ${DEFAULT_PASSWORD}`);
  console.log(`Teacher: ${teacherUser.email} / ${DEFAULT_PASSWORD}`);
  console.log(`Student: ${studentUser.email} / ${DEFAULT_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
