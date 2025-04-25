// app/api/schedules/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const schedules = await prisma.schedule.findMany({
      include: {
        user: true
      },
      orderBy: {
        date: 'asc'
      }
    });
    
    return NextResponse.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, date, startTime, endTime } = await request.json();
    
    // Validar que o horário de término é posterior ao de início
    if (startTime >= endTime) {
      return NextResponse.json(
        { error: 'End time must be after start time' },
        { status: 400 }
      );
    }
    
    const overlappingSchedule = await prisma.schedule.findFirst({
      where: {
        date: new Date(date),
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } }
            ]
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } }
            ]
          },
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } }
            ]
          }
        ]
      }
    });
    
    if (overlappingSchedule) {
      return NextResponse.json(
        { error: 'Schedule overlaps with an existing schedule' },
        { status: 400 }
      );
    }
    
    const schedule = await prisma.schedule.create({
      data: {
        userId,
        date: new Date(date),
        startTime,
        endTime
      },
      include: {
        user: true
      }
    });
    
    return NextResponse.json(schedule, { status: 201 });
  } catch (error) {
    console.error('Error creating schedule:', error);
    return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 });
  }
}
