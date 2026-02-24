import { POST as dispatchPost } from '../app/api/dispatch/route'
import { GET as stockGet } from '../app/api/stock/route'
import { NextRequest } from 'next/server'

async function main() {
  console.log('Testing Dispatch API...')

  // 1. Get initial stock
  // Need to mock Request object for GET too? No, GET takes no args in my implementation.
  // Wait, stock GET doesn't use request. But Next.js might pass it.

  const stockRes = await stockGet()
  const stockData = await stockRes.json()

  // Find Grade A (id might vary, check code)
  const gradeA = stockData.find((g: any) => g.code === 'A')
  if (!gradeA) {
    console.error('Grade A not found in stock response')
    return
  }
  const initialStock = gradeA.currentStock || 0
  console.log('Initial Stock (Grade A):', initialStock)

  // 2. Create Dispatch
  const dispatchBody = {
    customerId: 1, // Assuming ID 1 exists from seed
    dispatchDate: new Date().toISOString(),
    items: [
      { gradeId: gradeA.id, quantity: 1000, rate: 14500, amount: 14500, unit: 'pieces' }
    ],
    paymentType: 'credit',
    amountReceived: 0,
    totalAmount: 14500,
    subtotal: 14500,
    vehicleType: 'Tractor'
  }

  const dispatchReq = new Request('http://localhost/api/dispatch', {
    method: 'POST',
    body: JSON.stringify(dispatchBody)
  })

  const dispatchRes = await dispatchPost(dispatchReq)
  console.log('Dispatch POST Status:', dispatchRes.status)

  if (dispatchRes.status !== 201) {
    const err = await dispatchRes.json()
    console.error('Dispatch failed:', err)
    return
  }

  // 3. Verify Stock Update
  const stockRes2 = await stockGet()
  const stockData2 = await stockRes2.json()
  const gradeA2 = stockData2.find((g: any) => g.code === 'A')
  const newStock = gradeA2?.currentStock || 0
  console.log('New Stock (Grade A):', newStock)

  if (newStock === initialStock - 1000) {
    console.log('SUCCESS: Stock decreased correctly.')
  } else {
    console.error(`FAILURE: Stock mismatch. Expected ${initialStock - 1000}, got ${newStock}`)
  }
}

main().catch(console.error)
