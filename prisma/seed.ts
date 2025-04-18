import { PrismaClient, Role } from '@prisma/client'
import { hash } from 'bcrypt'
import { faker } from '@faker-js/faker'
import { ADMIN_CONFIG } from '../src/config/admin'

const prisma = new PrismaClient()

async function seedAdmin() {
  const hashedPassword = await hash(ADMIN_CONFIG.password as string, 12)
  
  await prisma.user.upsert({
    where: { email: ADMIN_CONFIG.email },
    update: {},
    create: {
      email: ADMIN_CONFIG.email as string,
      password: hashedPassword,
      role: ADMIN_CONFIG.role as Role,
    }
  })
}

async function seedProducts() {
  const products = Array.from({ length: 10 }).map(() => ({
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    stock: faker.number.int({ min: 10, max: 100 }),
    categoryId: 1,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }))

  await prisma.product.createMany({
    data: products,
    skipDuplicates: true
  })
}

async function main() {
  await seedAdmin()
  await seedProducts()
  console.log('Seeding completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

