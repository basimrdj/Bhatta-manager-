import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay } from 'date-fns'

export async function GET() {
  try {
    const todayStart = startOfDay(new Date())
    const todayEnd = endOfDay(new Date())

    // 1. Today's Sales
    const todaySales = await prisma.saleDispatch.aggregate({
      where: {
        dispatchDate: {
          gte: todayStart,
          lte: todayEnd
        }
      },
      _sum: {
        totalAmount: true,
        amountReceived: true // Cash collected via dispatch
      },
      _count: {
        id: true
      }
    })

    // 2. Today's Payments (Separate receipts)
    const todayPayments = await prisma.payment.aggregate({
      where: {
        date: {
          gte: todayStart,
          lte: todayEnd
        }
      },
      _sum: {
        amount: true
      },
      _count: {
        id: true
      }
    })

    // 3. Total Outstanding
    const totalOutstanding = await prisma.saleDispatch.aggregate({
      where: {
        status: { not: 'paid' }
      },
      _sum: {
        balanceDue: true
      }
    })

    // 4. Stock Summary
    const stockSums = await prisma.stockLedger.groupBy({
      by: ['gradeId'],
      _sum: { quantity: true }
    })

    const grades = await prisma.brickGrade.findMany({
      select: { id: true, code: true, nameEn: true, nameLocal: true }
    })

    const stockMap = new Map(stockSums.map(s => [s.gradeId, s._sum.quantity || 0]))
    const stockSummary = grades.map(g => ({
      id: g.id,
      code: g.code,
      name: g.nameEn, // simplified for dashboard
      nameLocal: g.nameLocal,
      quantity: stockMap.get(g.id) || 0
    }))

    // 5. Recent Activity
    const recentDispatches = await prisma.saleDispatch.findMany({
      take: 5,
      orderBy: { dispatchDate: 'desc' },
      include: { customer: { select: { name: true } } }
    })

    const recentPayments = await prisma.payment.findMany({
      take: 5,
      orderBy: { date: 'desc' },
      include: { customer: { select: { name: true } } }
    })

    return NextResponse.json({
      today: {
        salesAmount: todaySales._sum.totalAmount || 0,
        salesCount: todaySales._count.id || 0,
        cashCollected: (todaySales._sum.amountReceived || 0) + (todayPayments._sum.amount || 0),
      },
      outstanding: totalOutstanding._sum.balanceDue || 0,
      stock: stockSummary,
      recent: {
        dispatches: recentDispatches,
        payments: recentPayments
      }
    })

  } catch (error) {
    console.error('Error fetching dashboard:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard' }, { status: 500 })
  }
}
