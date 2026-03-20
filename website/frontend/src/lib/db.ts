import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Set a 30-second statement timeout at the PostgreSQL session level
// to prevent slow queries from hanging connections indefinitely.
prisma.$connect().then(async () => {
  await prisma.$executeRaw`SET statement_timeout = '30s'`;
}).catch(() => {
  // Non-fatal – app can still start without this optimisation
});

export default prisma;
