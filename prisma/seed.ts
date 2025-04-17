import { PrismaClient, Role } from '@prisma/client'
import { hash } from 'bcrypt'
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

seedAdmin()
