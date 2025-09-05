import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const lectureRfidCode = req.nextUrl.searchParams.get("lecture_rfid_code");

  if (!lectureRfidCode) {
    return NextResponse.json(
      { error: "lecture_rfid_code is required" },
      { status: 400 }
    );
  }

  try {
    const lecture = await prisma.lecture.findUnique({
      where: {
        lecture_rfid_code: lectureRfidCode,
      },
    });

    if (!lecture) {
      return NextResponse.json({ error: "Lecture not found" }, { status: 404 });
    }

    return NextResponse.json(lecture);
  } catch (error) {
    console.error("Error fetching lecture:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
