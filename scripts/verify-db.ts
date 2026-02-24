import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const grades = await prisma.brickGrade.findMany()
  console.log('Brick Grades:', grades)

  const customers = await prisma.customer.findMany()
  console.log('Customers:', customers)
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
