import prisma from "../../config/prisma.js";
import { hashPassword, comparePassword } from "../../utils/hashing.js";
import { generateToken } from "../../utils/token.js";

/**
 * Auth Service - Business logic for authentication
 */

export const registerUser = async (userData) => {
  const { username, email, password, name } = userData;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Check if username exists
  const existingUsername = await prisma.user.findUnique({ where: { username } });
  if (existingUsername) {
    throw new Error("Username already taken");
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      name: name || username, // Use provided name or fallback to username
      username,
      email,
      passwordHash: passwordHash,
    },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      createdAt: true,
    },
  });

  return user;
};

export const loginUser = async (email, password) => {
  // Find user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Verify password
  const validPassword = await comparePassword(password, user.passwordHash);
  if (!validPassword) {
    throw new Error("Invalid credentials");
  }

  // Generate token
  const token = generateToken({
    id: user.id,
    email: user.email,
    username: user.username,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
    },
  };
};

