import { PrismaClient } from "@/lib/generated/prisma";
import { NextResponse } from "next/server";

// function to get all attendance records in the database
export async function GET() {
const prisma = new PrismaClient();
  try {
    // Fetch all attendance records from the database with authorization
    const attendanceRecords = await prisma.attendance.findMany({
      include: {
        authorization:{
          
        }
      }
      
    });
    return NextResponse.json(attendanceRecords);
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// function to delete all attedance records in the database
export async function DELETE() {
    const prisma = new PrismaClient();
    try {
        const deletedRecords = await prisma.attendance.deleteMany();
        return NextResponse.json({ message: "All attendance records deleted successfully", count: deletedRecords.count });
    }catch (error) {
        console.error("Error deleting attendance records:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}