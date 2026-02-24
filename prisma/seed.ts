import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 1. Users
  const adminEmail = 'admin@example.com'
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Kiln Owner',
      email: adminEmail,
      password: 'hashed_password_placeholder', // In real app, hash this
      role: 'admin',
    },
  })
  console.log({ admin })

  // 2. Brick Grades
  const grades = [
    { nameEn: 'First Class', nameLocal: 'Awwal', code: 'A', defaultRate: 14500, trackStock: true, isWastage: false },
    { nameEn: 'Second Class', nameLocal: 'Doem', code: 'B', defaultRate: 13500, trackStock: true, isWastage: false },
    { nameEn: 'Third Class', nameLocal: 'Soem', code: 'C', defaultRate: 12000, trackStock: true, isWastage: false },
    { nameEn: 'Pila / Yellow', nameLocal: 'Pila', code: 'P', defaultRate: 10000, trackStock: true, isWastage: false },
    { nameEn: 'Jhama / Overburnt', nameLocal: 'Jhama', code: 'J', defaultRate: 8000, trackStock: true, isWastage: false },
    { nameEn: 'Wastage / Broken', nameLocal: 'Rora', code: 'W', defaultRate: 2000, trackStock: false, isWastage: true },
  ]

  const count = await prisma.brickGrade.count()
  if (count === 0) {
    console.log('Creating brick grades...')
    for (const grade of grades) {
      await prisma.brickGrade.create({
        data: grade,
      })
    }
  } else {
    console.log('Brick grades already exist.')
  }

  // 3. Sample Customers
  const customers = [
    { name: 'Ahmed Construction', phone: '03001234567', siteLocation: 'Gulberg Phase 3', creditLimit: 500000 },
    { name: 'Bashir Contractor', phone: '03219876543', siteLocation: 'DHA Phase 6', creditLimit: 1000000 },
  ]

  for (const cust of customers) {
    const exists = await prisma.customer.findFirst({ where: { phone: cust.phone } })
    if (!exists) {
      await prisma.customer.create({ data: cust })
    }
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
