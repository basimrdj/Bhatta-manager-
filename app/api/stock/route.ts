import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // 1. Get all grades
    const grades = await prisma.brickGrade.findMany({
      orderBy: { code: 'asc' }
    })

    // 2. Get stock sums
    const stockSums = await prisma.stockLedger.groupBy({
      by: ['gradeId'],
      _sum: { quantity: true }
    })

    // 3. Map sums to grades
    const stockMap = new Map(stockSums.map(s => [s.gradeId, s._sum.quantity || 0]))

    const result = grades.map(grade => ({
      ...grade,
      currentStock: stockMap.get(grade.id) || 0
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching stock:', error)
    return NextResponse.json({ error: 'Failed to fetch stock' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { gradeId, quantity, type, notes } = body

    // Validate
    if (!gradeId || !quantity || !type) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Determine sign based on type
    let finalQty = parseInt(quantity)
    if (['dispatch', 'wastage'].includes(type)) {
      finalQty = -Math.abs(finalQty)
    } else {
      finalQty = Math.abs(finalQty)
    }

    const entry = await prisma.stockLedger.create({
      data: {
        gradeId: parseInt(gradeId),
        quantity: finalQty,
        transactionType: type,
        notes,
        date: new Date(),
      }
    })

    return NextResponse.json(entry)
  } catch (error) {
    console.error('Error adjusting stock:', error)
    return NextResponse.json({ error: 'Failed to adjust stock' }, { status: 500 })
  }
}
