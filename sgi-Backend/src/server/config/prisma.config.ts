import { PrismaClient } from '@prisma/client'
import { usuarios_tipo } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())

export  { prisma}
