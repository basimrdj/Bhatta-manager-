import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const customerId = parseInt(id)

    if (isNaN(customerId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        dispatches: {
          orderBy: { dispatchDate: 'desc' },
          take: 20,
          include: { items: { include: { grade: true } } }
        },
        payments: {
          orderBy: { date: 'desc' },
          take: 20
        },
        _count: {
          select: { dispatches: true, payments: true }
        }
      }
    })

    const totalBalance = await prisma.saleDispatch.aggregate({
      where: { customerId, status: { not: 'paid' } },
      _sum: { balanceDue: true }
    })

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...customer,
      totalBalance: totalBalance._sum.balanceDue || 0
    })
  } catch (error) {
    console.error('Error fetching customer:', error)
    return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 })
  }
}
