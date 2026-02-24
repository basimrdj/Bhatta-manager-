import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { customerId, date, amount, method, notes, allocationType } = body

    if (!customerId || !amount) {
      return NextResponse.json({ error: 'Customer and Amount required' }, { status: 400 })
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Payment
      const paymentAmt = parseFloat(amount)
      const payment = await tx.payment.create({
        data: {
          customerId: parseInt(customerId),
          date: new Date(date || new Date()),
          amount: paymentAmt,
          method: method || 'cash',
          notes,
        }
      })

      // 2. Allocate to outstanding invoices
      // Default to auto allocation if not specified or 'auto'
      if (!allocationType || allocationType === 'auto') {
        // Find unpaid dispatches
        const unpaidDispatches = await tx.saleDispatch.findMany({
          where: {
            customerId: parseInt(customerId),
            status: { not: 'paid' },
            balanceDue: { gt: 0 } // ensure positive balance
          },
          orderBy: { dispatchDate: 'asc' } // Oldest first
        })

        let remainingAmount = paymentAmt

        for (const dispatch of unpaidDispatches) {
          if (remainingAmount <= 0) break

          const allocate = Math.min(remainingAmount, dispatch.balanceDue)

          if (allocate > 0) {
            await tx.paymentAllocation.create({
              data: {
                paymentId: payment.id,
                dispatchId: dispatch.id,
                amount: allocate
              }
            })

            // Update dispatch balance
            const newBalance = dispatch.balanceDue - allocate
            await tx.saleDispatch.update({
              where: { id: dispatch.id },
              data: {
                balanceDue: newBalance,
                status: newBalance <= 0.01 ? 'paid' : 'partial' // float tolerance
              }
            })

            remainingAmount -= allocate
          }
        }
      }

      return payment
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 })
  }
}
