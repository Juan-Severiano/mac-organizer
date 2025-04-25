import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const currentUser = await prisma.currentUser.findFirst({
      include: {
        user: true
      }
    });
    
    return NextResponse.json(currentUser);
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json({ error: 'Failed to fetch current user' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    
    await prisma.currentUser.deleteMany();
    
    const currentUser = await prisma.currentUser.create({
      data: { userId },
      include: {
        user: true
      }
    });
    
    return NextResponse.json(currentUser, { status: 201 });
  } catch (error) {
    console.error('Error updating current user:', error);
    return NextResponse.json({ error: 'Failed to update current user' }, { status: 500 });
  }
}
