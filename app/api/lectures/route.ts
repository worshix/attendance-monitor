import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const lectures = await prisma.lecture.findMany();
    return NextResponse.json(lectures);
  } catch (error) {
    console.error("Error fetching lectures:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lecture_rfid_code, course } = body;

    if (!lecture_rfid_code || !course) {
      return NextResponse.json(
        { error: "lecture_rfid_code and course are required" },
        { status: 400 }
      );
    }

    const newLecture = await prisma.lecture.create({
      data: {
        lecture_rfid_code,
        course,
      },
    });

    return NextResponse.json(newLecture, { status: 201 });
  } catch (error) {
    console.error("Error creating lecture:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { lecture_rfid_code, course } = body;

    if (!lecture_rfid_code) {
      return NextResponse.json(
        { error: "lecture_rfid_code is required" },
        { status: 400 }
      );
    }

    const updatedLecture = await prisma.lecture.update({
      where: {
        lecture_rfid_code: lecture_rfid_code,
      },
      data: {
        course,
      },
    });

    return NextResponse.json(updatedLecture);
  } catch (error) {
    console.error("Error updating lecture:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const lectureRfidCode = req.nextUrl.searchParams.get("lecture_rfid_code");

  if (!lectureRfidCode) {
    return NextResponse.json(
      { error: "lecture_rfid_code is required" },
      { status: 400 }
    );
  }

  try {
    await prisma.lecture.delete({
      where: {
        lecture_rfid_code: lectureRfidCode,
      },
    });

    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    console.error("Error deleting lecture:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
