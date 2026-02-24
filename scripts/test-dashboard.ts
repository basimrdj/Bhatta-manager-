import { GET } from '../app/api/dashboard/route'

async function main() {
  console.log('Testing Dashboard API...')
  const res = await GET()
  if (res.status === 200) {
    const data = await res.json()
    console.log('Dashboard Data:', JSON.stringify(data, null, 2))
  } else {
    console.error('Failed to fetch dashboard')
  }
}

main().catch(console.error)
