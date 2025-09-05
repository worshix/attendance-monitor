import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// function to get all attendance records in the database
export async function GET() {
  try {
    // Fetch all attendance records from the database with authorization and lecture
    const attendanceRecords = await prisma.attendance.findMany({
      include: {
        authorization: true,
        lecture: true,
      },
    });
    return NextResponse.json(attendanceRecords);
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// function to delete all attedance records in the database
export async function DELETE() {
  try {
    const deletedRecords = await prisma.attendance.deleteMany();
    return NextResponse.json({
      message: "All attendance records deleted successfully",
      count: deletedRecords.count,
    });
  } catch (error) {
    console.error("Error deleting attendance records:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// functioning to create a new attendance record in the database
export async function POST(request: NextRequest) {
  try {
    const { rfid_code, lecture_rfid_code } = await request.json();

    if (!rfid_code || !lecture_rfid_code) {
      return NextResponse.json(
        { error: "rfid_code and lecture_rfid_code are required" },
        { status: 400 }
      );
    }

    const newAttendance = await prisma.attendance.create({
      data: {
        rfid_code,
        lecture_rfid_code,
      },
    });
    return NextResponse.json(newAttendance, { status: 201 });
  } catch (error) {
    console.error("Error creating attendance record:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
