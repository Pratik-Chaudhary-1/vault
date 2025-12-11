import prisma from "../../config/prisma.js";

export const searchUsers = async (query) => {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const searchTerm = query.trim();

  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          username: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
    },
    take: 20,
  });

  return users;
};

export const getUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  });

  return user;
};

