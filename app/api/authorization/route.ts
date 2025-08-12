import { PrismaClient } from '@/lib/generated/prisma';
import { NextResponse, NextRequest } from 'next/server';


//if there is a search parameter 'userId', fetch the user details from the database
//and return the user details as a JSON response
//if the userId is not provided, return all users
//if the user is not found, return a 404 error
export async function GET(request: NextRequest) {
  const prisma = new PrismaClient();
  const rfid_code = request.nextUrl.searchParams.get('rfid_code');

  try {
    if (rfid_code) {
      const authorization = await prisma.authorization.findUnique({
        where: {rfid_code},
      });

      if (!authorization) {
        return NextResponse.json({ error: 'Authorization not found' }, { status: 404 });
      }

      return NextResponse.json(authorization);
    } else {
      const authorizations = await prisma.authorization.findMany();
      return NextResponse.json(authorizations);
    }
  } catch (error) {
    console.error('Error fetching authorization:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// for updating an authorization
export async function PUT(request: NextRequest) {
  const prisma = new PrismaClient();
  const { rfid_code, ...data } = await request.json();

  try {
    const updatedAuthorization = await prisma.authorization.update({
      where: { rfid_code },
      data,
    });

    return NextResponse.json(updatedAuthorization);
  } catch (error) {
    console.error('Error updating authorization:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// for deleting an authorization
export async function DELETE(request: NextRequest) {
  const prisma = new PrismaClient();
  const rfid_code = request.nextUrl.searchParams.get('rfid_code');

  try {
    if (!rfid_code) {
      return NextResponse.json({ error: 'RFID code is required' }, { status: 400 });
    }

    const deletedAuthorization = await prisma.authorization.delete({
      where: { rfid_code },
    });

    return NextResponse.json(deletedAuthorization);
  } catch (error) {
    console.error('Error deleting authorization:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

//for creating a new authorization
export async function POST(request: NextRequest) {
  const prisma = new PrismaClient();
  const data = await request.json();

  try {
    const newAuthorization = await prisma.authorization.create({
      data,
    });

    return NextResponse.json(newAuthorization, { status: 201 });
  } catch (error) {
    console.error('Error creating authorization:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}