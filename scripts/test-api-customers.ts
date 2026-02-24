import { GET, POST } from '../app/api/customers/route'
import { NextRequest } from 'next/server'

async function main() {
  console.log('Testing Customer API...')

  // Test POST
  const body = {
    name: 'API Test Customer',
    phone: '03009999999',
    siteLocation: 'Test Site'
  }

  const req = new Request('http://localhost/api/customers', {
    method: 'POST',
    body: JSON.stringify(body)
  })

  console.log('Sending POST request...')
  const postRes = await POST(req)
  console.log('POST Status:', postRes.status)

  if (postRes.status === 201 || postRes.status === 200) {
    const data = await postRes.json()
    console.log('Created Customer:', data.name)
  } else {
    console.error('Failed to create customer')
  }

  // Test GET
  console.log('Sending GET request...')
  const getRes = await GET()
  console.log('GET Status:', getRes.status)

  if (getRes.status === 200) {
    const data = await getRes.json()
    console.log('Customer Count:', data.length)
    const found = data.find((c: any) => c.phone === '03009999999')
    console.log('Found created customer:', found ? 'Yes' : 'No')
  }
}

main().catch(console.error)
