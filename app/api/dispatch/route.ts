import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      customerId, dispatchDate, items,
      paymentType, amountReceived, notes,
      vehicleType, vehicleNo, driverName,
      subtotal, transportCost, loadingCost, discount, totalAmount
    } = body

    // Validation
    if (!customerId || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Dispatch Header
      const received = parseFloat(amountReceived || 0)
      const total = parseFloat(totalAmount)
      const balance = total - received

      const dispatch = await tx.saleDispatch.create({
        data: {
          customerId: parseInt(customerId),
          dispatchDate: new Date(dispatchDate || new Date()),
          vehicleType,
          vehicleNo,
          driverName,
          subtotal: parseFloat(subtotal),
          transportCost: parseFloat(transportCost || 0),
          loadingCost: parseFloat(loadingCost || 0),
          discount: parseFloat(discount || 0),
          totalAmount: total,
          paymentType, // cash, credit, partial
          amountReceived: received,
          balanceDue: balance,
          notes,
          status: balance <= 0 ? 'paid' : (received > 0 ? 'partial' : 'open'),
        }
      })

      // 2. Create Items & Stock Ledger Entries
      for (const item of items) {
        const qty = parseInt(item.quantity)

        await tx.saleDispatchItem.create({
          data: {
            dispatchId: dispatch.id,
            gradeId: parseInt(item.gradeId),
            quantity: qty,
            rate: parseFloat(item.rate),
            amount: parseFloat(item.amount),
            unit: item.unit || 'pieces',
          }
        })

        // Update Stock Ledger (Negative quantity for dispatch)
        await tx.stockLedger.create({
          data: {
            gradeId: parseInt(item.gradeId),
            quantity: -Math.abs(qty),
            transactionType: 'dispatch',
            referenceType: 'dispatch',
            referenceId: dispatch.id,
            date: new Date(dispatchDate || new Date()),
            notes: `Dispatch #${dispatch.id}`
          }
        })
      }

      // 3. Create Payment if amount received > 0
      if (received > 0) {
        const payment = await tx.payment.create({
          data: {
            customerId: parseInt(customerId),
            date: new Date(dispatchDate || new Date()),
            amount: received,
            method: paymentType === 'credit' ? 'cash' : (paymentType === 'partial' ? 'cash' : paymentType),
            // Defaulting 'partial'/'credit' with amount to 'cash' unless specified differently.
            // Ideally frontend sends method (cash/online) separate from type (credit/partial).
            notes: `Payment for Dispatch #${dispatch.id}`,
            reference: `Dispatch #${dispatch.id}`,
          }
        })

        // Allocate payment to this dispatch
        await tx.paymentAllocation.create({
          data: {
            paymentId: payment.id,
            dispatchId: dispatch.id,
            amount: received,
          }
        })
      }

      return dispatch
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating dispatch:', error)
    return NextResponse.json({ error: 'Failed to create dispatch' }, { status: 500 })
  }
}
