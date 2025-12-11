import prisma from "../../config/prisma.js";

/**
 * User Service - Business logic for user operations
 */

/**
 * Search users by username or email
 * Returns only public profile fields (id, name)
 */
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
      // Note: email and username are excluded for privacy per requirements
    },
    take: 20, // Limit results
  });

  return users;
};

/**
 * Get user by ID (public profile only)
 */
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

