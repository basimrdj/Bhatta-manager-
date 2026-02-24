import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: {
          select: { dispatches: true, payments: true }
        }
      }
    })
    return NextResponse.json(customers)
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone } = body

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and Phone are required' }, { status: 400 })
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        phone,
        altPhone: body.altPhone,
        cnic: body.cnic,
        address: body.address,
        siteLocation: body.siteLocation,
        customerType: body.customerType || 'individual',
        creditLimit: body.creditLimit ? parseFloat(body.creditLimit) : null,
        paymentTerms: body.paymentTerms ? parseInt(body.paymentTerms) : 0,
        notes: body.notes,
      },
    })
    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
  }
}
