const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const globalForPrisma = global;
const prisma = globalForPrisma.prisma || new PrismaClient({});
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const createUser = async (data) => {
  const hashedPassword = data.pass
    ? await bcrypt.hash(data.pass, 10)
    : null;

  return prisma.user.create({
    data: {
      ...data,
      pass: hashedPassword,
    },
  });
};

const comparePassword = async (candidate, hashed) => {
  return bcrypt.compare(candidate, hashed);
};

module.exports = {
  prisma,
  createUser,
  comparePassword
};
